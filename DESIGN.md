# Dumptoon TCG — Design Doc

## Core stats

| Stat | Effect |
|------|--------|
| HP   | Health. 0 = defeat. No regen unless an ability provides it. Overheal cap = +2 over base. |
| ATK  | Base damage. Crit chance 10% → +50% damage. |
| SPD  | Turn order. Dodge chance = `SPD × 3%`. Reduces incoming debuff duration. |

### Status effects
- **Burn** — 1 damage per turn at start of owner's turn.
- **Slow** — −1 SPD for the duration.
- **Weaken** — −1 ATK for the duration.
- **Shield** — Absorbs damage points before HP. Stacks.
- **Stun** — Skip next turn (Legendary-tier only).
- **Poison** — Like Burn but stacks; each stack adds 1 dmg/turn.

## Card roster

Stat numbers live in `cards.js` — this is the design intent.

### Common (8) — baseline ~3 stat-points
Pure utility, low ceiling, fill out the deck floor.

### Rare (8) — ~5 stat-points + a conditional trigger
First tier where synergies appear (Burn combos, Bug tribe, Shield stacking).

### Epic (8) — ~7 stat-points + cooldown ability
Cooldown 1 means "every other turn." First tier with revives, multi-hits, team buffs.

### Legendary (8) — ~9 stat-points + game-warping ability (CD 2)
One copy max per deck. Each one rewrites a rule (extra turn, mass stun, on-death AoE, status reset).

## Roles
- **DPS** — high ATK, low HP. Win by going fast.
- **Tank** — high HP, low SPD. Eat hits, soak shields.
- **Support** — heals, buffs, status. Glue between DPS and Tank.
- **Control** — debuffs, board manipulation. Janitor only at the moment.

## Deck rules
- 20 cards total
- Min 6 Common, min 4 Rare
- Max 1 of any Legendary (so a maximum of 8 Legendaries possible — but pity rate makes that aspirational)
- No more than 3 copies of any single Common or Rare; 1 copy of any Epic

## Board
3 slots: **Left, Center, Right**. Resolve in SPD order top to bottom; ties resolve Left→Right.

## Pack system

| Pack | Cost | Cards | Notable rule |
|------|------|-------|--------------|
| Starter   | $1.00  | 3  | All commons. |
| Booster   | $3.00  | 5  | 1 guaranteed Rare+. |
| Mystery   | $2.50  | 4  | Wild distribution, including a 2% Legendary. |
| Holo      | $5.00  | 5  | Higher Rare/Epic skew. |
| Bundle    | $8.00  | 12 | Best $/card if building fast. |
| Legendary | $10.00 | 6  | No commons; 30% Legendary per slot. |

**Pity:** Epic guaranteed every 5 packs without one; Legendary every 12.

## Match resolution
Player B sample win: stacked SPD (Soda Surfer + Static Sprite) outraced Player A's tank wall before the revive landed. **Conclusion: SPD is currently the strongest stat.** See balance notes.

---

## Balance pass — observations

A first read on the stat sheet. Numbers are "off the page" only — playtest before changing.

### Strong
1. **Chrono Cat (Legendary)** — HP7 / ATK6 / SPD7 + extra turn on a 2-turn CD. SPD 7 means ~21% dodge AND first move. Extra turn effectively doubles its ATK output for the round it fires. *Likely the strongest single card.*
2. **Inferno Dragonette** — AoE on CD2 with ATK7 base. Bonus damage vs already-Burning targets makes Matchstick Kid + Fry Fryer feeders. Combo ceiling is very high.
3. **SPD synergies in general** — Static Sprite, Soda Surfer, Thunder Pup, Bubble Imp, Chrono Cat all reward SPD. Speed snowball is real and matches the noted match result.

### Weak
1. **Drip Drop** — HP3 ATK1, only a 30% dodge. One hit ends it. Even Common-tier filler should survive a turn most of the time.
2. **Crumb Gobbler** — Heal-on-any-death is fine, but a 1-ATK 5-HP body gives nothing else; it's effectively a 1-time 2-HP heal taped to a wall. Consider buffing the heal to 3 or letting it heal twice.
3. **Time Tortoise** — Slow is the weakest debuff and CD2 is steep for "−SPD" with no damage attached. Either give it a damage rider or drop the CD.
4. **Magnetron** — Passive "fast enemies lose 1 ATK" is fine but undertuned next to other Epics that get cooldown actives.

### Suggested levers (no changes applied yet)
- **Drip Drop**: HP 3→4, dodge 30→40%
- **Crumb Gobbler**: heal 2→3 OR triggers twice per match
- **Time Tortoise**: CD 2→1, OR add "deal 2 damage" rider
- **Chrono Cat**: extra turn → "act again with 50% damage" to remove the snowball

### Tribal/synergy notes
- **Bug tribe**: Button Bug, Bandage Beetle, Silk Sniper, Hive Queen — Hive Queen is the natural payoff. Bandage Beetle's "+2 if Bug" is the only existing tag callout; add 2-3 more for the tribe to feel real.
- **Burn chain**: Toasty (chance) → Matchstick Kid (apply) → Fry Fryer (apply) → Grill Sergeant (payoff) → Inferno Dragonette (bigger payoff). Pretty clean already.
- **Shield chain**: Fork Knight, Trash Turtle, Colossus Plug. Missing a Common shield-applier; without one the chain doesn't start until turn 2-3.

### Pack economics
- Starter $1 / 3 commons → effective $0.33 per common. Fine.
- Bundle $8 / 12 cards with weighted Rare+ → best by $/card if you don't care which.
- Legendary pack at $10 with 30% Legendary per slot → expected ~1.8 Legendaries per pack, which is generous. Consider 20% per slot or capping at 1 Legendary per pack.
