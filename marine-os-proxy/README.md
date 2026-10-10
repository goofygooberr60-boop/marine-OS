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

## Speed
The Browser has two engines (Settings > Browser > Proxy engine):
- **Auto (default):** uses **Scramjet**, the newer and faster proxy, and switches to
  **Ultraviolet** by itself if Scramjet isn't available on the server.
- Scramjet or Ultraviolet: force one. If a site looks broken on one, try the other.

Things that make the biggest difference to speed:
- **Render's free plan sleeps** after 15 minutes without visitors, and the first load
  then takes up to a minute. A free uptime pinger (for example UptimeRobot) that opens
  your site every 5 minutes keeps it awake.
- **Pick the Render region nearest to you** when you create the service.
- Free hosts are slow for video and heavy sites. Lighter pages are much faster.

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

Ultraviolet (Titanium Network) and Scramjet, bare-mux, Epoxy and libcurl-transport (Mercury Workshop).
Check their licenses before publishing a public site.
