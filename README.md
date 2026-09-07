# 7♥ — Seven Hearts

A one-person swipe deck. She is the only person in it. Swipe right through
A♥ → 7♥; the seventh card triggers the rose-petal finale. Swipe left and the
deck rains jokers. Swipe up on any card for its hashtag detail side.

## Repo note

The binary placeholder images (JPG/PNG in `assets/cards`, `assets/fx`,
`assets/meta`) are not in git yet. Fastest way to add them: open this repo on
github.com → **Add file → Upload files** → drag the `assets` folders in. Or
skip placeholders entirely and drop in your final custom art — same filenames
and the app just works.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Double-clicking index.html also works in most browsers (a fallback manifest is
embedded in js/app.js), but a local server is the reliable path.

## Folder map

```text
index.html
css/style.css            design system + all text magic
js/app.js                deck logic, joker gag, petal finale
assets/
  manifest.json          ALL words + art paths — edit this, not the code
  cards/                 face-01..07-hearts.jpg, back.jpg, joker-a/b/c.jpg
  fx/                    petal-1..5.png, rose-hero.png, felt-table.jpg, paper-grain.png
  meta/                  icons, og-image.jpg, site.webmanifest
```

## Swapping in your art

Replace any file in assets/cards or assets/fx with your own design using the
same filename — done. Different filenames or counts? Edit assets/manifest.json;
the deck rebuilds from it. Card art is plain 750×1050 (2.5:3.5) rectangles;
rounded corners are applied in CSS so no transparency is needed. Keep the top
and bottom ~15% visually calm: the corner ranks, hashtag chip, and hint line
are live HTML text layered on top, so your art never fights the type.

## The magic-type toolkit (css/style.css)

- `.foil` — animated gold light sweep across letterforms (final message)
- `.deal-in` — per-letter staggered deal, driven by `--i` (quips)
- `.rank` — crimson-to-gold shimmer on every numeral, plus `.rank.settle`
  spin-in when a card is dealt and `.rank.big::after` twinkle spark
- `.deboss` — engraved press effect for captions
- `.heartbeat` — double-thump pulse on heart glyphs
- `.wobble` — joker message tilt
- `.chip` — glass pill with iridescent sheen sweep (hashtags)

All of it honors prefers-reduced-motion with a static gold fallback.

## Defaults to override

- Final message lives in `finale.message` and `finale.sign` in the manifest.
- Card back is a generic 7♥ medallion — add her monogram once you decide.
- Placeholder faces are meant to be replaced. Jokers, petals, and the rose
  are usable as-is or swappable too.

## Notes

Zero dependencies: vanilla JS + CSS, no CDN libraries. If you want heavier
spring physics later, GSAP drops in cleanly around the existing pointer code.
`noindex` is set in the HTML head; the repo is private, so the deck stays
yours until you decide otherwise.
