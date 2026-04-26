/* Dumptoon shared client script.
   Mock data only — swap in a real backend later.
   Wallet is stored in cents internally and rendered as $X.XX. */

(function () {
  const KEY = 'dumptoon-state-v2';
  const defaultState = {
    coins: 500, // $5.00 starting wallet
    inventory: ['sock-sloth','dust-bunny','toasty','wiggle-worm','paper-pal','crumb-gobbler']
  };
  function load() {
    try { return Object.assign({}, defaultState, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return Object.assign({}, defaultState); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function fmt(cents) { return '$' + (cents / 100).toFixed(2); }
  function paintWallet() {
    const s = load();
    document.querySelectorAll('#userCoins').forEach(el => el.textContent = fmt(s.coins));
  }
  window.__dt = { load, save, fmt, paintWallet };

  // Make flash globally available before DOMContentLoaded handlers below need it.
  window.__dt = { load, save, fmt, paintWallet };

  document.addEventListener('DOMContentLoaded', () => {
    dailyLoginBonus();
    paintWallet();
    placeEasterEggs();
    setTimeout(checkAchievements, 100); // run after other init
  });
})();

/* ---- Daily login bonus: $0.50 the first visit each calendar day ---- */
function dailyLoginBonus() {
  const s = window.__dt.load();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (s.last_login_date === today) return;
  s.last_login_date = today;
  s.coins = (s.coins || 0) + 50;
  window.__dt.save(s);
  setTimeout(() => flash('Daily login bonus: +$0.50'), 800);
}

/* ---- Easter eggs scattered around the page ----
   Drops 2 eggs every 5 minutes, capped so the page never shows more than 2
   uncollected eggs. No initial burst — first eggs appear after 5 min. */
const EGG_INTERVAL_MS = 5 * 60 * 1000;
const EGG_CAP = 2;

function spawnEgg() {
  const egg = document.createElement('div');
  egg.className = 'easter-egg';
  egg.style.left = (4 + Math.random() * 92) + 'vw';
  egg.style.top  = (12 + Math.random() * 80) + 'vh';
  egg.title = 'A shiny something — click it!';
  egg.addEventListener('click', () => {
    const cents = 50 + Math.floor(Math.random() * 51); // 50 - 100 cents
    const s = window.__dt.load();
    s.coins += cents;
    window.__dt.save(s);
    window.__dt.paintWallet();
    flash('+' + window.__dt.fmt(cents) + ' found!');
    egg.classList.add('popped');
    setTimeout(() => egg.remove(), 400);
  });
  document.body.appendChild(egg);
}

function placeEasterEggs() {
  function topUp() {
    const live = document.querySelectorAll('.easter-egg:not(.popped)').length;
    const need = Math.max(0, EGG_CAP - live);
    for (let i = 0; i < need; i++) spawnEgg();
  }
  setInterval(topUp, EGG_INTERVAL_MS);
}

window.flash = function (msg) { return flash(msg); };
function flash(msg) {
  let bar = document.getElementById('flashBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'flashBar';
    Object.assign(bar.style, {
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      background: '#d6322f', color: '#fff', padding: '12px 22px',
      fontFamily: 'Oswald, sans-serif', letterSpacing: '2px', zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,.4)', fontSize: '15px'
    });
    document.body.appendChild(bar);
  }
  bar.textContent = msg;
  bar.style.opacity = '1';
  clearTimeout(flash._t);
  flash._t = setTimeout(() => { bar.style.transition = 'opacity .4s'; bar.style.opacity = '0'; }, 1800);
}

/* ---- Mock online players ---- */
const ONLINE_PLAYERS = [
  { name: 'beanboy42', rank: 'Cadet',     deck: 'Animal',      status: 'idle',    cards: 14 },
  { name: 'orbitmom',  rank: 'Captain',   deck: 'Jawbreakers', status: 'trading', cards: 38 },
  { name: 'gunkfan',   rank: 'Rookie',    deck: 'Eds',         status: 'dueling', cards: 9  },
  { name: 'velmaaa',   rank: 'Pilot',     deck: 'Yogi',        status: 'idle',    cards: 22 },
  { name: 'd_toon_99', rank: 'Commander', deck: 'Mixed',       status: 'idle',    cards: 51 },
  { name: 'trashpanda',rank: 'Cadet',     deck: 'Animal',      status: 'trading', cards: 17 },
];

/* ---- Card pack store (get-cards.html) ----
   Pack definitions live in cards.js (window.PACK_DEFS); blurbs are layered on top here. */
const PACK_BLURBS = {
  starter:   '3 random commons. Great if you are just starting out.',
  booster:   '5 cards, 1 guaranteed rare.',
  holo:      '5 cards with a strong holo chance — Rare/Epic skew.',
  mystery:   'Random odds. You either win big or feel weird.',
  legendary: '6 cards. No commons. 30% Legendary chance per slot.',
  bundle:    'Big batch. Best $/card if you want to build fast.',
};
const PACKS = Object.entries(window.PACK_DEFS || {}).map(([id, def]) => ({
  id, name: def.name, cost: def.cost, cards: def.cards, art: def.art,
  blurb: PACK_BLURBS[id] || ''
}));

function initStore() {
  const grid = document.getElementById('packGrid');
  if (!grid) return;
  PACKS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'pack';
    card.innerHTML =
      `<div class="art ${p.art}">[ pack-${p.art} ]</div>` +
      `<h3>${p.name}</h3>` +
      `<div class="blurb">${p.blurb}</div>` +
      `<div class="price">${window.__dt.fmt(p.cost)}</div>` +
      `<button data-pack="${p.id}">BUY PACK</button>`;
    grid.appendChild(card);
  });

  grid.addEventListener('click', e => {
    const btn = e.target.closest('button[data-pack]');
    if (!btn) return;
    const pack = PACKS.find(p => p.id === btn.dataset.pack);
    const s = window.__dt.load();
    if (s.coins < pack.cost) {
      flash('Not enough $$ — find some easter eggs or play zone games!');
      return;
    }
    s.coins -= pack.cost;
    const pulled = window.rollPack(pack.id); // returns array of card objects
    s.inventory = (s.inventory || []).concat(pulled.map(c => c.id));
    window.__dt.save(s);
    window.__dt.paintWallet();
    animatePackOpen(pack, pulled, () => renderPullResult(pack, pulled));
  });
}

function renderPullResult(pack, pulled) {
  let panel = document.getElementById('pullResult');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'pullResult';
    panel.className = 'pack-result';
    document.getElementById('packGrid').after(panel);
  }
  panel.innerHTML = `<h3>YOU OPENED &mdash; ${pack.name}</h3><div class="pulled-row"></div>`;
  const row = panel.querySelector('.pulled-row');
  pulled.forEach(card => {
    const el = window.buildCardToon(card, { showStats: true });
    if (card.rarity === 'legendary' || card.rarity === 'epic') el.classList.add('holo');
    row.appendChild(el);
  });
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---- Trade page ---- */
function initTrade() {
  const tbody = document.getElementById('onlinePlayers');
  ONLINE_PLAYERS.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.status}</td><td>${p.cards}</td>` +
                   `<td><button class="trade" data-name="${p.name}">TRADE</button></td>`;
    tbody.appendChild(tr);
  });

  const yourInv = document.getElementById('yourInventory');
  const theirInv = document.getElementById('theirInventory');
  const yourOffer = document.getElementById('yourOffer');
  const theirOffer = document.getElementById('theirOffer');
  const partnerName = document.getElementById('partnerName');

  function buildToon(cardId) {
    const el = window.buildCardToon(cardId, { size: 88, draggable: true });
    el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', cardId));
    return el;
  }

  function fill(target, ids) {
    target.innerHTML = '';
    ids.forEach(id => target.appendChild(buildToon(id)));
  }

  fill(yourInv, window.__dt.load().inventory);

  [yourOffer, theirOffer].forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('over');
      const art = e.dataTransfer.getData('text/plain');
      if (!art) return;
      zone.appendChild(buildToon(art, zone.children.length));
    });
  });

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('button.trade');
    if (!btn) return;
    const name = btn.dataset.name;
    partnerName.textContent = `THEM — ${name}`;
    // Pick a random sampling from the real card pool as the partner's binder.
    const pool = window.CARDS.slice().sort(() => Math.random() - 0.5).slice(0, 8).map(c => c.id);
    fill(theirInv, pool);
    theirOffer.innerHTML = '';
  });

  document.getElementById('confirmTrade').addEventListener('click', () => {
    if (!yourOffer.children.length || !theirOffer.children.length) {
      alert('Both sides need at least one card.');
      return;
    }
    const yourIds  = Array.from(yourOffer.children).map(c => c.dataset.cardId);
    const theirIds = Array.from(theirOffer.children).map(c => c.dataset.cardId);
    const partner = (partnerName.textContent || '').replace(/^THEM\s*[—-]\s*/, '') || 'partner';

    // Verify the player still owns each offered card.
    const inv = (window.__dt.load().inventory || []).slice();
    for (const id of yourIds) {
      const i = inv.indexOf(id);
      if (i < 0) { alert('You no longer own one of the offered cards.'); return; }
      inv.splice(i, 1);
    }
    if (!confirm('Send offer to ' + partner + '?\n\nGive: ' + yourIds.length + ' card(s)\nGet:  ' + theirIds.length + ' card(s)')) return;

    flash('Offer sent. Waiting on ' + partner + '…');
    setTimeout(() => {
      // Simulated partner response: 85% accept, 15% counter-decline.
      if (Math.random() < 0.85) {
        const s = window.__dt.load();
        // Remove your offered cards (one copy each), add theirs.
        const newInv = (s.inventory || []).slice();
        yourIds.forEach(id => { const i = newInv.indexOf(id); if (i >= 0) newInv.splice(i,1); });
        theirIds.forEach(id => newInv.push(id));
        s.inventory = newInv;
        s.tradesCompleted = (s.tradesCompleted || 0) + 1;
        window.__dt.save(s);
        flash('Trade COMPLETE with ' + partner + '!');
        // Refresh the displays.
        fill(yourInv, s.inventory);
        yourOffer.innerHTML = '';
        theirOffer.innerHTML = '';
        setTimeout(checkAchievements, 200);
      } else {
        flash(partner + ' declined the trade.');
      }
    }, 1400);
  });
  document.getElementById('cancelTrade').addEventListener('click', () => {
    yourOffer.innerHTML = '';
    theirOffer.innerHTML = '';
  });
}

/* ====================================================================
   ACHIEVEMENTS
   ==================================================================== */
const ACHIEVEMENTS = [
  { id: 'first-pack',     name: 'FIRST PACK',     desc: 'Open your first pack',         check: s => (s.packsOpened || 0) >= 1 },
  { id: 'pack-collector', name: 'PACK COLLECTOR', desc: 'Open 10 packs',                check: s => (s.packsOpened || 0) >= 10 },
  { id: 'coin-hoarder',   name: 'COIN HOARDER',   desc: 'Reach $50 in your wallet',     check: s => (s.coins || 0) >= 5000 },
  { id: 'roster-builder', name: 'ROSTER BUILDER', desc: 'Own 10 unique cards',          check: s => new Set(s.inventory || []).size >= 10 },
  { id: 'legend-holder',  name: 'LEGEND HOLDER',  desc: 'Own a Legendary card',         check: s => (s.inventory || []).some(id => window.CARD_BY_ID && window.CARD_BY_ID[id] && window.CARD_BY_ID[id].rarity === 'legendary') },
  { id: 'first-duel',     name: 'DUELIST',        desc: 'Win 1 duel',                   check: s => (s.duelsWon || 0) >= 1 },
  { id: 'streak-5',       name: 'CHAMPION',       desc: 'Win 5 duels in a row',         check: s => (s.maxStreak || 0) >= 5 },
  { id: 'cardsharp',      name: 'CARDSHARP',      desc: 'Sell 10 cards',                check: s => (s.cardsSold || 0) >= 10 },
  { id: 'sweeper',        name: 'GAME SWEEPER',   desc: 'Play all 4 mini-games',        check: s => (s.gamesPlayed || []).length >= 4 },
  { id: 'codebreak',      name: 'CODE BREAKER',   desc: 'Redeem a featured code',       check: s => (s.codes_redeemed || []).length >= 1 },
  { id: 'decorator',      name: 'INTERIOR DESIGNER', desc: 'Place a card in My Orbit',  check: s => (s.orbitPlacements || []).length >= 1 },
  { id: 'tradesman',      name: 'TRADESMAN',      desc: 'Complete a trade',             check: s => (s.tradesCompleted || 0) >= 1 },
];

window.checkAchievements = function () {
  if (!window.CARD_BY_ID) return;
  const s = window.__dt.load();
  s.achievements = s.achievements || [];
  let changed = false;
  ACHIEVEMENTS.forEach(a => {
    if (s.achievements.includes(a.id)) return;
    if (a.check(s)) {
      s.achievements.push(a.id);
      changed = true;
      showAchievementToast(a);
    }
  });
  if (changed) window.__dt.save(s);
};
const checkAchievements = window.checkAchievements;

function showAchievementToast(ach) {
  const t = document.createElement('div');
  t.className = 'achievement-toast';
  t.innerHTML =
    '<div class="ach-burst">★</div>' +
    '<div class="ach-meta">' +
      '<div class="ach-title">ACHIEVEMENT UNLOCKED</div>' +
      '<div class="ach-name">' + ach.name + '</div>' +
      '<div class="ach-desc">' + ach.desc + '</div>' +
    '</div>';
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 4500);
}

/* ====================================================================
   PACK PITY — wraps window.rollPack from cards.js so that long droughts
   guarantee an Epic / Legendary on the next pack open.
   ==================================================================== */
(function wrapRollPack() {
  if (!window.rollPack) return;
  const original = window.rollPack;
  window.rollPack = function (packId) {
    const s = window.__dt.load();
    s.packsOpened = (s.packsOpened || 0) + 1;
    s.packsSinceEpic     = (s.packsSinceEpic || 0) + 1;
    s.packsSinceLegendary = (s.packsSinceLegendary || 0) + 1;
    let result = original(packId);
    const pity = [];
    if (s.packsSinceLegendary >= 12 && !result.some(c => c.rarity === 'legendary')) {
      const pool = window.CARDS_BY_RARITY.legendary;
      result[0] = pool[Math.floor(Math.random() * pool.length)];
      pity.push('Legendary pity');
    }
    if (s.packsSinceEpic >= 5 && !result.some(c => c.rarity === 'epic' || c.rarity === 'legendary')) {
      const pool = window.CARDS_BY_RARITY.epic;
      // replace a non-rare slot
      const idx = result.findIndex(c => c.rarity === 'common');
      if (idx >= 0) result[idx] = pool[Math.floor(Math.random() * pool.length)];
      pity.push('Epic pity');
    }
    if (result.some(c => c.rarity === 'legendary')) s.packsSinceLegendary = 0;
    if (result.some(c => c.rarity === 'epic') || result.some(c => c.rarity === 'legendary')) s.packsSinceEpic = 0;
    window.__dt.save(s);
    if (pity.length) setTimeout(() => flash(pity.join(' + ') + ' triggered!'), 1200);
    setTimeout(checkAchievements, 200);
    return result;
  };
})();

/* ====================================================================
   GLOBAL SEARCH — header search input routes to the card market.
   ==================================================================== */
function initGlobalSearch() {
  document.querySelectorAll('.dt-search input[type="text"]').forEach(input => {
    const go = () => {
      const q = (input.value || '').trim();
      if (!q) return;
      window.location.href = 'cards-market.html?q=' + encodeURIComponent(q);
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    const btn = input.parentElement.querySelector('.go-btn');
    if (btn) btn.addEventListener('click', go);
  });
}

/* ====================================================================
   POLL VOTING — homepage survey records vote in localStorage.
   ==================================================================== */
function initPoll() {
  const card = document.querySelector('.poll-card');
  if (!card) return;
  const btn = card.querySelector('.pickone');
  const radios = card.querySelectorAll('input[type="radio"]');
  if (!btn) return;
  const s = window.__dt.load();
  if (s.poll_voted) renderResults();
  btn.addEventListener('click', () => {
    const choice = Array.from(radios).find(r => r.checked);
    if (!choice) { flash('Pick one first.'); return; }
    const st = window.__dt.load();
    st.poll_voted = choice.parentElement.textContent.trim();
    st.poll_tally = st.poll_tally || {};
    st.poll_tally[st.poll_voted] = (st.poll_tally[st.poll_voted] || 0) + 1;
    window.__dt.save(st);
    flash('Vote recorded.');
    renderResults();
  });
  function renderResults() {
    const st = window.__dt.load();
    if (!st.poll_voted) return;
    const tally = st.poll_tally || {};
    const total = Object.values(tally).reduce((a,b) => a+b, 0) || 1;
    let html = '<div style="font-family:Oswald,sans-serif;letter-spacing:1px;color:var(--text-dark);">YOUR PICK: <b>' + st.poll_voted + '</b></div>';
    Object.entries(tally).forEach(([k, v]) => {
      const pct = Math.round(100 * v / total);
      html += '<div style="margin-top:6px;font-size:12px;color:var(--text-dark);">' + k +
              '<div style="background:#cfe2e8;height:8px;margin-top:2px;"><div style="width:' + pct + '%;background:var(--green);height:100%;"></div></div></div>';
    });
    card.querySelector('h4').insertAdjacentHTML('afterend', '<div class="poll-results">' + html + '</div>');
    btn.disabled = true; btn.textContent = 'VOTED';
    radios.forEach(r => r.disabled = true);
    const old = card.querySelector('.poll-results + .poll-results');
    if (old) old.remove();
  }
}

/* ====================================================================
   DUEL — pick 3 cards, fight an AI deck, win coins + bonus card on streaks.
   Reuses window.runBattle() from the simulator.
   ==================================================================== */
function pickAIDeck() {
  return window.CARDS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
}

function initDuel() {
  const tbody = document.getElementById('duelLobby');
  if (!tbody) return;
  ONLINE_PLAYERS.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + p.name + '</td><td>' + p.rank + '</td><td>' + p.deck + '</td>' +
                   '<td><button class="play" data-name="' + p.name + '">DUEL</button></td>';
    tbody.appendChild(tr);
  });
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('button.play');
    if (!btn) return;
    openDuelTeamPicker(btn.dataset.name);
  });

  const s = window.__dt.load();
  const streakNote = document.createElement('p');
  streakNote.style.cssText = 'color:#cfe2e8;letter-spacing:1px;margin-top:8px;';
  streakNote.innerHTML = 'Wins: <b>' + (s.duelsWon || 0) + '</b> &nbsp; Streak: <b>' + (s.duelStreak || 0) + '</b> &nbsp; (Win 5 in a row for a bonus card.)';
  document.querySelector('.lobby-list').appendChild(streakNote);
}

function openDuelTeamPicker(opponentName) {
  const inv = (window.__dt.load().inventory || []).filter(id => window.CARD_BY_ID[id]);
  const unique = Array.from(new Set(inv));
  if (unique.length < 3) { alert('You need at least 3 unique cards to duel. Open a pack first!'); return; }

  const modal = document.createElement('div');
  modal.className = 'duel-modal';
  modal.innerHTML =
    '<div class="duel-stage">' +
    '<h2 style="margin:0 0 8px;font-family:Oswald,sans-serif;letter-spacing:3px;color:#fff;">vs ' + opponentName + ' &mdash; PICK YOUR 3</h2>' +
    '<p style="color:#cfe2e8;margin:0 0 12px;">Click 3 cards from your binder to take into the ring. SPD goes first.</p>' +
    '<div class="duel-pick"></div>' +
    '<div class="duel-actions">' +
    '<button class="duel-go" disabled>FIGHT (0/3)</button>' +
    '<button class="duel-cancel">CANCEL</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(modal);
  const pickHost = modal.querySelector('.duel-pick');
  const goBtn    = modal.querySelector('.duel-go');
  const cancelBtn= modal.querySelector('.duel-cancel');
  let chosen = [];

  unique.forEach(id => {
    const card = window.CARD_BY_ID[id];
    const t = window.buildCardToon(card, { size: 95, showStats: true });
    t.style.cursor = 'pointer';
    t.addEventListener('click', () => {
      const i = chosen.indexOf(id);
      if (i >= 0) { chosen.splice(i,1); t.classList.remove('chosen'); }
      else if (chosen.length < 3) { chosen.push(id); t.classList.add('chosen'); }
      goBtn.disabled = chosen.length !== 3;
      goBtn.textContent = 'FIGHT (' + chosen.length + '/3)';
    });
    pickHost.appendChild(t);
  });
  cancelBtn.addEventListener('click', () => modal.remove());
  goBtn.addEventListener('click', () => {
    const myDeck = chosen.map(id => window.CARD_BY_ID[id]);
    const aiDeck = pickAIDeck();
    modal.remove();
    runDuel(myDeck, aiDeck, opponentName);
  });
}

function runDuel(myDeck, aiDeck, opponentName) {
  const result = window.runBattle(myDeck, aiDeck, 20);
  const win = result.winner === 'A';

  const s = window.__dt.load();
  if (win) {
    s.duelsWon = (s.duelsWon || 0) + 1;
    s.duelStreak = (s.duelStreak || 0) + 1;
    s.maxStreak = Math.max(s.maxStreak || 0, s.duelStreak);
    s.coins += 100; // $1.00 base
    let bonusMsg = '+ $1.00 prize';
    if (s.duelStreak % 5 === 0) {
      // Bonus random card on every 5th win.
      const rarity = ['rare','rare','epic','legendary'][Math.floor(Math.random()*4)];
      const pool = window.CARDS_BY_RARITY[rarity];
      const card = pool[Math.floor(Math.random() * pool.length)];
      s.inventory.push(card.id);
      bonusMsg += ' + bonus ' + rarity.toUpperCase() + ' card: ' + card.name;
    }
    window.__dt.save(s);
    setTimeout(() => flash('VICTORY ' + bonusMsg), 1600);
  } else if (result.winner === 'B') {
    s.duelsLost = (s.duelsLost || 0) + 1;
    s.duelStreak = 0;
    window.__dt.save(s);
  }

  const modal = document.createElement('div');
  modal.className = 'duel-modal';
  const headerCls = win ? 'win' : (result.winner === 'B' ? 'lose' : 'draw');
  const headerTxt = win ? 'VICTORY' : (result.winner === 'B' ? 'DEFEAT' : 'DRAW');
  modal.innerHTML =
    '<div class="duel-stage">' +
    '<h1 class="duel-result ' + headerCls + '">' + headerTxt + '</h1>' +
    '<div style="color:#cfe2e8;margin-bottom:8px;">vs ' + opponentName + '</div>' +
    '<pre class="duel-log">' + result.log.join('\n').replace(/</g,'&lt;') + '</pre>' +
    '<button class="duel-close">CLOSE</button>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.duel-close').addEventListener('click', () => { modal.remove(); window.location.reload(); });
  setTimeout(checkAchievements, 200);
}

/* Original drag-and-drop duel kept around as a free-form sandbox; the real
   duel flow is the modal above triggered from the lobby. We expose it as a
   no-op fallback so legacy DOM doesn't error. */
function _initDuelLegacy() {
  const tbody = document.getElementById('duelLobby');
  ONLINE_PLAYERS.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.rank}</td><td>${p.deck}</td>` +
                   `<td><button class="play" data-name="${p.name}">DUEL</button></td>`;
    tbody.appendChild(tr);
  });

  const yourField = document.getElementById('yourField');
  const yourHand = document.getElementById('yourHand');
  const theirField = document.getElementById('theirField');
  const theirHand = document.getElementById('theirHand');
  const opponentName = document.getElementById('opponentName');
  const opponentLabel = document.getElementById('opponentLabel');

  function buildToon(cardId, faceDown) {
    const el = window.buildCardToon(cardId, { size: 88, draggable: !faceDown, faceDown });
    if (!faceDown) el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', cardId));
    return el;
  }

  function dealHand(target, ids, faceDown) {
    target.innerHTML = '';
    ids.forEach(id => target.appendChild(buildToon(id, faceDown)));
  }

  dealHand(yourHand, window.__dt.load().inventory.slice(0,5));

  [yourField, theirField].forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('over');
      const art = e.dataTransfer.getData('text/plain');
      if (!art) return;
      zone.appendChild(buildToon(art, zone.children.length));
    });
  });

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('button.play');
    if (!btn) return;
    const name = btn.dataset.name;
    opponentName.textContent = name;
    opponentLabel.textContent = `OPPONENT FIELD — ${name}`;
    dealHand(theirHand, [null,null,null,null,null], true);
    theirField.innerHTML = '';
  });

  document.getElementById('endTurn').addEventListener('click', () => {
    if (!opponentName.textContent || opponentName.textContent === '—') {
      alert('Pick an opponent from the lobby first.');
      return;
    }
    // Opponent reveals a random card from the full pool.
    const opp = window.CARDS[Math.floor(Math.random() * window.CARDS.length)];
    theirField.appendChild(buildToon(opp.id, false));
  });
  document.getElementById('surrender').addEventListener('click', () => {
    if (confirm('Give up this duel?')) {
      yourField.innerHTML = '';
      theirField.innerHTML = '';
      opponentName.textContent = '—';
      opponentLabel.textContent = 'OPPONENT FIELD';
    }
  });
}

/* ---- My Orbit drag/drop with persistence + real cards ---- */
function initOrbit() {
  const tray = document.getElementById('orbitTray');
  const scenes = document.querySelectorAll('.orbit-scene');
  if (!tray || !scenes.length || !window.CARD_BY_ID) return;

  // Replace placeholder tray cards with the player's actual inventory (unique).
  tray.innerHTML = '';
  const inv = (window.__dt.load().inventory || []).filter(id => window.CARD_BY_ID[id]);
  Array.from(new Set(inv)).forEach(id => {
    const t = window.buildCardToon(id, { size: 88, draggable: true });
    t.dataset.cardId = id;
    t.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', id));
    tray.appendChild(t);
  });

  // Restore saved placements.
  const placements = (window.__dt.load().orbitPlacements || []);
  placements.forEach(p => {
    const scene = document.querySelector('.orbit-scene[data-scene="' + p.scene + '"]');
    if (scene) addPlaced(scene, p.id, p.x, p.y);
  });

  scenes.forEach(scene => {
    scene.addEventListener('dragover',  e => { e.preventDefault(); scene.classList.add('over'); });
    scene.addEventListener('dragleave', () => scene.classList.remove('over'));
    scene.addEventListener('drop', e => {
      e.preventDefault();
      scene.classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      if (!id || !window.CARD_BY_ID[id]) return;
      const rect = scene.getBoundingClientRect();
      const x = e.clientX - rect.left - 44;
      const y = e.clientY - rect.top - 44;
      addPlaced(scene, id, x, y);
      savePlacements();
      setTimeout(checkAchievements, 100);
    });
  });

  function addPlaced(scene, id, x, y) {
    const placed = window.buildCardToon(id, { size: 88 });
    placed.classList.add('placed-toon');
    placed.style.position = 'absolute';
    placed.style.left = x + 'px';
    placed.style.top  = y + 'px';
    placed.title = 'Right-click to remove';
    placed.addEventListener('contextmenu', ev => {
      ev.preventDefault();
      placed.remove();
      savePlacements();
    });
    scene.appendChild(placed);
  }

  function savePlacements() {
    const list = [];
    scenes.forEach(scene => {
      const sceneId = scene.dataset.scene;
      scene.querySelectorAll('.placed-toon').forEach(p => {
        list.push({
          scene: sceneId,
          id:    p.dataset.cardId,
          x:     parseFloat(p.style.left) || 0,
          y:     parseFloat(p.style.top)  || 0,
        });
      });
    });
    const s = window.__dt.load();
    s.orbitPlacements = list;
    window.__dt.save(s);
  }

  tray.addEventListener('dragover', e => e.preventDefault());
}

/* ---- Zones / arcade ---- */
const ZONE_DATA = {
  'dump-town':    { name: 'DUMP TOWN',    bg: 'Assets/Zones/garage.png',  blurb: 'A junkyard wonderland. Sift the trash heap for coins, dodge the raccoons.', games: ['coin-crusher','trash-dash'] },
  'splash-bay':   { name: 'SPLASH BAY',   bg: 'Assets/Zones/beach.png',   blurb: 'Sun, surf, and falling jellies. Catch them in your bucket — avoid the bombs.', games: ['jelly-fall'] },
  'grass-gulch':  { name: 'GRASS GULCH',  bg: 'Assets/Zones/cmart.png',   blurb: 'Sleepy plains, snacks at the cMart. Tap the matching dToons before time’s up.', games: ['coin-crusher'] },
  'creep-castle': { name: 'CREEP CASTLE', bg: 'Assets/Zones/lab.png',     blurb: 'Spooky lab. Memory match for holo card chances.', games: ['spook-match'] },
  'sun-strip':    { name: 'SUN STRIP',    bg: 'Assets/Zones/kitchen.png', blurb: 'Boardwalk diner zone. Two arcade cabinets hot off the grill.', games: ['jelly-fall','coin-crusher'] },
  'moon-base':    { name: 'MOON BASE',    bg: 'Assets/Zones/arcade.png',  blurb: 'Neon arcade in low-grav. Daily login bonus drops here.', games: ['coin-crusher','spook-match'] },
};

function initZones() {
  // Clicking a zone tile now travels to that zone's page (no money payout).
  document.querySelectorAll('.zone').forEach(z => {
    z.style.cursor = 'pointer';
    z.addEventListener('click', () => {
      const id = z.dataset.zone;
      if (id) window.location.href = 'zone.html?id=' + encodeURIComponent(id);
    });
  });
  // Arcade PLAY buttons are bound by games.js (capture phase). Nothing else here.
}

function initZonePage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const data = ZONE_DATA[id];
  if (!data) {
    document.getElementById('zoneTitle').textContent = 'UNKNOWN ZONE';
    document.getElementById('zoneBlurb').textContent = 'No zone selected. Head back to the dZones list.';
    return;
  }
  document.getElementById('zoneTitle').textContent = data.name;
  document.getElementById('zoneBlurb').textContent = data.blurb;
  document.getElementById('zoneHero').style.backgroundImage =
    `url('${encodeURI(data.bg)}'), linear-gradient(180deg,#2c6175,#15485a)`;

  const arcade = document.getElementById('zoneArcade');
  const GAME_LABELS = {
    'coin-crusher': { name: 'COIN CRUSHER', desc: 'Tap matching dToons before time’s up.' },
    'jelly-fall':   { name: 'JELLY FALL',   desc: 'Catch jellies, dodge bombs.' },
    'spook-match':  { name: 'SPOOK MATCH',  desc: 'Memory match with creep cards.' },
    'trash-dash':   { name: 'TRASH DASH',   desc: 'Side-scroll runner — coming soon.' },
  };
  data.games.forEach((g, i) => {
    const meta = GAME_LABELS[g] || { name: g.toUpperCase(), desc: '' };
    const card = document.createElement('div');
    card.className = 'arcade-card';
    card.innerHTML =
      `<div class="preview a${(i % 4) + 1}">${meta.name}</div>` +
      `<div style="font-family:Oswald,sans-serif;letter-spacing:2px;">${meta.name}</div>` +
      `<p style="font-size:12px;">${meta.desc}</p>` +
      `<button class="play-arcade" data-game="${g}">PLAY</button>`;
    arcade.appendChild(card);
  });
  // games.js auto-binds .play-arcade in DOMContentLoaded; we're past that, so re-bind.
  arcade.querySelectorAll('.play-arcade[data-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fn = window.miniGames && window.miniGames[btn.dataset.game];
      if (fn) fn();
    });
  });
}

/* ---- Animated pack open ---- */
function animatePackOpen(pack, pulled, onDone) {
  const modal = document.createElement('div');
  modal.className = 'pack-open-modal';
  modal.innerHTML = `
    <div class="pack-open-stage">
      <div class="pack-open-burst"></div>
      <div class="pack-open-pack pack-art-${pack.art}">
        <div class="pack-half top"></div>
        <div class="pack-half bottom"></div>
      </div>
      <div class="pack-open-cards"></div>
      <button class="pack-open-done">ADD TO INVENTORY</button>
    </div>`;
  document.body.appendChild(modal);
  const packEl   = modal.querySelector('.pack-open-pack');
  const burstEl  = modal.querySelector('.pack-open-burst');
  const cardsEl  = modal.querySelector('.pack-open-cards');
  const doneBtn  = modal.querySelector('.pack-open-done');
  doneBtn.style.display = 'none';

  // Sequence: 0.0s pack flies in → 0.8s shake → 1.6s burst+rip → 2.2s reveal cards
  setTimeout(() => packEl.classList.add('shake'), 800);
  setTimeout(() => {
    burstEl.classList.add('flash');
    packEl.querySelector('.top').classList.add('rip');
    packEl.querySelector('.bottom').classList.add('rip');
    packEl.classList.add('opening');
  }, 1600);
  setTimeout(() => {
    pulled.forEach((card, i) => setTimeout(() => {
      const el = window.buildCardToon(card, { size: 110, showStats: true });
      el.classList.add('reveal');
      // Sub-burst tinted by rarity
      const sub = document.createElement('div');
      sub.className = 'card-sub-burst rarity-' + card.rarity;
      el.appendChild(sub);
      cardsEl.appendChild(el);
    }, i * 280));
  }, 2200);
  setTimeout(() => { doneBtn.style.display = 'block'; }, 2200 + pulled.length * 280 + 400);

  function close() { modal.remove(); if (onDone) onDone(); }
  doneBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
}

/* ---- My Collection (collection.html) ---- */
const SELL_PRICES = { common: 25, rare: 100, epic: 300, legendary: 750 }; // cents

function initCollection() {
  const grid = document.getElementById('colGrid');
  if (!grid) return;
  let activeRarity = 'all';

  function counts() {
    const inv = (window.__dt.load().inventory || []).filter(id => window.CARD_BY_ID[id]);
    const map = {};
    inv.forEach(id => { map[id] = (map[id] || 0) + 1; });
    return { map, total: inv.length, unique: Object.keys(map).length };
  }

  function paint() {
    const c = counts();
    const search = (document.getElementById('colSearch').value || '').toLowerCase().trim();
    let entries = Object.entries(c.map);

    let value = 0;
    entries.forEach(([id, qty]) => { value += SELL_PRICES[window.CARD_BY_ID[id].rarity] * qty; });
    document.getElementById('colCount').textContent  = c.total;
    document.getElementById('colUnique').textContent = c.unique;
    document.getElementById('colValue').textContent  = '$' + (value / 100).toFixed(2);

    if (activeRarity !== 'all') entries = entries.filter(([id]) => window.CARD_BY_ID[id].rarity === activeRarity);
    if (search) entries = entries.filter(([id]) => window.CARD_BY_ID[id].name.toLowerCase().includes(search));
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    entries.sort((a, b) => {
      const ca = window.CARD_BY_ID[a[0]], cb = window.CARD_BY_ID[b[0]];
      return rarityOrder[ca.rarity] - rarityOrder[cb.rarity] || ca.name.localeCompare(cb.name);
    });

    grid.innerHTML = '';
    if (!entries.length) {
      grid.innerHTML = '<div class="col-empty" style="grid-column:1/-1;">No cards in this view. Crack a pack from <b>GET CARDS</b> to start collecting.</div>';
      return;
    }
    entries.forEach(([id, qty]) => {
      const card = window.CARD_BY_ID[id];
      const cell = document.createElement('div');
      cell.className = 'col-card';
      const price = SELL_PRICES[card.rarity];
      cell.innerHTML = `
        <span class="qty">×${qty}</span>
        <div class="toon-mount"></div>
        <h4>${card.name}</h4>
        <div class="role" style="font-size:11px;color:var(--text-muted);letter-spacing:1px;margin:2px 0 6px;">
          ${card.rarity.toUpperCase()} &middot; HP ${card.hp} ATK ${card.atk} SPD ${card.spd}
        </div>
        <button class="sell" data-id="${id}">SELL FOR $${(price/100).toFixed(2)}</button>`;
      cell.querySelector('.toon-mount').replaceWith(window.buildCardToon(card));
      cell.querySelector('.sell').addEventListener('click', () => sellOne(id));
      grid.appendChild(cell);
    });
  }

  function sellOne(id) {
    const card = window.CARD_BY_ID[id];
    if (!card) return;
    const price = SELL_PRICES[card.rarity];
    if (!confirm(`Sell ONE copy of ${card.name} for $${(price/100).toFixed(2)}?`)) return;
    const s = window.__dt.load();
    const idx = (s.inventory || []).indexOf(id);
    if (idx < 0) { flash('You no longer own that card.'); paint(); return; }
    s.inventory.splice(idx, 1);
    s.coins += price;
    s.cardsSold = (s.cardsSold || 0) + 1;
    window.__dt.save(s);
    window.__dt.paintWallet();
    flash('Sold ' + card.name + ' for +$' + (price/100).toFixed(2));
    paint();
    setTimeout(checkAchievements, 100);
  }

  document.querySelectorAll('.market-controls button[data-rar]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.market-controls button[data-rar]').forEach(x => x.classList.toggle('active', x === b));
      activeRarity = b.dataset.rar;
      paint();
    });
  });
  document.getElementById('colSearch').addEventListener('input', paint);
  paint();
}

/* ---- Card market (cards-market.html) ---- */
function initMarket() {
  const grid = document.getElementById('marketGrid');
  if (!grid) return;
  let activeRarity = 'all';
  let activeSort = 'default';
  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  const rarityPrice = { common: 50, rare: 200, epic: 600, legendary: 1500 };

  function paint() {
    const search = (document.getElementById('marketSearch').value || '').toLowerCase().trim();
    let cards = window.CARDS.slice();
    if (activeRarity !== 'all') cards = cards.filter(c => c.rarity === activeRarity);
    if (search) cards = cards.filter(c => c.name.toLowerCase().includes(search) || c.ability.toLowerCase().includes(search));
    cards.sort((a, b) => {
      switch (activeSort) {
        case 'hp':   return b.hp - a.hp;
        case 'atk':  return b.atk - a.atk;
        case 'spd':  return b.spd - a.spd;
        case 'name': return a.name.localeCompare(b.name);
        default:     return rarityOrder[a.rarity] - rarityOrder[b.rarity] || a.name.localeCompare(b.name);
      }
    });
    grid.innerHTML = '';
    cards.forEach(c => {
      const card = document.createElement('div');
      card.className = 'market-card';
      card.innerHTML = `
        <span class="rarity-pill ${c.rarity}">${c.rarity.toUpperCase()}</span>
        <div class="toon-mount"></div>
        <h4>${c.name}</h4>
        <div class="role">${c.role} &middot; HP ${c.hp} · ATK ${c.atk} · SPD ${c.spd}</div>
        <div class="desc">${c.ability}: ${c.desc}</div>
        <div class="price">$${(rarityPrice[c.rarity]/100).toFixed(2)}</div>`;
      card.querySelector('.toon-mount').replaceWith(window.buildCardToon(c));
      grid.appendChild(card);
    });
  }

  document.querySelectorAll('.market-controls button[data-rar]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.market-controls button[data-rar]').forEach(x => x.classList.toggle('active', x === b));
      activeRarity = b.dataset.rar;
      paint();
    });
  });
  document.getElementById('marketSort').addEventListener('change', e => { activeSort = e.target.value; paint(); });
  document.getElementById('marketSearch').addEventListener('input', paint);
  // If we arrived from the global search, prefill the box.
  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) document.getElementById('marketSearch').value = urlQ;
  paint();
}

/* ---- Featured cards on the homepage ---- */
function initFeatureCircles() {
  const host = document.getElementById('featureCircles');
  if (!host || !window.CARDS) return;
  const ids = (host.dataset.cardIds || '').split(',').map(s => s.trim()).filter(Boolean);
  const cmart = host.querySelector('.feature-cmart');
  ids.forEach((id, i) => {
    const card = window.CARD_BY_ID[id];
    if (!card) return;
    const t = window.buildCardToon(card);
    t.classList.add('t' + ((i % 6) + 1)); // keep position styling from existing CSS
    host.insertBefore(t, cmart || null);
  });
}

/* ---- Featured code redemption (homepage TURKEY = $20, once per browser) ---- */
const REDEEM_CODES = { 'turkey': { cents: 2000, label: 'TURKEY code' } };

function redeemCode(raw) {
  const code = (raw || '').trim().toLowerCase();
  if (!code) return;
  const def = REDEEM_CODES[code];
  if (!def) { flash('That code is not valid.'); return; }
  const s = window.__dt.load();
  s.codes_redeemed = s.codes_redeemed || [];
  if (s.codes_redeemed.includes(code)) { flash('Code already redeemed.'); return; }
  s.codes_redeemed.push(code);
  s.coins += def.cents;
  window.__dt.save(s);
  window.__dt.paintWallet();
  flash('+$' + (def.cents/100).toFixed(2) + ' from ' + def.label + '!');
}

function initFeaturedCode() {
  // Featured code pill is display-only — the player must type the code into
  // the GOT A CODE? input and hit SUBMIT (or press Enter) to redeem.
  const submit = document.querySelector('.member-bar .submit');
  const input  = document.querySelector('.member-bar .got-code input');
  if (!submit || !input) return;
  function go() { redeemCode(input.value); input.value = ''; }
  submit.addEventListener('click', go);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
}

/* ---- Responsive zoom: scale the fixed 1280-design page to fit narrower windows ---- */
function applyResponsiveZoom() {
  const DESIGN_WIDTH = 1280;
  const w = window.innerWidth;
  const scale = w >= DESIGN_WIDTH ? 1 : Math.max(0.45, w / DESIGN_WIDTH);
  // 'zoom' works in Chromium, Safari, and Firefox 126+. Falls back to no-op elsewhere.
  document.body.style.zoom = scale;
}
window.addEventListener('resize', applyResponsiveZoom);
document.addEventListener('DOMContentLoaded', applyResponsiveZoom);

/* ---- Unified sidebar ---- one source of truth, injected on every page ---- */
const SIDEBAR_LINKS = [
  { href: 'get-cards.html',     label: 'GET CARDS' },
  { href: 'cards-market.html',  label: 'CARD MARKET' },
  { href: 'collection.html',    label: 'MY COLLECTION' },
  { href: 'play-dtoons.html',   label: 'PLAY dTOONS' },
  { href: 'simulator.html',     label: 'SIMULATOR' },
  { href: 'my-orbit.html',      label: 'MY ORBIT' },
  { href: 'visit-dzones.html',  label: 'VISIT dZONES' },
  { href: 'orbit-help.html',    label: 'ORBIT HELP' },
  { href: 'trade.html',         label: 'TRADE',    style: 'background:var(--orange);' },
  { href: 'login.html',         label: 'SIGN IN' },
];

function paintSidebar() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  let html = '';
  SIDEBAR_LINKS.forEach(l => {
    const active = l.href === here ? ' active' : '';
    const style  = l.style ? (' style="' + l.style + '"') : '';
    html += '<a class="side-tab' + active + '" href="' + l.href + '"' + style + '>' + l.label + '</a>';
  });
  html += '<div class="ad-slot">AD</div>';
  sidebar.innerHTML = html;
}

/* ---- Global nav button routing + DT logo back-to-home ---- */
document.addEventListener('DOMContentLoaded', () => {
  paintSidebar();
  initFeatureCircles();
  initFeaturedCode();
  const map = {
    'red':    'visit-dzones.html',
    'blue':   'coming-soon.html',
    'green':  'cards-market.html',
    'orange': 'get-cards.html',
  };
  document.querySelectorAll('.nav-btn').forEach(b => {
    Object.entries(map).forEach(([cls, href]) => {
      if (b.classList.contains(cls)) b.addEventListener('click', () => window.location.href = href);
    });
  });
  document.querySelectorAll('.dt-logo').forEach(logo => {
    logo.addEventListener('click', () => window.location.href = 'index.html');
  });
  initGlobalSearch();
  initPoll();
});

/* ---- Help / contact: persists submissions with a ticket number ---- */
function initHelp() {
  const form = document.getElementById('helpForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const s = window.__dt.load();
    s.helpTickets = s.helpTickets || [];
    const id = 'DT-' + String(Date.now()).slice(-6);
    s.helpTickets.push({ id, ts: Date.now(), ...data });
    window.__dt.save(s);
    document.getElementById('helpResult').textContent = 'TICKET ' + id + ' OPENED — WE WILL GET BACK WITHIN 48H.';
    e.target.reset();
  });
}

/* ====================================================================
   Battle simulator (simulator.html)
   Resolves: SPD order, ATK damage, crit, dodge, Burn, Slow, Shield,
   plus a small set of ability triggers that map to the CD1/CD2 cards.
   Not a full implementation — covers enough to feel real and make
   stat changes observable.
   ==================================================================== */

function initSimulator() {
  const deckAEl = document.getElementById('deckA');
  const deckBEl = document.getElementById('deckB');
  const log     = document.getElementById('simLog');
  let deckA = [], deckB = [];

  function pickRandom(n) {
    return window.CARDS.slice().sort(() => Math.random() - 0.5).slice(0, n);
  }

  function paint() {
    deckAEl.innerHTML = '';
    deckBEl.innerHTML = '';
    deckA.forEach(c => deckAEl.appendChild(window.buildCardToon(c, { size: 100, showStats: true })));
    deckB.forEach(c => deckBEl.appendChild(window.buildCardToon(c, { size: 100, showStats: true })));
  }

  document.getElementById('rollDecks').addEventListener('click', () => {
    deckA = pickRandom(3);
    deckB = pickRandom(3);
    paint();
    log.textContent = 'Decks rolled. Click RUN BATTLE.';
  });

  document.getElementById('runSim').addEventListener('click', () => {
    if (!deckA.length || !deckB.length) { log.textContent = 'Roll decks first.'; return; }
    const maxRounds = Number(document.getElementById('maxRounds').value) || 20;
    const result = window.runBattle(deckA, deckB, maxRounds);
    log.textContent = result.log.join('\n');
  });

  // Auto-roll on load so the page is non-empty.
  deckA = pickRandom(3); deckB = pickRandom(3); paint();
}

/* Pure simulator. Inputs: two arrays of card objects. Returns { winner, log[] }. */
window.runBattle = function (deckARaw, deckBRaw, maxRounds) {
  maxRounds = maxRounds || 20;
  const log = [];

  function makeUnit(card, side, slot) {
    return {
      id: card.id, name: card.name, side, slot,
      hp: card.hp, hpMax: card.hp, atk: card.atk, spd: card.spd,
      ability: card.ability, desc: card.desc, rarity: card.rarity,
      shield: 0, burn: 0, slow: 0, weaken: 0, stunned: 0,
      cd: 0, revived: false, alive: true,
    };
  }
  const A = deckARaw.map((c,i) => makeUnit(c, 'A', i));
  const B = deckBRaw.map((c,i) => makeUnit(c, 'B', i));
  const all = () => A.concat(B);
  const enemies = u => (u.side === 'A' ? B : A).filter(x => x.alive);
  const allies  = u => (u.side === 'A' ? A : B).filter(x => x.alive && x !== u);

  function effSpd(u) { return Math.max(0, u.spd - u.slow); }
  function effAtk(u) { return Math.max(0, u.atk - u.weaken); }
  function pick(arr, fn) { return arr.length ? arr.reduce((best,x) => fn(x) > fn(best) ? x : best) : null; }
  function randTarget(list) { return list.length ? list[Math.floor(Math.random()*list.length)] : null; }

  function damage(target, amount, attacker, label) {
    if (!target.alive) return 0;
    if (Math.random() < effSpd(target) * 0.03) {
      log.push(`  ${target.name} dodged (${(effSpd(target)*3).toFixed(0)}%).`);
      return 0;
    }
    const isCrit = Math.random() < 0.10;
    let dmg = amount + (isCrit ? Math.floor(amount * 0.5) : 0);
    if (target.shield > 0) {
      const eaten = Math.min(target.shield, dmg);
      target.shield -= eaten; dmg -= eaten;
      log.push(`  Shield ate ${eaten}.`);
    }
    target.hp -= dmg;
    log.push(`  ${attacker ? attacker.name : 'effect'} → ${target.name} for ${dmg}${isCrit ? ' CRIT' : ''} (${label || 'hit'}). HP ${Math.max(0,target.hp)}/${target.hpMax}.`);
    if (target.hp <= 0) killUnit(target);
    return dmg;
  }

  function killUnit(u) {
    if (!u.alive) return;
    u.alive = false;
    log.push(`  ${u.name} (${u.side}) is down.`);
    // Scrap Titan revive
    if (u.id === 'scrap-titan' && !u.revived) {
      u.revived = true; u.alive = true; u.hp = 3;
      log.push(`  ${u.name} REBUILDS at 3 HP.`);
    }
    // Void Balloon on-death AoE
    if (u.id === 'void-balloon') {
      log.push(`  ${u.name} POPS for 5 to all enemies.`);
      enemies(u).forEach(e => damage(e, 5, u, 'pop'));
    }
    // Crumb Gobbler heal-on-any-death — handled in death loop below
  }

  function onAnyDeath(deadUnit) {
    all().filter(u => u.alive).forEach(u => {
      if (u.id === 'crumb-gobbler') {
        const before = u.hp;
        u.hp = Math.min(u.hpMax + 2, u.hp + 2);
        if (u.hp !== before) log.push(`  ${u.name} heals 2 (snack scavenge).`);
      }
      if (u.id === 'trash-turtle') {
        u.shield += 1;
        log.push(`  ${u.name} gains 1 Shield (hoard armor).`);
      }
    });
  }

  function applyAbility(u) {
    // Per-turn passives + cooldown actives (very condensed: covers the abilities most players will use).
    const e = enemies(u);
    if (!e.length) return;

    if (u.id === 'static-sprite' && e.some(t => effSpd(u) > effSpd(t))) {
      const slow = e[0]; slow.slow += 1;
      log.push(`  ${u.name} applies SLOW to ${slow.name}.`);
    }
    if (u.id === 'matchstick-kid') {
      const t = randTarget(e); if (t) { t.burn = Math.max(t.burn, 2); log.push(`  ${u.name} ignites ${t.name} (Burn 2).`); }
    }
    if (u.id === 'fry-fryer') {
      const targets = e.slice(0, 2);
      targets.forEach(t => { if (Math.random() < 0.3) { t.burn = Math.max(t.burn, 2); log.push(`  ${u.name} burns ${t.name}.`); }});
    }
    if (u.id === 'fork-knight' && u.cd <= 0) {
      u.shield += 2; u.cd = 1;
      log.push(`  ${u.name} GUARDS (+2 Shield).`);
    }
    if (u.id === 'bandage-beetle' && u.cd <= 0) {
      const ally = pick(allies(u), x => -x.hp); // lowest HP
      if (ally) {
        const heal = 3 + (ally.id.includes('bug') || ally.id.includes('beetle') ? 2 : 0);
        ally.hp = Math.min(ally.hpMax + 2, ally.hp + heal);
        u.cd = 1;
        log.push(`  ${u.name} heals ${ally.name} for ${heal}.`);
      }
    }
    if (u.id === 'nurse-noodle' && u.cd <= 0) {
      allies(u).forEach(a => { a.hp = Math.min(a.hpMax + 2, a.hp + 3); });
      u.cd = 1;
      log.push(`  ${u.name} GROUP HEALS allies for 3.`);
    }
    if (u.id === 'thunder-pup' && u.cd <= 0) {
      e.slice(0,3).forEach(t => damage(t, effAtk(u), u, 'chain zap'));
      u.cd = 1; return; // spent its turn on the chain
    }
    if (u.id === 'inferno-dragonette' && u.cd <= 0) {
      e.forEach(t => {
        const bonus = t.burn > 0 ? 2 : 0;
        damage(t, effAtk(u) + bonus, u, 'blaze storm');
      });
      u.cd = 2; return;
    }
    if (u.id === 'chrono-cat' && u.cd <= 0) {
      log.push(`  ${u.name} REWINDS — extra turn.`);
      const t = randTarget(e); if (t) damage(t, effAtk(u), u, 'extra');
      u.cd = 2;
    }
    if (u.id === 'colossus-plug' && u.cd <= 0) {
      e.forEach(t => { t.stunned = 1; });
      u.cd = 2;
      log.push(`  ${u.name} OVERLOADS — all enemies STUNNED next turn.`);
    }
    if (u.id === 'the-janitor' && u.cd <= 0) {
      all().forEach(x => { x.burn = 0; x.slow = 0; x.weaken = 0; x.stunned = 0; });
      e.forEach(t => damage(t, 2, u, 'sweep'));
      u.cd = 2;
      log.push(`  ${u.name} CLEAN SLATEs the board.`);
    }
  }

  function startOfTurn(u) {
    if (u.burn > 0) {
      log.push(`  ${u.name} burns for 1.`);
      u.hp -= 1;
      u.burn -= 1;
      if (u.hp <= 0) { killUnit(u); return false; }
    }
    if (u.slow > 0)   u.slow   = Math.max(0, u.slow - 1);
    if (u.weaken > 0) u.weaken = Math.max(0, u.weaken - 1);
    if (u.cd > 0)     u.cd    -= 1;
    if (u.stunned > 0) {
      u.stunned -= 1;
      log.push(`  ${u.name} is STUNNED, skips turn.`);
      return false;
    }
    return true;
  }

  log.push(`=== BATTLE START ===`);
  log.push(`A: ${A.map(u=>u.name).join(', ')}`);
  log.push(`B: ${B.map(u=>u.name).join(', ')}`);

  for (let round = 1; round <= maxRounds; round++) {
    log.push(`\n--- Round ${round} ---`);
    const order = all().filter(u => u.alive).sort((x,y) => effSpd(y) - effSpd(x) || (Math.random() < 0.5 ? -1 : 1));
    for (const u of order) {
      if (!u.alive) continue;
      if (!startOfTurn(u)) continue;
      const before = all().filter(x => x.alive).length;
      applyAbility(u);
      // Default basic attack if not consumed by a turn-spending ability.
      if (u.alive && (u.id !== 'thunder-pup' || u.cd === 1) && (u.id !== 'inferno-dragonette' || u.cd === 2)) {
        // Most abilities above don't spend the turn — they layer on top of a basic attack.
        // The two that DO spend the turn (chain zap, blaze storm) bail early via `return`.
        const t = randTarget(enemies(u));
        if (t) damage(t, effAtk(u), u, 'attack');
      }
      const after = all().filter(x => x.alive).length;
      if (after < before) onAnyDeath();
      const aAlive = A.some(u => u.alive);
      const bAlive = B.some(u => u.alive);
      if (!aAlive || !bAlive) break;
    }
    const aAlive = A.some(u => u.alive);
    const bAlive = B.some(u => u.alive);
    if (!aAlive || !bAlive) {
      const winner = aAlive ? 'A' : (bAlive ? 'B' : 'DRAW');
      log.push(`\n=== WINNER: PLAYER ${winner} (round ${round}) ===`);
      return { winner, log };
    }
  }
  // Decide by remaining HP if max rounds reached.
  const aHp = A.filter(u=>u.alive).reduce((s,u)=>s+u.hp,0);
  const bHp = B.filter(u=>u.alive).reduce((s,u)=>s+u.hp,0);
  const winner = aHp === bHp ? 'DRAW' : (aHp > bHp ? 'A' : 'B');
  log.push(`\n=== TIME (round ${maxRounds}) — Winner by remaining HP: ${winner} (A:${aHp} B:${bHp}) ===`);
  return { winner, log };
};
