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

  function payout(cents, label, gameId) {
    const s = window.__dt.load();
    s.coins += cents;
    s.gamesPlayed = s.gamesPlayed || [];
    if (gameId && !s.gamesPlayed.includes(gameId)) s.gamesPlayed.push(gameId);
    window.__dt.save(s);
    window.__dt.paintWallet();
    if (window.checkAchievements) setTimeout(window.checkAchievements, 100);
  }

  // End-of-game screen with running total + Play Again / Close.
  function showResult(host, headline, subline, totalCents, gameFn) {
    host.innerHTML =
      '<div class="game-result">' +
        '<h2>' + headline + '</h2>' +
        '<div class="gr-sub">' + subline + '</div>' +
        '<div class="gr-total">+$' + (totalCents/100).toFixed(2) + '</div>' +
        '<div class="gr-actions">' +
          '<button class="gr-replay">PLAY AGAIN</button>' +
          '<button class="gr-close">CLOSE</button>' +
        '</div>' +
      '</div>';
    host.querySelector('.gr-replay').addEventListener('click', () => {
      host.innerHTML = '';
      gameFn(host);
    });
    host.querySelector('.gr-close').addEventListener('click', () => {
      const modal = host.closest('.game-modal');
      if (modal) modal.remove();
    });
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
      const cents = score;
      payout(cents, 'Coin Crusher', 'coin-crusher');
      showResult(host, 'TIME UP', score + ' hits', cents, coinCrusher);
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
      payout(cents, 'Jelly Fall', 'jelly-fall');
      showResult(host, 'GAME OVER', score + ' jellies caught', cents, jellyFall);
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
      const cents = Math.max(30, 200 - (moves - 8) * 10);
      payout(cents, 'Spook Match', 'spook-match');
      setTimeout(() => showResult(host, 'CLEARED', moves + ' moves', cents, spookMatch), 600);
    }
  }

  /* --- TRASH DASH — Chrome-dino-style runner. SPACE / click to jump. --- */
  function trashDash(host) {
    let alive = true, score = 0, speed = 4, jumping = false, vy = 0, gy = 0;
    host.innerHTML =
      '<div class="td-hud"><span>DISTANCE: <b id="tdScore">0</b>m</span><span>SPACE / TAP to jump</span></div>' +
      '<div class="td-arena">' +
        '<div class="td-ground"></div>' +
        '<div class="td-runner"></div>' +
      '</div>' +
      '<p style="margin-top:8px;color:#cfe2e8;">Hop the trash. Each meter = 1¢.</p>';
    const arena   = host.querySelector('.td-arena');
    const runner  = host.querySelector('.td-runner');
    const obstacles = [];
    function jump() {
      if (jumping || !alive) return;
      jumping = true; vy = -10;
    }
    arena.addEventListener('click', jump);
    function keyHandler(e) { if (e.key === ' ') { e.preventDefault(); jump(); } }
    document.addEventListener('keydown', keyHandler);
    function spawnObstacle() {
      if (!alive) return;
      const o = document.createElement('div');
      o.className = 'td-obstacle';
      o.style.left = arena.clientWidth + 'px';
      arena.appendChild(o);
      obstacles.push(o);
    }
    let nextSpawn = 60;
    function step() {
      if (!alive) return;
      score++; if (score % 5 === 0) host.querySelector('#tdScore').textContent = score;
      if (score % 500 === 0) speed += 0.5;
      // physics
      if (jumping) {
        gy += vy; vy += 0.6;
        if (gy >= 0) { gy = 0; jumping = false; vy = 0; }
        runner.style.bottom = (10 - gy) + 'px';
      }
      // move obstacles
      obstacles.forEach((o, i) => {
        const x = parseFloat(o.style.left) - speed;
        o.style.left = x + 'px';
        if (x < -30) { o.remove(); obstacles.splice(i,1); }
        // collision: runner is at left ~30, width 30, height 40
        if (x < 70 && x > 10 && gy > -25) {
          end();
        }
      });
      nextSpawn--;
      if (nextSpawn <= 0) { spawnObstacle(); nextSpawn = 50 + Math.floor(Math.random() * 60); }
      requestAnimationFrame(step);
    }
    step();
    function end() {
      alive = false;
      document.removeEventListener('keydown', keyHandler);
      const cents = score;
      payout(cents, 'Trash Dash', 'trash-dash');
      showResult(host, 'CRASHED', score + 'm distance', cents, trashDash);
    }
  }

  window.miniGames = {
    'coin-crusher': () => openGameModal('COIN CRUSHER', coinCrusher),
    'jelly-fall':   () => openGameModal('JELLY FALL',   jellyFall),
    'spook-match':  () => openGameModal('SPOOK MATCH',  spookMatch),
    'trash-dash':   () => openGameModal('TRASH DASH',   trashDash),
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
