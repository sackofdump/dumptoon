/* Mini-games. Each opens in a modal, takes no args, pays out coins to wallet
   on win. Hooked from visit-dzones.html PLAY buttons. */

(function () {
  function openGameModal(title, build) {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-stage">
        <div class="game-head">
          <h3>${title}</h3>
          <button class="game-close">CLOSE</button>
        </div>
        <div class="game-body"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.game-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    build(modal.querySelector('.game-body'), () => modal.remove());
  }

  function payout(cents, label) {
    const s = window.__dt.load();
    s.coins += cents;
    window.__dt.save(s);
    window.__dt.paintWallet();
    window.flash && window.flash(label + ': +$' + (cents/100).toFixed(2));
  }

  /* --- COIN CRUSHER — whack-a-toon, 30s --- */
  function coinCrusher(host) {
    let score = 0, time = 30, alive = true;
    host.innerHTML = `
      <div class="cc-hud">
        <span>SCORE: <b id="ccScore">0</b></span>
        <span>TIME: <b id="ccTime">30</b>s</span>
      </div>
      <div class="cc-grid"></div>
      <p style="margin-top:8px;color:#cfe2e8;">Click the dToons before they vanish. Each hit = 1¢.</p>`;
    const grid = host.querySelector('.cc-grid');
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cc-cell';
      grid.appendChild(cell);
    }
    const cells = host.querySelectorAll('.cc-cell');
    function pop() {
      if (!alive) return;
      const cell = cells[Math.floor(Math.random() * cells.length)];
      if (cell.firstChild) return setTimeout(pop, 200);
      const card = window.CARDS[Math.floor(Math.random() * window.CARDS.length)];
      const t = window.buildCardToon(card, { size: 70 });
      t.classList.add('cc-toon');
      cell.appendChild(t);
      const t0 = setTimeout(() => { if (cell.contains(t)) cell.removeChild(t); }, 1100);
      t.addEventListener('click', () => {
        if (!cell.contains(t)) return;
        score++; host.querySelector('#ccScore').textContent = score;
        clearTimeout(t0); cell.removeChild(t);
      });
    }
    const tick = setInterval(() => {
      time--; host.querySelector('#ccTime').textContent = time;
      if (time <= 0) { alive = false; clearInterval(tick); end(); }
    }, 1000);
    const popper = setInterval(pop, 600);
    function end() {
      clearInterval(popper);
      const cents = score; // 1 cent per hit
      payout(cents, 'Coin Crusher');
      host.innerHTML = `<h2 style="color:#cfe2e8;text-align:center;">TIME UP — ${score} hits → +$${(cents/100).toFixed(2)}</h2>`;
    }
  }

  /* --- JELLY FALL — catch jellies, dodge bombs --- */
  function jellyFall(host) {
    let lives = 3, score = 0, alive = true;
    host.innerHTML = `
      <div class="jf-hud">
        <span>LIVES: <b id="jfLives">3</b></span>
        <span>JELLIES: <b id="jfScore">0</b></span>
      </div>
      <div class="jf-arena">
        <div class="jf-bucket"></div>
      </div>
      <p style="margin-top:8px;color:#cfe2e8;">Move with mouse. Catch jellies. Avoid bombs. Lose all lives = end.</p>`;
    const arena = host.querySelector('.jf-arena');
    const bucket = host.querySelector('.jf-bucket');
    let bx = 200;
    arena.addEventListener('mousemove', e => {
      const r = arena.getBoundingClientRect();
      bx = Math.max(0, Math.min(r.width - 80, e.clientX - r.left - 40));
      bucket.style.left = bx + 'px';
    });
    function spawn() {
      if (!alive) return;
      const isBomb = Math.random() < 0.25;
      const obj = document.createElement('div');
      obj.className = 'jf-obj ' + (isBomb ? 'bomb' : 'jelly');
      obj.style.left = (Math.random() * 360) + 'px';
      obj.style.top = '0px';
      arena.appendChild(obj);
      const speed = 2 + Math.random() * 2;
      const fall = setInterval(() => {
        if (!alive) { clearInterval(fall); return; }
        const top = parseFloat(obj.style.top) + speed;
        obj.style.top = top + 'px';
        const ox = parseFloat(obj.style.left);
        const arenaH = arena.getBoundingClientRect().height;
        // Caught (in bucket zone, last 60px)
        if (top > arenaH - 70 && top < arenaH - 30 && ox + 30 > bx && ox + 30 < bx + 80) {
          if (isBomb) loseLife(); else { score++; host.querySelector('#jfScore').textContent = score; }
          obj.remove(); clearInterval(fall);
        } else if (top > arenaH) {
          if (!isBomb) { /* missed jelly = no penalty */ }
          obj.remove(); clearInterval(fall);
        }
      }, 30);
    }
    function loseLife() {
      lives--; host.querySelector('#jfLives').textContent = lives;
      if (lives <= 0) end();
    }
    function end() {
      alive = false; clearInterval(spawner);
      const cents = score * 5;
      payout(cents, 'Jelly Fall');
      host.innerHTML = `<h2 style="color:#cfe2e8;text-align:center;">GAME OVER — ${score} jellies × 5¢ = +$${(cents/100).toFixed(2)}</h2>`;
    }
    const spawner = setInterval(spawn, 700);
  }

  /* --- SPOOK MATCH — flip-card memory game --- */
  function spookMatch(host) {
    const symbols = ['🧦','🍞','📄','💧','🐞','🪱','☁️','🍟'];
    const deck = symbols.concat(symbols).sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0, moves = 0;
    host.innerHTML = `
      <div class="sm-hud"><span>MOVES: <b id="smMoves">0</b></span><span>PAIRS: <b id="smPairs">0</b>/8</span></div>
      <div class="sm-grid"></div>
      <p style="margin-top:8px;color:#cfe2e8;">Find all 8 pairs. Fewer moves = bigger payout.</p>`;
    const grid = host.querySelector('.sm-grid');
    deck.forEach((sym, i) => {
      const c = document.createElement('div');
      c.className = 'sm-card'; c.dataset.sym = sym; c.dataset.idx = i;
      c.innerHTML = `<div class="sm-front">?</div><div class="sm-back">${sym}</div>`;
      c.addEventListener('click', () => flip(c));
      grid.appendChild(c);
    });
    function flip(c) {
      if (c.classList.contains('flipped') || flipped.length >= 2) return;
      c.classList.add('flipped'); flipped.push(c);
      if (flipped.length === 2) {
        moves++; host.querySelector('#smMoves').textContent = moves;
        const [a, b] = flipped;
        if (a.dataset.sym === b.dataset.sym) {
          matched++; host.querySelector('#smPairs').textContent = matched;
          flipped = [];
          if (matched === 8) end();
        } else {
          setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); flipped = []; }, 700);
        }
      }
    }
    function end() {
      // Best score = 8 moves (perfect). Payout: 200c if perfect, scales down to 30c at 25+ moves.
      const cents = Math.max(30, 200 - (moves - 8) * 10);
      payout(cents, 'Spook Match');
      setTimeout(() => {
        host.innerHTML = `<h2 style="color:#cfe2e8;text-align:center;">CLEARED in ${moves} moves — +$${(cents/100).toFixed(2)}</h2>`;
      }, 600);
    }
  }

  window.miniGames = {
    'coin-crusher': () => openGameModal('COIN CRUSHER', coinCrusher),
    'jelly-fall':   () => openGameModal('JELLY FALL',   jellyFall),
    'spook-match':  () => openGameModal('SPOOK MATCH',  spookMatch),
    'trash-dash':   () => openGameModal('TRASH DASH',   (h) => h.innerHTML = '<h2 style="color:#cfe2e8;">Coming soon — side-scroll runner.</h2>'),
  };

  // Auto-bind PLAY buttons that have data-game.
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-arcade[data-game]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopImmediatePropagation();
        const g = window.miniGames[btn.dataset.game];
        if (g) g();
      }, true); // capture so this runs before initZones' coin payout handler
    });
  });
})();
