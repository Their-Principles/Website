// Recent Moments — editorial photo wall of real Their Principles events.
//
// Desktop: two staggered rows drifting slowly left→right on a seamless loop.
// Mobile / reduced-motion: a single horizontal swipe row with native momentum
// scrolling. No external libraries.
//
// ── HOW TO ADD PHOTOS ──────────────────────────────────────────────────────
// Add an entry to PHOTOS below. `w`/`h` are the file's real pixel dimensions
// (they set the tile's aspect ratio and reserve space so nothing shifts while
// images load). Use only real Their Principles photography, and only a caption
// that names the event the photo actually came from.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  var root = document.getElementById('tpGallery');
  if (!root) return;

  // All photographs below are from the padel event on 1 August 2026 at Epic
  // Athletic Club (listed on Luma as "July Pass").
  // TODO(client): supply photography for Game Night with BS Miami, The War for
  // Your Attention with Andrés Preschel, This Summer We Create, and the
  // Mentorship Experience with Moshe Mana — then add them here with their own
  // captions so the archive covers every event, not only padel.
  var PHOTOS = [
    { src: 'assets/images/padel/doubles-rally.jpg',            w: 1200, h: 800,  caption: 'Padel Experience', alt: 'Members playing a doubles point on the court at Epic Athletic Club' },
    { src: 'assets/images/padel/group-courtside.jpg',          w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Three members talking courtside between games' },
    { src: 'assets/images/padel/court-exchange.jpg',           w: 1200, h: 800,  caption: 'Padel Experience', alt: 'An exchange mid-rally across the net' },
    { src: 'assets/images/padel/player-serving.jpg',           w: 900,  h: 1200, caption: 'Padel Experience', alt: 'A member serving at the start of a point' },
    { src: 'assets/images/padel/three-players-talking.jpg',    w: 1200, h: 800,  caption: 'Padel Experience', alt: 'Three members in conversation beside the courts' },
    { src: 'assets/images/padel/players-between-games.jpg',    w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Members standing together between matches' },
    { src: 'assets/images/padel/mixed-doubles.jpg',            w: 1200, h: 800,  caption: 'Padel Experience', alt: 'A mixed doubles point in play' },
    { src: 'assets/images/padel/courtside-conversation.jpg',   w: 675,  h: 1200, caption: 'Padel Experience', alt: 'Members gathered at the courtside tables' },
    { src: 'assets/images/padel/rally-in-play.jpg',            w: 1200, h: 800,  caption: 'Padel Experience', alt: 'A long rally in play on the blue court' },

    { src: 'assets/images/padel/group-talking.jpg',            w: 900,  h: 1200, caption: 'Padel Experience', alt: 'A group of members talking after their match' },
    { src: 'assets/images/padel/baseline-return.jpg',          w: 1200, h: 800,  caption: 'Padel Experience', alt: 'A return played from the baseline' },
    { src: 'assets/images/padel/courtside-lounge.jpg',         w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Members resting and talking at the courtside lounge' },
    { src: 'assets/images/padel/players-mid-point.jpg',        w: 1200, h: 800,  caption: 'Padel Experience', alt: 'Wide view of the club with a point underway' },
    { src: 'assets/images/padel/three-players-portrait.jpg',   w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Three members photographed together on court' },
    { src: 'assets/images/padel/courtside-table.jpg',          w: 1200, h: 800,  caption: 'Padel Experience', alt: 'Members in conversation around a courtside table' },
    { src: 'assets/images/padel/player-at-baseline.jpg',       w: 900,  h: 1200, caption: 'Padel Experience', alt: 'A member waiting to receive at the baseline' },
    { src: 'assets/images/padel/pair-in-conversation.jpg',     w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Two members talking beside the court' },
    { src: 'assets/images/padel/players-leaving-court.jpg',    w: 900,  h: 1200, caption: 'Padel Experience', alt: 'Members walking off the court after a match' }
  ];

  var ROW_HEIGHT = 330;         // desktop tile height; widths follow each photo's aspect
  var ROW_HEIGHT_NARROW = 290;  // mobile: keeps roughly 1.2–1.4 tiles in view
  var GAP = 8;
  var LOOP_SECONDS = 60;  // one full pass of the strip
  var HOVER_FACTOR = 0.25;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isNarrow = window.matchMedia('(max-width: 860px)');

  var rows = [];          // { el, offset, half, speed, direction }
  var rafId = null;
  var lastTime = null;
  var speedFactor = 1;
  var dragging = false;
  var mode = null;

  build();
  window.addEventListener('resize', debounce(build, 200));
  prefersReducedMotion.addEventListener('change', build);

  function build() {
    var nextMode = (isNarrow.matches || prefersReducedMotion.matches) ? 'scroll' : 'marquee';
    if (nextMode === mode && mode === 'marquee') { measure(); return; }
    mode = nextMode;

    stop();
    rows = [];
    root.textContent = '';
    root.classList.toggle('is-scroll', mode === 'scroll');

    if (mode === 'scroll') {
      // Single swipe row, native momentum scrolling, every photo present.
      var row = document.createElement('div');
      row.className = 'tp-gallery-row';
      PHOTOS.forEach(function (p) { row.appendChild(makeTile(p)); });
      root.appendChild(row);
      return;
    }

    // Two staggered rows. PHOTOS alternates landscape/portrait, so splitting it
    // into contiguous halves gives each row a mix of widths (taking every other
    // photo would put all the landscapes in one row and all the portraits in
    // the other).
    var midpoint = Math.ceil(PHOTOS.length / 2);
    [0, 1].forEach(function (index) {
      var set = index === 0 ? PHOTOS.slice(0, midpoint) : PHOTOS.slice(midpoint);
      var el = document.createElement('div');
      el.className = 'tp-gallery-row';
      // Duplicated once so the loop can wrap with no visible seam.
      set.concat(set).forEach(function (p, i) {
        var tile = makeTile(p);
        if (i >= set.length) tile.setAttribute('aria-hidden', 'true');
        el.appendChild(tile);
      });
      root.appendChild(el);
      rows.push({ el: el, offset: 0, half: 0, speed: 0 });
    });

    measure();
    if (!prefersReducedMotion.matches) start();
    bindMarqueeEvents();
  }

  function makeTile(photo) {
    var height = mode === 'scroll' ? ROW_HEIGHT_NARROW : ROW_HEIGHT;
    var tile = document.createElement('figure');
    tile.className = 'tp-gallery-item';
    // Reserve the exact box before the image loads so nothing reflows.
    tile.style.height = height + 'px';
    tile.style.width = Math.round(height * (photo.w / photo.h)) + 'px';

    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt || '';
    img.width = photo.w;
    img.height = photo.h;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    // If a file is missing, keep the branded dark tile + caption rather than
    // showing a broken-image icon.
    img.addEventListener('error', function () {
      tile.classList.add('is-missing');
      img.remove();
    });
    tile.appendChild(img);

    if (photo.caption) {
      var cap = document.createElement('figcaption');
      cap.className = 'tp-gallery-caption';
      cap.textContent = photo.caption;
      tile.appendChild(cap);
    }
    return tile;
  }

  function measure() {
    rows.forEach(function (row) {
      var half = (row.el.scrollWidth - GAP) / 2;
      if (half > 0) {
        row.half = half;
        // Second row drifts slightly slower so the two never lock in step.
        row.speed = (half / LOOP_SECONDS) * (rows.indexOf(row) === 1 ? 0.82 : 1);
      }
    });
    // Offset the lower row so the rows read as staggered, not as a grid.
    if (rows[1] && rows[1].half && rows[1].offset === 0) rows[1].offset = rows[1].half * 0.5;
    apply();
  }

  function bindMarqueeEvents() {
    root.addEventListener('mouseenter', function () { speedFactor = HOVER_FACTOR; });
    root.addEventListener('mouseleave', function () { speedFactor = 1; });

    var startX = 0, startOffsets = [];
    root.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      startOffsets = rows.map(function (r) { return r.offset; });
      root.classList.add('is-dragging');
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      rows.forEach(function (r, i) { r.offset = startOffsets[i] - dx; });
      wrap(); apply();
    });
    ['pointerup', 'pointercancel'].forEach(function (evt) {
      root.addEventListener(evt, function () {
        dragging = false;
        root.classList.remove('is-dragging');
      });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!prefersReducedMotion.matches && mode === 'marquee') start();
    });

    var prev = document.getElementById('tpGalleryPrev');
    var next = document.getElementById('tpGalleryNext');
    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });
  }

  function nudge(direction) {
    if (mode !== 'marquee') return;
    var step = Math.min(root.clientWidth * 0.6, 480) * direction;
    var from = rows.map(function (r) { return r.offset; });
    var startTime = null;
    (function frame(now) {
      if (startTime === null) startTime = now;
      var t = Math.min((now - startTime) / 520, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      rows.forEach(function (r, i) { r.offset = from[i] + step * eased; });
      wrap(); apply();
      if (t < 1) requestAnimationFrame(frame);
    })(performance.now());
  }

  function wrap() {
    rows.forEach(function (r) {
      if (r.half <= 0) return;
      r.offset = ((r.offset % r.half) + r.half) % r.half;
    });
  }

  function apply() {
    // Positive translate on a track that starts shifted one loop-length left
    // makes the photographs travel left → right without ever showing an end.
    rows.forEach(function (r) {
      r.el.style.transform = 'translate3d(' + (r.offset - r.half) + 'px, 0, 0)';
    });
  }

  function tick(now) {
    if (lastTime !== null && !dragging) {
      var dt = Math.min((now - lastTime) / 1000, 0.1); // clamp after a throttled tab
      rows.forEach(function (r) { r.offset += r.speed * speedFactor * dt; });
      wrap();
      apply();
    }
    lastTime = now;
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId) return;
    lastTime = null;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
