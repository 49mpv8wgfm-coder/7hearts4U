# The Seven of Hearts

An enchanted card-romance web experience. Some cards are dealt — this one chooses you.

Single-page static site: a full 52-card SVG deck, three card-back designs, nine rose
ornament images, and `magic.css` — an arcane typography layer (shimmering gold titles,
rune eyebrows, scroll reveals, floating motes, 3D card tilt, click-to-flip).

## Run locally
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Structure
```
index.html        the experience (hero, hero card flip, rose garden, back gallery)
magic.css         all enchantment styles — opt-in classes, palette as CSS variables
assets/
  cards/faces/    52 SVG card faces (7 of Hearts is the flagged hero card)
  cards/backs/    back-midnight-rose / back-crimson-velvet / back-celestial
  roses/          blooms, bud, long-stem, bouquet, petals, vine divider
  manifest.json   machine-readable asset map (id -> file, suit, rank, special)
  ART_PROMPTS.md  prompts to repaint any asset as final PNG art
```

## GitHub Pages
Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`.
The site is then live at `https://<username>.github.io/seven-of-hearts/`.
`.nojekyll` is included so asset folders serve as-is.

## Swapping in final artwork
All imagery is resolution-independent SVG placeholder art. Generate painted finals with
`assets/ART_PROMPTS.md`, export cards at 750x1050, keep filename stems, update the
extensions in `assets/manifest.json` — no code changes needed.
