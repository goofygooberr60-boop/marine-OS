(() => {
  const root = document.getElementById('marineGameCenterRoot');
  if (!root) return;

  const SERAPH_HOME = 'https://seraph.reveriestudios.online';
  const SERAPH_SOURCE = 'https://github.com/a456pur/seraph';
  const GN_MATH_SOURCE = 'https://github.com/gn-math';
  const GN_MATH_SITE = 'https://gn-math.github.io/';
  const GN_MATH_ZONES = [
    'https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json',
    'https://raw.githubusercontent.com/gn-math/assets/refs/heads/main/zones.json'
  ];
  const GN_MATH_COVERS = 'https://cdn.jsdelivr.net/gh/gn-math/covers@main';
  const GN_MATH_HTML = 'https://cdn.jsdelivr.net/gh/gn-math/html@main';
  const SERAPH_IMAGE_PREFIX = 'https://cdn.jsdelivr.net/gh/a456pur/seraph@main/images/thumbnails/';
  const safeText = (value) => String(value || '').trim();
  const state = {
    section: 'gn-math', query: '', sort: 'featured', genre: 'all',
    gnGames: [], seraphGames: [], gnStatus: 'loading', seraphStatus: 'loading'
  };

  const style = document.createElement('style');
  style.textContent = `
    #marineGameCenterRoot{color:#e7f1ec;font-family:Inter,system-ui,sans-serif}
    .mgc-shell{height:100%;display:flex;flex-direction:column;min-height:0;background:radial-gradient(ellipse at 50% -35%,rgba(44,125,98,.22),transparent 60%),#071410}
    .mgc-top{padding:17px 20px 13px;border-bottom:1px solid rgba(170,220,199,.09);background:rgba(8,24,18,.64)}
    .mgc-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px}
    .mgc-heading h2{font-size:21px;line-height:1.2;margin:0;font-weight:700;color:#f1f8f4;letter-spacing:-.02em}
    .mgc-heading p{font-size:12px;color:#96afa2;margin:5px 0 0}
    .mgc-source{font-size:11px;color:#85c9a8;white-space:nowrap;text-decoration:none}
    .mgc-source:hover{color:#c2f0d2;text-decoration:underline}
    .mgc-controls{display:grid;grid-template-columns:auto minmax(130px,1fr) 130px 145px;gap:8px;align-items:center}
    .mgc-tabs{display:flex;gap:6px}
    .mgc-tab,.mgc-select,.mgc-search{height:38px;border:1px solid rgba(174,213,195,.13);background:#0a1b14;color:#d5e8dc;border-radius:11px}
    .mgc-tab{padding:0 14px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:650;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,color .15s}
    .mgc-tab:hover,.mgc-tab.active{background:#205b43;border-color:#59a77e;color:#fff}
    .mgc-search{display:flex;align-items:center;gap:9px;padding:0 12px;min-width:0}
    .mgc-search i{color:#6fc19a;font-size:13px}
    .mgc-search input{width:100%;min-width:0;background:transparent;border:0;outline:0;color:#f3fbf6;font-size:12px}
    .mgc-search input::placeholder{color:#719083}
    .mgc-select{padding:0 10px;font-size:12px;outline:none;cursor:pointer}
    .mgc-summary{font-size:11px;color:#83b59a;margin:11px 0 0;min-height:14px}
    .mgc-grid{flex:1;min-height:0;overflow:auto;padding:16px 20px 24px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));align-content:start;gap:13px}
    .mgc-card{min-width:0;overflow:hidden;border-radius:12px;background:#10231a;border:1px solid rgba(172,211,194,.12);cursor:pointer;transition:transform .16s,border-color .16s,box-shadow .16s;color:inherit;text-align:left;padding:0;display:flex;flex-direction:column}
    .mgc-card:hover{transform:translateY(-3px);border-color:rgba(104,196,145,.58);box-shadow:0 12px 26px rgba(0,0,0,.28)}
    .mgc-card:focus-visible,.mgc-tab:focus-visible,.mgc-select:focus-visible,.mgc-search:focus-within{outline:2px solid #7bd5a0;outline-offset:2px}
    .mgc-cover{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:linear-gradient(135deg,#174935,#0a1711);}
    .mgc-cover-fallback{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,#174935,#0a1711);color:#85cda3;font-size:32px}
    .mgc-name{padding:9px 10px 10px;font-size:12px;line-height:1.25;font-weight:650;color:#e6f1e9;min-height:34px;text-transform:capitalize;overflow-wrap:anywhere}
    .mgc-empty{grid-column:1/-1;border:1px dashed rgba(151,197,172,.25);border-radius:16px;padding:30px 22px;text-align:center;background:rgba(14,38,26,.58);color:#a8c2b1}
    .mgc-empty .fa-spinner{animation:mgc-spin .9s linear infinite}@keyframes mgc-spin{to{transform:rotate(360deg)}}
    .mgc-empty i{display:block;font-size:28px;color:#71b88b;margin:0 auto 10px}
    .mgc-empty strong{display:block;color:#e5f1e9;font-size:14px;margin-bottom:6px}
    .mgc-empty p{font-size:12px;line-height:1.55;max-width:520px;margin:0 auto 13px}
    .mgc-link{display:inline-flex;align-items:center;gap:7px;border:0;border-radius:9px;padding:8px 12px;background:#205b43;color:#f4fff7;text-decoration:none;font:650 12px Inter,system-ui,sans-serif;cursor:pointer}
    .mgc-link:hover{background:#2b7655}
    .mgc-notice{margin:14px 20px 0;padding:10px 12px;border:1px solid rgba(136,189,151,.14);border-radius:10px;background:rgba(19,54,34,.42);color:#9fbaa9;font-size:11px;line-height:1.5}
    .mgc-credit{padding:8px 20px;border-top:1px solid rgba(170,220,199,.08);font-size:10px;color:#718e7d}
    .mgc-credit a{color:#87c6a1;text-decoration:none}.mgc-credit a:hover{text-decoration:underline}
    #marineGameOrigin{font-size:10px;color:#82aa92;margin-left:4px;text-decoration:none}
    #marineGameOrigin:hover{color:#bcebd0;text-decoration:underline}
    #marineGameOpenTab{height:40px;padding:0 13px;white-space:nowrap;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#d6e5db;font-size:12px;font-weight:650;cursor:pointer}
    #marineGameOpenTab:hover{background:rgba(255,255,255,.12);color:#fff}
    #marineFullscreenExit{position:fixed;z-index:100020;top:9px;right:10px;display:none;align-items:center;gap:8px;border-radius:10px;padding:8px 11px;background:rgba(8,24,18,.94);border:1px solid rgba(153,211,177,.28);color:#eff9f1;font:600 12px Inter,system-ui,sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.24);cursor:pointer;opacity:1;pointer-events:auto}
    #marineFullscreenExit:hover{background:#174a35}
    body.marine-app-fullscreen #osTopBar,body.marine-app-fullscreen .dock-container{display:none!important}
    body.marine-app-fullscreen .os-window.maximized{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important}
    body.marine-app-fullscreen #marineFullscreenExit{display:flex}
    body.marine-browser-fullscreen #browserWindow>.window-header,
    body.marine-browser-fullscreen #browserWindow>div:nth-child(2),
    body.marine-browser-fullscreen #browserWindow>div:nth-child(3),
    body.marine-browser-fullscreen #browserWindow>div:nth-child(4),
    body.marine-browser-fullscreen #browserWindow>div:nth-child(5){display:none!important}
    body.marine-browser-fullscreen #browserWindow{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important;background:#000!important}
    body.marine-browser-fullscreen #browserWindow>div:last-child{flex:1 1 auto!important;min-height:0!important}
    @media(max-width:1050px){.mgc-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.mgc-controls{grid-template-columns:auto minmax(120px,1fr) 125px}.mgc-select:last-child{grid-column:1/-1}}
    @media(max-width:680px){.mgc-top{padding:12px}.mgc-heading{margin-bottom:10px}.mgc-controls{grid-template-columns:1fr 1fr}.mgc-tabs{grid-column:1/-1}.mgc-search{grid-column:1/-1}.mgc-grid{grid-template-columns:repeat(2,minmax(0,1fr));padding:12px;gap:10px}.mgc-notice{margin:10px 12px 0}.mgc-credit{padding:8px 12px}}
  `;
  document.head.append(style);

  root.innerHTML = `
    <div class="mgc-shell">
      <div class="mgc-top">
        <div class="mgc-heading"><div><h2>Game Center</h2><p>Pick a collection, find a game, and open it in its own player.</p></div><a class="mgc-source" href="${SERAPH_SOURCE}" target="_blank" rel="noopener noreferrer" id="mgcSourceLink">Sources <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>
        <div class="mgc-controls">
          <div class="mgc-tabs" role="tablist" aria-label="Game collections">
            <button class="mgc-tab active" id="mgcGnTab" type="button" role="tab" aria-selected="true"><i class="fa-solid fa-calculator"></i> GN Math</button>
            <button class="mgc-tab" id="mgcSeraphTab" type="button" role="tab" aria-selected="false"><i class="fa-solid fa-wand-magic-sparkles"></i> Seraph</button>
          </div>
          <label class="mgc-search"><i class="fa-solid fa-magnifying-glass"></i><input id="mgcSearch" type="search" placeholder="Search games…" aria-label="Search games"></label>
          <select class="mgc-select" id="mgcSort" aria-label="Sort games"><option value="featured">Featured order</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option><option value="newest">Newest first</option></select>
          <select class="mgc-select" id="mgcGenre" aria-label="Filter by category"><option value="all">All categories</option></select>
        </div>
        <div class="mgc-summary" id="mgcSummary" aria-live="polite">GN Math collection</div>
      </div>
      <div class="mgc-notice" id="mgcNotice"></div>
      <div class="mgc-grid" id="mgcGrid" role="tabpanel" aria-labelledby="mgcGnTab"></div>
      <div class="mgc-credit" id="mgcCredit">Game pages open from their published source. Catalog: <a id="mgcCreditLink" href="${GN_MATH_SOURCE}" target="_blank" rel="noopener noreferrer">GN Math</a>.</div>
    </div>`;

  const grid = root.querySelector('#mgcGrid');
  const search = root.querySelector('#mgcSearch');
  const sort = root.querySelector('#mgcSort');
  const genre = root.querySelector('#mgcGenre');
  const summary = root.querySelector('#mgcSummary');
  const notice = root.querySelector('#mgcNotice');
  const gnTab = root.querySelector('#mgcGnTab');
  const seraphTab = root.querySelector('#mgcSeraphTab');

  function makeEmpty(icon, title, body, linkText, href, callback) {
    grid.replaceChildren();
    const box = document.createElement('div');
    box.className = 'mgc-empty';
    const glyph = document.createElement('i');
    glyph.className = 'fa-solid ' + icon;
    const heading = document.createElement('strong');
    heading.textContent = title;
    const copy = document.createElement('p');
    copy.textContent = body;
    box.append(glyph, heading, copy);
    if (linkText && typeof callback === 'function') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mgc-link';
      button.textContent = linkText;
      button.addEventListener('click', callback);
      box.append(button);
    } else if (linkText) {
      const link = document.createElement('a');
      link.className = 'mgc-link';
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = linkText;
      const external = document.createElement('i');
      external.className = 'fa-solid fa-arrow-up-right-from-square';
      link.append(external);
      box.append(link);
    }
    grid.append(box);
  }

  function cardFor(game) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'mgc-card';
    card.setAttribute('aria-label', 'Open ' + game.name);
    const image = document.createElement('img');
    image.className = 'mgc-cover';
    image.alt = '';
    image.loading = 'lazy';
    image.src = game.image;
    image.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'mgc-cover-fallback';
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-gamepad';
      fallback.append(icon);
      image.replaceWith(fallback);
    }, { once: true });
    const name = document.createElement('span');
    name.className = 'mgc-name';
    name.textContent = game.name;
    card.append(image, name);
    card.addEventListener('click', () => openGame(game));
    return card;
  }

  function filteredGames() {
    let games = (state.section === 'seraph' ? state.seraphGames : state.gnGames).filter(game => {
      const matchesQuery = !state.query || (game.name + ' ' + game.genre).toLowerCase().includes(state.query);
      const matchesGenre = state.section !== 'seraph' || state.genre === 'all' || game.genre === state.genre;
      return matchesQuery && matchesGenre;
    });
    if (state.sort === 'az') games.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'za') games.sort((a, b) => b.name.localeCompare(a.name));
    if (state.sort === 'newest' && state.section === 'gn-math') games.sort((a, b) => Number(b.id) - Number(a.id));
    return games;
  }

  function render() {
    const isSeraph = state.section === 'seraph';
    gnTab.classList.toggle('active', !isSeraph);
    seraphTab.classList.toggle('active', isSeraph);
    gnTab.setAttribute('aria-selected', String(!isSeraph));
    seraphTab.setAttribute('aria-selected', String(isSeraph));
    grid.setAttribute('aria-labelledby', isSeraph ? 'mgcSeraphTab' : 'mgcGnTab');
    genre.hidden = !isSeraph;
    const newestOption = sort.querySelector('option[value="newest"]');
    if (newestOption) newestOption.hidden = isSeraph;
    root.querySelector('#mgcSourceLink').href = isSeraph ? SERAPH_SOURCE : GN_MATH_SOURCE;
    const creditLink = root.querySelector('#mgcCreditLink');
    const credit = root.querySelector('#mgcCredit');
    creditLink.href = isSeraph ? SERAPH_SOURCE : GN_MATH_SOURCE;
    creditLink.textContent = isSeraph ? 'Seraph' : 'GN Math';
    credit.firstChild.textContent = 'Game pages open from their published source. Catalog: ';

    if (!isSeraph) {
      notice.textContent = 'GN Math game names and covers load from its public catalog. Games open from their published source; some games may not allow embedding.';
    } else {
      notice.textContent = 'Seraph’s catalog and covers are shown here. Games open from Seraph’s published host; some games may not allow embedding.';
    }

    const status = isSeraph ? state.seraphStatus : state.gnStatus;
    const collectionName = isSeraph ? 'Seraph' : 'GN Math';
    if (status === 'loading') {
      summary.textContent = 'Loading ' + collectionName + ' games…';
      makeEmpty('fa-spinner', 'Loading ' + collectionName, 'Fetching the game list and cover references.', '', '');
      return;
    }
    if (status === 'error') {
      summary.textContent = collectionName + ' catalog unavailable';
      makeEmpty('fa-triangle-exclamation', 'Could not load ' + collectionName, 'Check the connection to the public game catalog, then try again.', 'Retry', '', isSeraph ? loadSeraphCatalog : loadGnCatalog);
      return;
    }

    const games = filteredGames();
    summary.textContent = games.length.toLocaleString() + ' ' + collectionName + ' games' + (isSeraph && state.genre !== 'all' ? ' · ' + state.genre.replace(/-/g, ' ') : '');
    grid.replaceChildren();
    if (!games.length) {
      makeEmpty('fa-magnifying-glass', 'No games found', 'Try a shorter search or choose a different category.', 'Clear search', '#');
      const clear = grid.querySelector('a');
      clear.addEventListener('click', event => { event.preventDefault(); state.query = ''; state.genre = 'all'; search.value = ''; genre.value = 'all'; render(); });
      return;
    }
    games.forEach(game => grid.append(cardFor(game)));
  }

  function selectSection(id) {
    state.section = id;
    state.query = '';
    state.genre = 'all';
    state.sort = 'featured';
    search.value = '';
    sort.value = 'featured';
    genre.value = 'all';
    render();
  }
  gnTab.addEventListener('click', () => selectSection('gn-math'));
  seraphTab.addEventListener('click', () => selectSection('seraph'));
  search.addEventListener('input', () => { state.query = search.value.trim().toLowerCase(); render(); });
  sort.addEventListener('change', () => { state.sort = sort.value; render(); });
  genre.addEventListener('change', () => { state.genre = genre.value; render(); });

  let openTabButton = document.getElementById('marineGameOpenTab');
  if (!openTabButton) {
    openTabButton = document.createElement('button');
    openTabButton.type = 'button';
    openTabButton.id = 'marineGameOpenTab';
    openTabButton.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Open in new tab';
    document.querySelector('#gameModal .flex.items-center.gap-3')?.append(openTabButton);
  }
  let currentGame = null;
  openTabButton.disabled = true;
  openTabButton.addEventListener('click', () => {
    if (currentGame?.url) window.open(currentGame.url, '_blank', 'noopener,noreferrer');
  });

  function openGame(game) {
    let target;
    try { target = new URL(game.url); } catch (_) { return; }
    if (target.protocol !== 'https:' || (game.provider === 'seraph' && target.origin !== SERAPH_HOME)) return;
    currentGame = { ...game, url: target.href };
    window.__marineCurrentGameLaunch = { title: game.name, url: target.href, proxy: false };
    const title = document.getElementById('gameModalTitle');
    if (title) {
      title.textContent = game.name;
      let origin = document.getElementById('marineGameOrigin');
      if (!origin) {
        origin = document.createElement('a');
        origin.id = 'marineGameOrigin';
        origin.target = '_blank';
        origin.rel = 'noopener noreferrer';
        origin.setAttribute('aria-label', 'Open the game directly at its published source');
        title.after(origin);
      }
      origin.textContent = ' · ' + target.hostname;
      origin.href = target.href;
      origin.title = 'Open the direct game address: ' + target.href;
      openTabButton.disabled = false;
      openTabButton.title = 'Open directly at ' + target.hostname;
    }
    window.launchGame(game.name, target.href, false);
  }

  function expandGnPath(value) {
    return safeText(value)
      .replace(/\{COVER_URL\}/g, GN_MATH_COVERS)
      .replace(/\{HTML_URL\}/g, GN_MATH_HTML);
  }

  function normalizeGnGame(row) {
    if (!row || row.id === -1 || !safeText(row.name) || !safeText(row.url) || row.url === 'local') return null;
    try {
      const url = new URL(expandGnPath(row.url), GN_MATH_SITE);
      if (url.protocol !== 'https:') return null;
      const image = new URL(expandGnPath(row.cover || ''), GN_MATH_COVERS + '/');
      if (image.protocol !== 'https:') return null;
      return {
        id: String(row.id),
        name: safeText(row.name),
        genre: safeText(row.genre || row.category),
        image: image.href,
        url: url.href,
        provider: 'gn-math'
      };
    } catch (_) { return null; }
  }

  async function loadGnCatalog() {
    state.gnStatus = 'loading';
    render();
    try {
      let rows = null;
      let lastError = null;
      for (const catalogUrl of GN_MATH_ZONES) {
        try {
          const response = await fetch(catalogUrl + '?t=' + Date.now(), { cache: 'no-store' });
          if (!response.ok) throw new Error('Catalog request failed');
          const result = await response.json();
          if (!Array.isArray(result)) throw new Error('Catalog format is invalid');
          rows = result;
          break;
        } catch (error) { lastError = error; }
      }
      if (!rows) throw lastError || new Error('GN Math catalog could not be reached');
      state.gnGames = rows.map(normalizeGnGame).filter(Boolean);
      if (!state.gnGames.length) throw new Error('GN Math catalog contains no playable entries');
      state.gnStatus = 'ready';
    } catch (_) {
      state.gnGames = [];
      state.gnStatus = 'error';
    }
    render();
  }

  async function loadSeraphCatalog() {
    state.seraphStatus = 'loading';
    render();
    try {
      const response = await fetch('/seraph-games.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Catalog request failed');
      const rows = await response.json();
      state.seraphGames = Array.isArray(rows) ? rows.map(row => {
        if (!row || !safeText(row.name) || !safeText(row.id)) return false;
        try {
          const url = new URL(row.url, SERAPH_HOME);
          const image = new URL(row.image);
          if (url.origin !== SERAPH_HOME || !image.href.startsWith(SERAPH_IMAGE_PREFIX)) return false;
          return { ...row, url: url.href, image: image.href, provider: 'seraph' };
        } catch (_) { return false; }
      }) : [];
      state.seraphGames = state.seraphGames.filter(Boolean);
      if (!state.seraphGames.length) throw new Error('Seraph catalog contains no playable entries');
      const genres = [...new Set(state.seraphGames.map(game => safeText(game.genre)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      genre.replaceChildren(new Option('All categories', 'all'));
      genres.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
        genre.append(option);
      });
      state.seraphStatus = 'ready';
    } catch (_) {
      state.seraphGames = [];
      state.seraphStatus = 'error';
    }
    render();
  }

  async function loadCatalog() {
    await Promise.all([loadGnCatalog(), loadSeraphCatalog()]);
  }

  const exitFullscreen = document.createElement('button');
  exitFullscreen.type = 'button';
  exitFullscreen.id = 'marineFullscreenExit';
  exitFullscreen.title = 'Restore window (Esc)';
  exitFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i> Restore window';
  exitFullscreen.addEventListener('click', () => {
    const full = document.querySelector('.os-window.maximized:not(.hidden),.os-window[data-marine-snap="max"]:not(.hidden)');
    if (full && typeof window.toggleMaximize === 'function') window.toggleMaximize(full.id);
  });
  document.body.append(exitFullscreen);

  function refreshFullscreen() {
    const current = typeof active === 'string' ? document.getElementById(active) : null;
    const isFullscreen = !!current && !current.classList.contains('hidden') && (current.classList.contains('maximized') || current.dataset.marineSnap === 'max');
    document.body.classList.toggle('marine-app-fullscreen', isFullscreen);
    document.body.classList.toggle('marine-browser-fullscreen', isFullscreen && current.id === 'browserWindow');
    exitFullscreen.hidden = !isFullscreen;
    exitFullscreen.style.opacity = isFullscreen ? '1' : '0';
    exitFullscreen.style.pointerEvents = isFullscreen ? 'auto' : 'none';
  }
  const windowObserver = new MutationObserver(refreshFullscreen);
  windowObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class', 'data-marine-snap'] });
  if (typeof setActive === 'function' && !window.__marineFullscreenActiveHook) {
    const setActiveBeforeFullscreen = setActive;
    setActive = function(id) {
      const result = setActiveBeforeFullscreen.apply(this, arguments);
      requestAnimationFrame(refreshFullscreen);
      return result;
    };
    window.__marineFullscreenActiveHook = true;
  }
  window.addEventListener('resize', refreshFullscreen);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !document.body.classList.contains('marine-app-fullscreen')) return;
    const current = typeof active === 'string' ? document.getElementById(active) : null;
    if (!current || typeof window.toggleMaximize !== 'function') return;
    event.preventDefault();
    window.toggleMaximize(current.id);
  });
  document.addEventListener('fullscreenchange', () => {
    const button = document.getElementById('fullscreenBtn');
    if (button) button.innerHTML = document.fullscreenElement ? '<i class="fa-solid fa-compress"></i> Exit fullscreen' : '<i class="fa-solid fa-expand"></i> Fullscreen';
  });
  const fullscreenButton = document.getElementById('fullscreenBtn');
  if (fullscreenButton) fullscreenButton.onclick = () => {
    const wrapper = document.getElementById('iframeWrapper');
    if (!wrapper) return;
    if (!document.fullscreenElement && wrapper.requestFullscreen) wrapper.requestFullscreen().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen?.();
  };

  refreshFullscreen();
  render();
  loadCatalog();
})();
