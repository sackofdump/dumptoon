/* Thin auth wrapper around supabase-js.
   Exposes window.dtAuth — works without config (returns "guest" everywhere)
   so the existing pages keep functioning while auth is being set up. */

(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const configured = !!(cfg.url && cfg.anonKey && window.supabase);
  let client = null;
  if (configured) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
  }

  const listeners = new Set();
  let cachedUser = null;

  async function refresh() {
    if (!client) { cachedUser = null; emit(); return null; }
    const { data } = await client.auth.getUser();
    cachedUser = data && data.user ? data.user : null;
    emit();
    return cachedUser;
  }
  function emit() { listeners.forEach(fn => { try { fn(cachedUser); } catch(e){} }); }

  window.dtAuth = {
    configured,
    client,

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
        email,
        options: { emailRedirectTo: window.location.origin + '/index.html' }
      });
      if (error) throw error;
    },
    async signOut() {
      if (!client) return;
      await client.auth.signOut();
      await refresh();
    },
    onChange(fn) { listeners.add(fn); fn(cachedUser); return () => listeners.delete(fn); },
    getUser() { return cachedUser; },
    async ready() { await refresh(); return cachedUser; },
  };

  if (client) {
    client.auth.onAuthStateChange(() => refresh());
    refresh();
  }
})();

/* Update the header pill / login button on every page once auth resolves. */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.dtAuth) return;
  function paint(user) {
    document.querySelectorAll('#userPill').forEach(pill => {
      const coinsEl = pill.querySelector('#userCoins');
      const coinsText = coinsEl ? coinsEl.outerHTML : '';
      const name = user ? (user.user_metadata?.username || user.email.split('@')[0]) : 'guest';
      pill.innerHTML = name + ' &middot; ' + coinsText;
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
});
