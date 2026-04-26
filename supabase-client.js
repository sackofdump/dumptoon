/* Supabase auth wrapper + state sync.
   Exposes window.dtAuth — auth methods AND syncUp / syncDown that mirror
   the localStorage state to the profiles + inventory tables. Works without
   config (returns "guest" everywhere) so guest mode keeps functioning. */

(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const configured = !!(cfg.url && cfg.anonKey && window.supabase);
  let client = null;
  if (configured) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
  }

  const listeners = new Set();
  let cachedUser = null;
  // Persist across page navigations so we don't max-merge old server state on
  // every page load (which was making just-sold cards reappear).
  const SYNC_KEY = 'dumptoon-last-sync-user';
  function getLastSyncedUserId() { try { return localStorage.getItem(SYNC_KEY); } catch { return null; } }
  function setLastSyncedUserId(id) { try { id ? localStorage.setItem(SYNC_KEY, id) : localStorage.removeItem(SYNC_KEY); } catch {} }

  async function refresh() {
    if (!client) { cachedUser = null; emit(); return null; }
    // getSession() reads the local cached session synchronously — no network round
    // trip. getUser() validates against the server and can spuriously return null
    // on slow/failed requests, which made the pill keep showing "SIGN IN TO SAVE"
    // even when a valid session existed.
    const { data } = await client.auth.getSession();
    cachedUser = data && data.session && data.session.user ? data.session.user : null;
    emit();
    return cachedUser;
  }
  function emit() { listeners.forEach(fn => { try { fn(cachedUser); } catch(e){} }); }

  /* ---- State sync helpers ---- */

  // Build a {cardId: qty} map from the flat inventory array.
  function countMap(inv) {
    const m = {};
    (inv || []).forEach(id => { m[id] = (m[id] || 0) + 1; });
    return m;
  }
  function expand(map) {
    const out = [];
    Object.entries(map).forEach(([id, qty]) => { for (let i = 0; i < qty; i++) out.push(id); });
    return out;
  }

  async function syncDown() {
    if (!client || !cachedUser || !window.__dt) return;
    try {
      const [{ data: profile }, { data: invRows }] = await Promise.all([
        client.from('profiles').select('coins_cents, username').eq('id', cachedUser.id).maybeSingle(),
        client.from('inventory').select('card_id, qty').eq('user_id', cachedUser.id),
      ]);

      const local = window.__dt.load();
      // Coins: take the higher of local vs remote so progress isn't lost on a fresh device.
      const remoteCoins = (profile && typeof profile.coins_cents === 'number') ? profile.coins_cents : 0;
      const localCoins  = local.coins || 0;
      local.coins = Math.max(localCoins, remoteCoins);

      // Inventory: union — for each card take MAX(localQty, remoteQty).
      const localCounts  = countMap(local.inventory);
      const remoteCounts = {};
      (invRows || []).forEach(r => { remoteCounts[r.card_id] = r.qty; });
      const merged = {};
      Object.keys(Object.assign({}, localCounts, remoteCounts)).forEach(id => {
        merged[id] = Math.max(localCounts[id] || 0, remoteCounts[id] || 0);
      });
      local.inventory = expand(merged);

      window.__dt.saveLocal(local);
      if (window.__dt.paintWallet) window.__dt.paintWallet();

      // Push the merged state back so server matches.
      await syncUp();
    } catch (e) {
      console.warn('[dtAuth] syncDown failed:', e.message || e);
    }
  }

  async function syncUp() {
    if (!client || !cachedUser || !window.__dt) return;
    try {
      const local = window.__dt.load();

      // Profile: upsert coins.
      const { error: pErr } = await client.from('profiles').upsert({
        id: cachedUser.id,
        coins_cents: local.coins || 0,
        username: cachedUser.email ? cachedUser.email.split('@')[0] : null,
      }, { onConflict: 'id' });
      if (pErr) console.warn('[dtAuth] profile upsert:', pErr.message);

      // Inventory: replace-all per user. Simpler than computing diffs.
      const { error: dErr } = await client.from('inventory').delete().eq('user_id', cachedUser.id);
      if (dErr) console.warn('[dtAuth] inventory delete:', dErr.message);

      const counts = countMap(local.inventory);
      const rows = Object.entries(counts).map(([id, qty]) => ({
        user_id: cachedUser.id, card_id: id, qty,
      }));
      if (rows.length) {
        const { error: iErr } = await client.from('inventory').insert(rows);
        if (iErr) console.warn('[dtAuth] inventory insert:', iErr.message);
      }
    } catch (e) {
      console.warn('[dtAuth] syncUp failed:', e.message || e);
    }
  }

  // Debounce save → upload bursts. 600ms is short enough that quick navigations
  // usually flush before the next page tries to syncDown.
  let upTimer = null;
  function debouncedSyncUp() {
    if (upTimer) clearTimeout(upTimer);
    upTimer = setTimeout(() => { upTimer = null; syncUp(); }, 600);
  }
  // Best-effort flush on page unload so an in-flight change isn't lost.
  window.addEventListener('beforeunload', () => {
    if (upTimer) { clearTimeout(upTimer); upTimer = null; syncUp(); }
  });

  window.dtAuth = {
    configured, client,
    async signUp(email, password) {
      if (!client) throw new Error('Supabase not configured');
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;
      await refresh();
      return data;
    },
    async signIn(email, password) {
      if (!client) throw new Error('Supabase not configured');
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await refresh();
      return data;
    },
    async sendMagicLink(email) {
      if (!client) throw new Error('Supabase not configured');
      const { error } = await client.auth.signInWithOtp({
        email, options: { emailRedirectTo: window.location.origin + '/index.html' }
      });
      if (error) throw error;
    },
    async signOut() {
      if (!client) return;
      await client.auth.signOut();
      setLastSyncedUserId(null);
      await refresh();
    },
    onChange(fn) { listeners.add(fn); fn(cachedUser); return () => listeners.delete(fn); },
    getUser() { return cachedUser; },
    async ready() { await refresh(); return cachedUser; },
    syncUp, syncDown, debouncedSyncUp,
  };

  // Auto-sync on auth state changes. syncDown only runs ONCE per user-browser
  // pair; subsequent page loads trust the local cache (which syncUp keeps fresh).
  async function maybeSync() {
    await refresh();
    if (cachedUser) {
      if (getLastSyncedUserId() !== cachedUser.id) {
        setLastSyncedUserId(cachedUser.id);
        await syncDown();
      }
    } else {
      setLastSyncedUserId(null);
    }
  }
  if (client) {
    client.auth.onAuthStateChange(maybeSync);
    maybeSync();
  }
})();

/* DOMContentLoaded — paint header pill + hook __dt.save → debouncedSyncUp. */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.dtAuth) return;

  // Wrap __dt.save so every state change pushes to Supabase when signed in.
  if (window.__dt && typeof window.__dt.save === 'function') {
    const original = window.__dt.save;
    window.__dt.saveLocal = original; // expose the un-wrapped save for sync code to use
    window.__dt.save = function (s) {
      original(s);
      if (window.dtAuth.getUser() && window.dtAuth.debouncedSyncUp) {
        window.dtAuth.debouncedSyncUp();
      }
    };
  }

  function paint(user) {
    document.querySelectorAll('#userPill').forEach(pill => {
      const coinsEl = pill.querySelector('#userCoins');
      const coinsText = coinsEl ? coinsEl.outerHTML : '';
      if (user) {
        const name  = user.user_metadata?.username || user.email.split('@')[0];
        const cloud = ' <span class="cloud-badge" title="Synced to cloud">☁</span>';
        pill.innerHTML = name + cloud + ' &middot; ' + coinsText;
      } else {
        // Guest mode: no name label. Just show the wallet — keeps the badge clean
        // and avoids the awkward "guest · $19.45". The "SIGNED IN AS" caption next
        // to the pill still flips to a SIGN IN prompt below.
        pill.innerHTML = coinsText + ' <a href="login.html" class="signin-link">SIGN IN TO SAVE</a>';
      }
    });
    document.querySelectorAll('.signed-in > span:first-child').forEach(label => {
      // The "SIGNED IN AS" caption next to the pill: hide for guests so the layout
      // doesn't read "SIGNED IN AS  $19.45" with no name.
      label.style.display = user ? '' : 'none';
    });
    document.querySelectorAll('.logout').forEach(btn => {
      btn.textContent = user ? 'LOGOUT' : 'LOGIN';
      btn.onclick = async () => {
        if (user) { await window.dtAuth.signOut(); window.location.reload(); }
        else { window.location.href = 'login.html'; }
      };
    });
    if (window.__dt && typeof window.__dt.paintWallet === 'function') {
      window.__dt.paintWallet();
    }
  }
  window.dtAuth.onChange(paint);

  // After auth resolves, ALWAYS force a re-paint with the actual current user.
  // Prevents the pill from getting stuck on the initial paint(null) if the auth
  // resolution happens between paint registration and the paint() actually
  // running with the right value.
  (async () => {
    try { await window.dtAuth.ready(); } catch {}
    const u = window.dtAuth.getUser();
    paint(u);
    if (!u && window.__dt && window.__dt.resetToDefault) {
      window.__dt.resetToDefault();
      paint(null);
    }
  })();
});
