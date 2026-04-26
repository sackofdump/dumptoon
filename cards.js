/* Dumptoon TCG — 32-card master set.
   8 cards per tier: COMMON, RARE, EPIC, LEGENDARY.
   `symbol` is a placeholder glyph until real art lands.
   `hue` (0-360) seeds a tinted gradient so each card reads distinct. */

window.CARDS = [
  // ---- COMMON (8) ----
  { id: 'sock-sloth',       name: 'Sock Sloth',       role: 'Tank',    rarity: 'common', hp: 9,  atk: 2, spd: 1, ability: 'TOO COMFY',      desc: 'First damage each round reduced by 2', symbol: '🧦', hue: 25 },
  { id: 'crumb-gobbler',    name: 'Crumb Gobbler',    role: 'Support', rarity: 'common', hp: 5,  atk: 1, spd: 3, ability: 'SNACK SCAVENGE', desc: 'Heal 2 when any unit dies', symbol: '🍞', hue: 42 },
  { id: 'paper-pal',        name: 'Paper Pal',        role: 'Support', rarity: 'common', hp: 4,  atk: 2, spd: 4, ability: 'REFOLD',         desc: 'Alternate +2 HP or +2 ATK each turn', symbol: '📄', hue: 200 },
  { id: 'drip-drop',        name: 'Drip Drop',        role: 'Support', rarity: 'common', hp: 3,  atk: 1, spd: 5, ability: 'EVAPORATE',      desc: '30% chance to dodge', symbol: '💧', hue: 195 },
  { id: 'button-bug',       name: 'Button Bug',       role: 'Tank',    rarity: 'common', hp: 8,  atk: 2, spd: 2, ability: 'LOOSE THREAD',   desc: '25% chance to reduce attacker ATK', symbol: '🐞', hue: 5 },
  { id: 'toasty',           name: 'Toasty',           role: 'DPS',     rarity: 'common', hp: 5,  atk: 4, spd: 2, ability: 'OVERCOOKED',     desc: '20% chance for +2 damage', symbol: '🍞', hue: 20 },
  { id: 'wiggle-worm',      name: 'Wiggle Worm',      role: 'DPS',     rarity: 'common', hp: 4,  atk: 3, spd: 4, ability: 'OVERREACT',      desc: 'Gain +1 ATK after being hit', symbol: '🪱', hue: 130 },
  { id: 'dust-bunny',       name: 'Dust Bunny',       role: 'Support', rarity: 'common', hp: 6,  atk: 1, spd: 3, ability: 'MESSY TRAIL',    desc: 'Hit enemies lose 1 SPD next turn', symbol: '☁️', hue: 220 },

  // ---- RARE (8) ----
  { id: 'fry-fryer',        name: 'Fry Fryer',        role: 'DPS',     rarity: 'rare', hp: 6,  atk: 5, spd: 2, ability: 'OIL SPLASH',     desc: 'Hit 2 enemies. 30% Burn', symbol: '🍟', hue: 50 },
  { id: 'bandage-beetle',   name: 'Bandage Beetle',   role: 'Support', rarity: 'rare', hp: 7,  atk: 2, spd: 3, ability: 'PATCH UP',       desc: 'Heal lowest ally for 3 (+2 if Bug)', symbol: '🩹', hue: 350 },
  { id: 'trash-turtle',     name: 'Trash Turtle',     role: 'Tank',    rarity: 'rare', hp: 11, atk: 2, spd: 1, ability: 'HOARD ARMOR',    desc: 'Gain 1 Shield when any unit dies', symbol: '🐢', hue: 110 },
  { id: 'static-sprite',    name: 'Static Sprite',    role: 'Support', rarity: 'rare', hp: 5,  atk: 2, spd: 5, ability: 'CHARGE ZAP',     desc: '+2 damage if faster. Apply Slow', symbol: '⚡', hue: 55 },
  { id: 'matchstick-kid',   name: 'Matchstick Kid',   role: 'DPS',     rarity: 'rare', hp: 5,  atk: 4, spd: 4, ability: 'IGNITE',         desc: 'Burn target. Bonus damage if Burning', symbol: '🔥', hue: 12 },
  { id: 'soda-surfer',      name: 'Soda Surfer',      role: 'DPS',     rarity: 'rare', hp: 6,  atk: 4, spd: 5, ability: 'FIZZ RUSH',      desc: '25% chance to attack again', symbol: '🥤', hue: 305 },
  { id: 'fork-knight',      name: 'Fork Knight',      role: 'Tank',    rarity: 'rare', hp: 10, atk: 3, spd: 2, ability: 'GUARD STANCE',   desc: 'Gain 2 Shield. If Shielded, +1 ATK', symbol: '🍴', hue: 215 },
  { id: 'bubble-imp',       name: 'Bubble Imp',       role: 'Support', rarity: 'rare', hp: 5,  atk: 2, spd: 5, ability: 'BUBBLE TRAP',    desc: 'Deal 2 dmg. Slow 2 turns (+2 if fast)', symbol: '🫧', hue: 185 },

  // ---- EPIC (8) ----
  { id: 'grill-sergeant',   name: 'Grill Sergeant',   role: 'DPS',     rarity: 'epic', hp: 8,  atk: 6, spd: 2, ability: 'DOUBLE FLIP (CD1)', desc: 'Attack twice, +1 if Burning', symbol: '🔥', hue: 8 },
  { id: 'silk-sniper',      name: 'Silk Sniper',      role: 'DPS',     rarity: 'epic', hp: 6,  atk: 5, spd: 5, ability: 'THREAD SHOT (CD1)', desc: 'Slow 2 turns, bonus damage if Slowed', symbol: '🕸️', hue: 270 },
  { id: 'scrap-titan',      name: 'Scrap Titan',      role: 'Tank',    rarity: 'epic', hp: 15, atk: 3, spd: 1, ability: 'REBUILD',          desc: 'Revive with 3 HP once', symbol: '🤖', hue: 0 },
  { id: 'thunder-pup',      name: 'Thunder Pup',      role: 'DPS',     rarity: 'epic', hp: 7,  atk: 5, spd: 6, ability: 'CHAIN ZAP (CD1)',  desc: 'Hit 3 enemies', symbol: '⚡', hue: 60 },
  { id: 'nurse-noodle',     name: 'Nurse Noodle',     role: 'Support', rarity: 'epic', hp: 7,  atk: 2, spd: 4, ability: 'GROUP HEAL (CD1)', desc: 'Heal all allies', symbol: '🩺', hue: 140 },
  { id: 'magnetron',        name: 'Magnetron',        role: 'Tank',    rarity: 'epic', hp: 13, atk: 3, spd: 2, ability: 'PULL',             desc: 'Fast enemies lose 1 ATK', symbol: '🧲', hue: 350 },
  { id: 'venom-vixen',      name: 'Venom Vixen',      role: 'DPS',     rarity: 'epic', hp: 6,  atk: 5, spd: 5, ability: 'POISON STRIKE (CD1)', desc: 'Poison + bonus damage', symbol: '🦂', hue: 280 },
  { id: 'time-tortoise',    name: 'Time Tortoise',    role: 'Support', rarity: 'epic', hp: 10, atk: 2, spd: 2, ability: 'DELAY (CD2)',      desc: 'Reduce SPD heavily', symbol: '⏳', hue: 165 },

  // ---- LEGENDARY (8) ----
  { id: 'king-crumbs',      name: 'King Crumbs',      role: 'Support', rarity: 'legendary', hp: 10, atk: 3, spd: 4, ability: 'FEAST / SUMMON (CD2)', desc: 'Allies heal on death. Spawn minion', symbol: '👑', hue: 38 },
  { id: 'inferno-dragonette', name: 'Inferno Dragonette', role: 'DPS', rarity: 'legendary', hp: 9, atk: 7, spd: 4, ability: 'BLAZE STORM (CD2)',  desc: 'Hit all enemies, bonus vs Burn', symbol: '🐉', hue: 10 },
  { id: 'hive-queen',       name: 'Hive Queen',       role: 'Support', rarity: 'legendary', hp: 11, atk: 3, spd: 3, ability: 'SWARM / BUFF (CD2)',  desc: 'Summon bugs each turn. Buff all bugs', symbol: '🐝', hue: 48 },
  { id: 'chrono-cat',       name: 'Chrono Cat',       role: 'DPS',     rarity: 'legendary', hp: 7,  atk: 6, spd: 7, ability: 'REWIND (CD2)',        desc: 'Extra turn (max once per round)', symbol: '🐈', hue: 250 },
  { id: 'colossus-plug',    name: 'Colossus Plug',    role: 'Tank',    rarity: 'legendary', hp: 18, atk: 4, spd: 1, ability: 'OVERLOAD / STUN (CD2)', desc: 'Reduce all dmg. Stun all enemies', symbol: '🔌', hue: 190 },
  { id: 'void-balloon',     name: 'Void Balloon',     role: 'Support', rarity: 'legendary', hp: 8,  atk: 2, spd: 5, ability: 'POP (CD2)',           desc: 'On death, deal 5 to all enemies', symbol: '🎈', hue: 290 },
  { id: 'mecha-chef-supreme', name: 'Mecha Chef Supreme', role: 'DPS', rarity: 'legendary', hp: 10, atk: 6, spd: 3, ability: 'COMBO PLATE (CD1)',  desc: 'Multi-hit + self heal', symbol: '👨‍🍳', hue: 30 },
  { id: 'the-janitor',      name: 'The Janitor',      role: 'Control', rarity: 'legendary', hp: 12, atk: 3, spd: 3, ability: 'CLEAN SLATE / SWEEP (CD2)', desc: 'Remove status. Damage all enemies', symbol: '🧹', hue: 105 },
];

window.CARDS_BY_RARITY = {
  common:    window.CARDS.filter(c => c.rarity === 'common'),
  rare:      window.CARDS.filter(c => c.rarity === 'rare'),
  epic:      window.CARDS.filter(c => c.rarity === 'epic'),
  legendary: window.CARDS.filter(c => c.rarity === 'legendary'),
};

window.CARD_BY_ID = Object.fromEntries(window.CARDS.map(c => [c.id, c]));

/* Pack roll tables: each pack draws N cards using these rarity weights */
window.PACK_DEFS = {
  starter:   { name: 'STARTER PACK',    cost: 100,  cards: 3,  art: 'starter',   weights: { common: 100 } },
  booster:   { name: 'BOOSTER PACK',    cost: 300,  cards: 5,  art: 'booster',   weights: { common: 70, rare: 30 } },
  mystery:   { name: 'MYSTERY PACK',    cost: 250,  cards: 4,  art: 'mystery',   weights: { common: 50, rare: 30, epic: 18, legendary: 2 } },
  holo:      { name: 'HOLO PACK',       cost: 500,  cards: 5,  art: 'holo',      weights: { common: 35, rare: 40, epic: 22, legendary: 3 } },
  bundle:    { name: 'STARTER BUNDLE',  cost: 800,  cards: 12, art: 'bundle',    weights: { common: 60, rare: 28, epic: 10, legendary: 2 } },
  legendary: { name: 'LEGENDARY PACK',  cost: 1000, cards: 6,  art: 'legendary', weights: { rare: 30, epic: 40, legendary: 30 } },
};

window.rollPack = function (packId) {
  const def = window.PACK_DEFS[packId];
  if (!def) return [];
  const totalWeight = Object.values(def.weights).reduce((a,b) => a+b, 0);
  const out = [];
  for (let i = 0; i < def.cards; i++) {
    let r = Math.random() * totalWeight;
    let chosenRarity = 'common';
    for (const [rar, w] of Object.entries(def.weights)) {
      r -= w;
      if (r <= 0) { chosenRarity = rar; break; }
    }
    const pool = window.CARDS_BY_RARITY[chosenRarity];
    const card = pool[Math.floor(Math.random() * pool.length)];
    out.push(card);
  }
  return out;
};
