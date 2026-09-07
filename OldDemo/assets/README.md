# Assets — Seven of Hearts deck

Resolution-independent SVG artwork. Drop any file into an `<img>` tag or CSS `url()`.

## Structure
```
assets/
  cards/
    faces/   52 files, e.g. 7_of_hearts.svg, ace_of_spades.svg, queen_of_hearts.svg
    backs/   back-midnight-rose.svg, back-crimson-velvet.svg, back-celestial.svg
  roses/     rose-red / rose-blush / rose-ivory / rose-gold / rosebud /
             rose-long-stem / petals-scatter / bouquet / vine-divider (all .svg)
  manifest.json    machine-readable map of every asset (id -> file, suit, rank, special flag)
  ART_PROMPTS.md   prompts to regenerate any asset as painted PNG art later
```

## Swapping in final art
1. Paint/generate finals (Midjourney, SDXL, commissioned) using ART_PROMPTS.md.
2. Export card art at 750x1050 px (3x of the 250x350 viewBox), roses at 1200x1200 px.
3. Keep the same filename stem (`7_of_hearts.png`) and update `manifest.json` extensions.
4. Nothing else changes — the site reads the manifest.

The 7 of Hearts face is flagged `special: true` in the manifest and carries extra
gold glow + rose flourishes; keep that treatment in final art.
