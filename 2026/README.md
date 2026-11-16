# I.S.P. 2026 runtime (Webflow)

Paint brushes (`sand-portfolio.js`), LoGD overlay (`lotgd-overlay.js`), and image lazy-load.

Built from the local I.S.P. site with:

```sh
bun run build:overlay
```

Then copy `dist-webflow/*.js` here and push. Webflow `/2026` loads these via GitHub Pages:

`https://adamho91.github.io/adamho91/2026/`

Sounds stay at the repo root (`*.wav`); the bundles already point at this repo.
