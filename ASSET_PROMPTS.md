# Dumptoon TCG — Non-Character Asset Prompts

DALL·E / Midjourney / SDXL prompts for every other image the site needs. Style stays in the same Cartoon Network / old-school dToon family as the character art so the whole site reads as one product.

## Master style (apply to every prompt)

> old-school cartoon style, cartoon network aesthetic, vibrant but slightly muted colors, thick clean black outlines, soft cel shading, painterly background, polished game art, slight paper grain, simple readable shapes, no text, no logos, no watermarks, no signatures, centered composition

**Suggested negatives (paste into negative prompt field):**
> text, letters, words, captions, watermark, logo, signature, low quality, blurry, deformed, photorealistic, 3d render, ugly, jpeg artifacts

**File-saving convention:**
Save assets to `Assets/{Category}/{name}.png` and (where applicable) wire them up in CSS by replacing the existing gradient. Suggested paths included on each prompt.

---

## 1. Card pack art (6) — replace CSS gradients in `get-cards.html`

> Aspect ratio: **3:4 portrait**. The pack should fill the frame with no border padding so the existing CSS frame can crop it cleanly.

### STARTER PACK → `Assets/Packs/starter.png`
glossy collectible trading-card pack standing upright, fresh-grass-green wrapper with subtle orbit-loop pattern, big white sun-burst circle on the front leaving room where text would later be added, tiny stars and sparkles around it, friendly beginner energy, master style above

### BOOSTER PACK → `Assets/Packs/booster.png`
glossy collectible trading-card pack, sky-blue wrapper with diagonal lightning streak, slight chrome shimmer along the seal, three small card silhouettes peeking out of the top, exciting pop, master style above

### MYSTERY PACK → `Assets/Packs/mystery.png`
mysterious trading-card pack, deep midnight purple wrapper with swirling cosmic dust, big question-mark shape made of stars and nebula on the front, faint UFO silhouette, eerie but playful, master style above

### HOLO PACK → `Assets/Packs/holo.png`
trading-card pack with iridescent holographic foil wrapper, rainbow shimmer rolling across the surface, soft pink-purple-blue gradient, small holographic diamond burst centered on the pack face, premium feel, master style above

### STARTER BUNDLE → `Assets/Packs/bundle.png`
big bulky trading-card bundle box, deep red wrapper with gold corner reinforcements, multiple smaller pack silhouettes peeking through a clear plastic window, value-pack feel, treasure-chest energy, master style above

### LEGENDARY PACK → `Assets/Packs/legendary.png`
ornate gold-and-orange trading-card pack, deep crown emblem embossed on the front, dramatic radial light beams behind it, tiny floating stars, regal premium feel, master style above

---

## 2. Card back design (1) — replaces face-down stripe pattern in CSS

### Card back → `Assets/CardBack.png`
> Aspect ratio: **3:4 portrait**. Symmetric, repeats well at small sizes.

dumptoon trading card back design, deep teal background with concentric orbit rings, central white planet symbol with a single ring around it, small star sparkles in corners, simple bold geometric layout that reads at any size, master style above

---

## 3. dZone scene backgrounds (6) — for `visit-dzones.html` zone tiles

> Aspect ratio: **16:9 widescreen**. Empty foreground (no characters) so cards/UI sit on top.

### Arcade dZone → `Assets/Zones/arcade.png`
empty cartoon arcade interior at night, rows of glowing arcade cabinets along the back wall, neon signs reflecting on a checkered floor, soft warm glow, no people, deep negative space in the foreground, master style above

### cMart dZone → `Assets/Zones/cmart.png`
empty cartoon convenience store interior, candy aisle with brightly colored wrappers, glowing fridge in the back, fluorescent ceiling lights, polished checkered floor, no people, foreground clear, master style above

### Garage dZone → `Assets/Zones/garage.png`
cartoon mechanic garage at sunset, oil drums, tools on pegboard, vintage sign on the wall, half-disassembled go-kart in the back corner, dust motes in warm light, no characters, master style above

### Beach dZone → `Assets/Zones/beach.png`
cartoon tropical beach scene, gentle waves, palm trees framing the edges, beach umbrella tilted in the sand, distant sailboat, sunset orange-pink sky, no characters, master style above

### Lab dZone → `Assets/Zones/lab.png`
cartoon mad-scientist laboratory, bubbling beakers on shelves, tesla coil glowing in the back, chalkboard with squiggles, checkered tile floor, soft blue-green glow, no characters, master style above

### Kitchen dZone → `Assets/Zones/kitchen.png`
cartoon diner kitchen scene, gleaming flat-top grill, hanging pots, ketchup and mustard bottles on a stainless prep counter, big window letting in warm afternoon light, no characters, master style above

---

## 4. My Orbit scene backgrounds (3) — for orbit drop-zones

> Aspect ratio: **16:9 widescreen**. Cozy, characters get placed by the player.

### Bedroom → `Assets/Orbits/bedroom.png`
kid's cartoon bedroom, bunk bed in the corner, posters of cartoon characters on the wall, toy chest open, soft afternoon light through the window, plush rug center stage with empty space for placing toy characters, master style above

### Treehouse → `Assets/Orbits/treehouse.png`
cartoon treehouse interior, wooden plank floor, rope ladder hatch, mismatched fairy lights, comic books in a stack, open window showing leaves and blue sky, empty floor for placing characters, master style above

### Junkyard → `Assets/Orbits/junkyard.png`
cartoon junkyard scene at golden hour, stacked tires and crushed cars in the back, rusted oil drums, a wrecked vending machine, weeds poking through cracked concrete, empty foreground, master style above

---

## 5. TV show tiles (8) — for `index.html` TV schedule strip

> Aspect ratio: **1:1 square**, ~256×256. Bold readable thumbnails. Original parody shows — do NOT depict real characters.

### s1 — Sock Sloth & Friends → `Assets/Shows/s1.png`
square cartoon TV show thumbnail, cute group of mismatched cartoon animals lounging on a couch, simple bold composition, playful slice-of-life vibe, no text, master style above

### s2 — The Crumb Crew → `Assets/Shows/s2.png`
square cartoon TV show thumbnail, gremlin-like cartoon creatures hiding under furniture grabbing snacks, mischievous gang feel, no text, master style above

### s3 — Toast Squad → `Assets/Shows/s3.png`
square cartoon TV show thumbnail, breakfast-food superhero team in action poses, butter cape, cereal-bowl shield, comic-book sunburst behind them, no text, master style above

### s4 — Static City → `Assets/Shows/s4.png`
square cartoon TV show thumbnail, retro-future city skyline crackling with cartoon lightning bolts, neon signs, cyberpunk-lite, no text, master style above

### s5 — Critter Lab → `Assets/Shows/s5.png`
square cartoon TV show thumbnail, mad-scientist lab interior with cute lab animals knocking over beakers, chaos energy, no text, master style above

### s6 — Junkyard Jam → `Assets/Shows/s6.png`
square cartoon TV show thumbnail, music-festival stage built from car parts, cartoon mascots playing instruments made of trash, no text, master style above

### s7 — Royal Crumbs → `Assets/Shows/s7.png`
square cartoon TV show thumbnail, tiny king character on a throne built from snack scraps, royal banners, regal goofy vibe, no text, master style above

### s8 — Void Hour → `Assets/Shows/s8.png`
square cartoon TV show thumbnail, dark balloon with a galaxy inside drifting through a starry sky, eerie but cute, no text, master style above

---

## 6. Hero / banner art (4)

### Top page banner → `Assets/Banners/top-banner.png`
> Aspect ratio: **728:90 leaderboard**. Wide, low-height. Subtle so it doesn't fight UI.

wide horizontal cartoon banner, parade of small cartoon characters running across a desert horizon, distant buildings, soft sunset gradient, plenty of empty sky for headline text to be added later, master style above

### "Join Now" promo tile → `Assets/Banners/join-now.png`
> Aspect ratio: **3:2**. For the membership area.

cartoon promotional tile, group of cheerful cartoon mascots holding up a giant golden ticket, confetti raining down, festive vibe, big empty space at the top for headline text, master style above

### Featured weekly hero → `Assets/Banners/featured-week.png`
> Aspect ratio: **16:9**. Rotates weekly on the home page.

wide horizontal cartoon hero scene, six toy-figure characters lined up on a glowing podium, spotlight beams overhead, "new release" energy, no text, master style above

### Pack-store hero → `Assets/Banners/store-hero.png`
> Aspect ratio: **16:9**.

cartoon storefront hero, exploding pile of trading-card packs spilling out of a treasure chest, glowing cards floating mid-air, sparkles and confetti, master style above

---

## 7. UI icons & glyphs (8)

> Aspect ratio: **1:1 square** transparent background where possible. ~128×128 final.

### Planet glyph → `Assets/Icons/planet.png`
small chibi cartoon planet with a single tilted ring, glossy highlight, transparent background, no text, master style above

### Search magnifier → `Assets/Icons/search.png`
chunky cartoon magnifying glass, thick black outline, slight wood handle, transparent background, master style above

### Speaker icon → `Assets/Icons/speaker.png`
cartoon speaker emitting two sound-wave arcs, retro Saturday-morning aesthetic, transparent background, master style above

### Easter-egg coin → `Assets/Icons/easter-coin.png`
glowing cartoon dollar coin with a sparkle highlight, slightly bouncing pose suggested by motion lines, transparent background, master style above

### Wallet icon → `Assets/Icons/wallet.png`
plump cartoon wallet bursting with cartoon dollar bills, transparent background, master style above

### Trade arrows → `Assets/Icons/trade.png`
two cartoon arrows looping in opposite directions forming a circular trade icon, glossy and chunky, transparent background, master style above

### Crown rank icon → `Assets/Icons/crown.png`
small chibi cartoon crown with a ruby, glossy highlights, transparent background, master style above

### Shield rank icon → `Assets/Icons/shield.png`
small chibi cartoon heater shield with a star emblem, glossy, transparent background, master style above

---

## 8. Pack-open VFX bursts (3) — for the pack-pull animation

> Aspect ratio: **1:1 square**. Will overlay the pulled card with `mix-blend-mode: screen`.

### Common pull burst → `Assets/VFX/burst-common.png`
soft white circular shimmer burst, faint particle dots, transparent background, master style above

### Rare pull burst → `Assets/VFX/burst-rare.png`
electric blue radial burst with light streaks, small star particles, transparent background, master style above

### Epic pull burst → `Assets/VFX/burst-epic.png`
violet purple swirling magical burst with curling smoke trails, transparent background, master style above

### Legendary pull burst → `Assets/VFX/burst-legendary.png`
explosive gold-orange radial burst with dramatic light rays and confetti sparks, intense glow, transparent background, master style above

---

## 9. Empty-state illustrations (3)

### Empty inventory → `Assets/EmptyStates/inventory-empty.png`
> Aspect ratio: **4:3**.

cartoon empty cardboard box tipped over with one tiny dust bunny inside, soft pastel background, friendly "nothing here yet" mood, no text, master style above

### No opponents online → `Assets/EmptyStates/no-opponents.png`
> Aspect ratio: **4:3**.

empty cartoon arena with one tumbleweed rolling across, distant desert horizon, lonely-but-cute vibe, no characters, master style above

### Error 404 → `Assets/EmptyStates/error-404.png`
> Aspect ratio: **4:3**.

cartoon broken TV with cartoon static on the screen, antenna bent, dust bunny napping on top, friendly broken-page mood, no text, master style above

---

## 10. Branding (3)

### DT Network logo → `Assets/Brand/dt-logo.png`
> Aspect ratio: **1:1 square** with transparent background.

bold cartoon network style logo block design featuring the letters DT inside a chunky rounded square, drop shadow, transparent background, no extra text, master style above

### ORBIT wordmark → `Assets/Brand/orbit-wordmark.png`
> Aspect ratio: **3:1 wide** transparent.

retro 90s wordmark of the word ORBIT in italic chunky letters with an orbit ring looping through the O, glossy highlights, transparent background, master style above

### Favicon → `Assets/Brand/favicon.png`
> Aspect ratio: **1:1 square** 64×64.

simple chibi cartoon planet with a ring, very legible at small size, flat color, transparent background, master style above

---

## 11. Page background tile (1)

### Subtle paper texture → `Assets/BG/paper-tile.png`
> Aspect ratio: **1:1 square**, must seamlessly tile.

seamlessly tiling subtle paper texture in muted teal-grey, very faint cartoon orbit-loop watermark scattered across, low contrast so UI sits comfortably on top, no obvious seams, master style above

---

## Implementation hints

- For pack art: edit `styles.css` `.pack .art.starter` etc. — replace the gradient with `background-image: url('Assets/Packs/starter.png'); background-size: cover;`
- For card back: edit `card-art.js` `buildCardToon` faceDown branch — swap the stripe gradient for the new image.
- For zone backgrounds: edit `.zone` (or whatever class wraps each zone tile) in `styles.css` and add a `background-image`.
- For TV show tiles: edit `.show-tile.s1` … `.s8` in `styles.css`.
- For VFX bursts: layer over the `.toon` element after a pack pull. Use `position:absolute; mix-blend-mode: screen; opacity: 0; animation: burst .8s ease-out forwards;`.
- For favicon: add `<link rel="icon" href="Assets/Brand/favicon.png">` to each page's `<head>`.
