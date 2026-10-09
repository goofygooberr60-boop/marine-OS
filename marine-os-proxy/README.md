# Marine OS (with built-in Ultraviolet proxy)

Everything is in this one folder. Marine OS is `public/index.html`; its Browser app sends
pages through Ultraviolet using the small Node server in `src/`.

## Easiest: run it on your computer
1. Install Node.js (the LTS version) from https://nodejs.org
2. Double-click **Start Marine OS (Windows).bat**  (Mac/Linux: **Start Marine OS (Mac-Linux).command**)
   The first run installs things, then your browser opens Marine OS at http://localhost:8080
3. Unlock it and open **Browser**.

(Or in a terminal: `npm install` then `npm start`.)

## Put it online so it works anywhere
The proxy needs a host that runs Node and allows WebSockets. A static host
(GitHub Pages, Netlify, Vercel, Site123) can NOT run it.
- **Render (free tier):** put this folder in a GitHub repo, then on render.com choose
  New > Blueprint and pick the repo. `render.yaml` is already set up.
- **Anything else (Railway, Fly.io, Replit, a VPS):** build `npm install`, start `npm start`.
  A `Dockerfile` is included too. The host provides PORT automatically.
Use the https address it gives you. Service workers need HTTPS (localhost is exempt).

## Troubleshooting
- Browser says **Proxy offline**: you opened `index.html` as a file or from a static host.
  Open the address of this Node server instead.
- Browser opens but sites never appear: start with `ISOLATE=1 npm start`
  (Windows PowerShell: `$env:ISOLATE=1; npm start`). This can blank game embeds.
- `npm install` complains about a version: copy the dependency versions from the official
  Ultraviolet-App repo: https://github.com/titaniumnetwork-dev/Ultraviolet-App
- Some sites (logins, video, heavy web apps) will not work. Ultraviolet is no longer
  actively maintained; its authors point to a newer project, Scramjet.

## Files
- `public/index.html`  Marine OS
- `public/sw.js`, `public/uv/uv.config.js`  Ultraviolet service worker + settings
- `src/index.js`  serves everything and the /wisp/ socket the proxy uses

Ultraviolet, bare-mux and Epoxy are by Titanium Network / Mercury Workshop.
Check their licenses before publishing a public site.
