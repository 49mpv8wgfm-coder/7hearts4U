# 7♥ — Seven Hearts

A one-person swipe deck. She is the only person in it. Swipe right through
A♥ → 7♥; the seventh card triggers the rose-petal finale. Swipe left and the
deck rains jokers. Swipe up on any card for its hashtag detail side.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or enable GitHub Pages (Settings → Pages → deploy from `main`) once the repo
goes public.

## Folder map

```text
index.html
css/style.css            design system + all text magic
js/app.js                deck logic, joker gag, petal finale
assets/
  manifest.json          ALL words + art paths — edit this, not the code
  cards/                 joker-a/b/c.svg (card faces currently dealt from OldDemo)
  fx/                    petal-1..5.svg, felt-table.svg, paper-grain.svg
  meta/                  icon.svg, site.webmanifest
OldDemo/
  assets/                archived first-attempt art: 52 SVG faces, 3 backs, 9 roses
```

## Current wiring

The deck currently deals the archived SVG art: A♥–7♥ faces, the
crimson-velvet back, and the red rose all load from `OldDemo/assets/` via
`assets/manifest.json`. The old faces have their ranks baked in, so the live
corner ranks stay hidden while `meta.bakedRanks` is true. Swap in your custom
card art by dropping files into `assets/cards/` and updating the manifest
paths; set `bakedRanks` false if your art has no ranks drawn on it.

## The magic-type toolkit (css/style.css)

- `.foil` — animated gold light sweep across letterforms (final message)
- `.deal-in` — per-letter staggered deal, driven by `--i` (quips)
- `.rank` — crimson-to-gold shimmer on numerals, `.rank.settle` spin-in on deal,
  `.rank.big::after` twinkle spark
- `.deboss` — engraved press effect for captions
- `.heartbeat` — double-thump pulse on heart glyphs
- `.wobble` — joker message tilt
- `.chip` — glass pill with iridescent sheen sweep (hashtags)

All of it honors prefers-reduced-motion with a static gold fallback.

## Defaults to override

- Final message lives in `finale.message` and `finale.sign` in the manifest.
- The card back is the crimson-velvet design from the archive — swap or add
  her monogram when you decide.
- Zero dependencies: vanilla JS + CSS, no CDN libraries. `noindex` is set.
