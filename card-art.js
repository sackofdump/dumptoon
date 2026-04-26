/* Maps card IDs to local PNG paths.
   The .toon CSS uses background-size: cover on a circular element, so the
   rarity bar at the top and the name strip at the bottom of each generated
   card get auto-cropped — only the character portrait shows in the circle. */

window.CARD_ART = {
  // Common
  'sock-sloth':    'Characters/Common/Sock Sloth.png',
  'crumb-gobbler': 'Characters/Common/Crumb Gobbler.png',
  'paper-pal':     'Characters/Common/Paper Pal.png',
  'drip-drop':     'Characters/Common/Drip Drop.png',
  'button-bug':    'Characters/Common/Button Bug.png',
  'toasty':        'Characters/Common/Toasty.png',
  'wiggle-worm':   'Characters/Common/Wiggle Worm.png',
  'dust-bunny':    'Characters/Common/Dust Bunny.png',
  // Rare
  'fry-fryer':       'Characters/Rare/Fry Fryer.png',
  'bandage-beetle':  'Characters/Rare/Bandage Beetle.png',
  'trash-turtle':    'Characters/Rare/Trash Turtle.png',
  'static-sprite':   'Characters/Rare/Static Sprite.png',
  'matchstick-kid':  'Characters/Rare/Matchstick Kid.png',
  'soda-surfer':     'Characters/Rare/Soda Surfer.png',
  'fork-knight':     'Characters/Rare/Fork Knight.png',
  'bubble-imp':      'Characters/Rare/Bubble Imp.png',
  // Epic
  'grill-sergeant':  'Characters/Epic/Grill Sergeant.png',
  'silk-sniper':     'Characters/Epic/Silk Sniper.png',
  'scrap-titan':     'Characters/Epic/Scrap Titan.png',
  'thunder-pup':     'Characters/Epic/Thunder Pup.png',
  'nurse-noodle':    'Characters/Epic/Nurse Noodle.png',
  'magnetron':       'Characters/Epic/Magnetron.png',
  'venom-vixen':     'Characters/Epic/Venom Vixen.png',
  'time-tortoise':   'Characters/Epic/Time Tortoise.png',
  // Legendary
  'king-crumbs':         'Characters/Legendary/King Crumbs.png',
  'inferno-dragonette':  'Characters/Legendary/Inferno Dragonette.png',
  'hive-queen':          'Characters/Legendary/Hive Queen.png',
  'chrono-cat':          'Characters/Legendary/Chrono Cat.png',
  'colossus-plug':       'Characters/Legendary/Colossus Plug.png',
  'void-balloon':        'Characters/Legendary/Void Balloon.png',
  'mecha-chef-supreme':  'Characters/Legendary/Mecha Chef Supreme.png',
  'the-janitor':         'Characters/Legendary/The Janitor.png',
};

window.cardArt = function (cardOrId) {
  const id = typeof cardOrId === 'string' ? cardOrId : (cardOrId && cardOrId.id);
  return window.CARD_ART[id] || null;
};

/* Build a circular card visual. Returns a DOM element.
   opts: { size, showStats, draggable, faceDown } */
window.buildCardToon = function (cardOrId, opts) {
  opts = opts || {};
  const card = (typeof cardOrId === 'string')
    ? (window.CARD_BY_ID && window.CARD_BY_ID[cardOrId]) || null
    : cardOrId;
  const el = document.createElement('div');
  el.className = 'toon';
  if (opts.size) { el.style.width = opts.size + 'px'; el.style.height = opts.size + 'px'; }
  if (opts.draggable) el.draggable = true;

  if (opts.faceDown || !card) {
    el.textContent = '?';
    el.style.background = 'repeating-linear-gradient(45deg,#2c6175,#2c6175 6px,#15485a 6px,#15485a 12px)';
    return el;
  }

  el.dataset.cardId = card.id;
  el.dataset.rarity = card.rarity;
  el.title = `${card.name} — HP ${card.hp} · ATK ${card.atk} · SPD ${card.spd}\n${card.ability}: ${card.desc}`;

  const art = window.cardArt(card);
  if (art) {
    el.classList.add('has-art');
    el.style.backgroundImage = `url("${encodeURI(art)}")`;
  } else {
    const h = (card.hue != null) ? card.hue : 200;
    el.style.background = `radial-gradient(circle at 30% 30%, hsl(${h} 70% 78%), hsl(${h} 60% 45%))`;
    const lbl = document.createElement('span');
    lbl.className = 'toon-label';
    lbl.textContent = (card.symbol || '') + ' ' + card.name;
    el.appendChild(lbl);
  }

  if (opts.showStats) {
    const stats = document.createElement('div');
    stats.className = 'toon-stats';
    stats.innerHTML =
      `<span class="s hp">${card.hp}</span>` +
      `<span class="s atk">${card.atk}</span>` +
      `<span class="s spd">${card.spd}</span>`;
    el.appendChild(stats);
  }
  return el;
};
