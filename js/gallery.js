// Recent Moments — one continuous carousel of real Their Principles photography.
//
// It drifts slowly left→right on its own, loops seamlessly, and stays fully
// hand-controllable at any moment: trackpad, touch swipe, mouse drag, or the
// ‹ › arrows. The drift is built on the element's own scroll position rather
// than a CSS transform, which is what lets native swiping keep working.
//
// ── HOW TO ADD PHOTOS ──────────────────────────────────────────────────────
// Add an entry to PHOTOS below. `w`/`h` are the file's real pixel dimensions:
// each tile's width is derived from them so every photo keeps its exact
// proportions and is never cropped or stretched.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  var root = document.getElementById('tpGallery');
  if (!root) return;

  // All photographs below are from the padel event on 1 August 2026 at Epic
  // Athletic Club (listed on Luma as "July Pass").
  // TODO(client): supply photography for Game Night with BS Miami, The War for
  // Your Attention with Andrés Preschel, This Summer We Create, and the
  // Mentorship Experience with Moshe Mana.
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

  // Heights only — each tile's WIDTH is derived from the photo's own w/h, so
  // shrinking these scales the whole photo proportionally and never crops it.
  var ROW_HEIGHT = 250;         // desktop
  var ROW_HEIGHT_NARROW = 190;  // phones
  var SPEED = 40;               // px per second — a slow, readable drift
  var HOVER_SPEED = 0;          // pause while the pointer is over the strip
  var ARROW_MS = 520;

  var isNarrow = window.matchMedia('(max-width: 860px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var pos = 0;          // our own float scroll position (scrollLeft is integer-ish)
  var lastApplied = 0;  // what we last wrote, so we can spot user-driven scrolling
  var setWidth = 0;     // width of ONE copy of the photo set — the loop length
  var speedFactor = 1;
  var dragging = false;
  var tween = null;
  var rafId = null;
  var lastTime = null;
  var currentHeight = null;

  build();
  window.addEventListener('resize', debounce(function () {
    if (tileHeight() !== currentHeight) build(); else measure();
  }, 200));

  function tileHeight() { return isNarrow.matches ? ROW_HEIGHT_NARROW : ROW_HEIGHT; }

  function build() {
    stop();
    currentHeight = tileHeight();
    root.textContent = '';

    var row = document.createElement('div');
    row.className = 'tp-gallery-row';
    // Two consecutive copies: once the first copy has scrolled past, we jump
    // back by exactly one copy's width — identical pixels, so no visible seam.
    PHOTOS.concat(PHOTOS).forEach(function (p, i) {
      var tile = makeTile(p, currentHeight);
      if (i >= PHOTOS.length) tile.setAttribute('aria-hidden', 'true');
      row.appendChild(tile);
    });
    root.appendChild(row);

    measure();
    bindOnce();
    if (!reduceMotion.matches) start();
  }

  function measure() {
    var tiles = root.querySelectorAll('.tp-gallery-item');
    if (tiles.length >= PHOTOS.length + 1) {
      // Distance from the first tile to the start of the second copy.
      setWidth = tiles[PHOTOS.length].offsetLeft - tiles[0].offsetLeft;
    }
  }

  function makeTile(photo, height) {
    var tile = document.createElement('figure');
    tile.className = 'tp-gallery-item';
    // Width derived from the photo's own proportions, so the box always
    // matches the image exactly — nothing is cropped or stretched.
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

  var bound = false;
  function bindOnce() {
    if (bound) return;
    bound = true;

    root.addEventListener('mouseenter', function () { speedFactor = HOVER_SPEED; });
    root.addEventListener('mouseleave', function () { speedFactor = 1; });

    // Mouse drag. Touch and trackpad already scroll natively.
    var startX = 0, startPos = 0, moved = 0;
    root.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragging = true; tween = null; moved = 0;
      startX = e.clientX; startPos = pos;
      root.classList.add('is-dragging');
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      pos = startPos - dx;
      wrap(); apply();
      if (moved > 3) e.preventDefault();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (evt) {
      root.addEventListener(evt, function () {
        dragging = false;
        root.classList.remove('is-dragging');
      });
    });
    root.addEventListener('click', function (e) {
      if (moved > 3) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    var prev = document.getElementById('tpGalleryPrev');
    var next = document.getElementById('tpGalleryNext');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!reduceMotion.matches) start();
    });
  }

  // Arrows advance to the neighbouring photograph, animated by hand so the
  // drift and the jump never fight each other.
  function step(direction) {
    var tiles = [].slice.call(root.querySelectorAll('.tp-gallery-item'));
    if (!tiles.length || !setWidth) return;
    var origin = tiles[0].offsetLeft;
    var stops = tiles.map(function (t) { return t.offsetLeft - origin; });

    var target;
    if (direction > 0) {
      target = stops.find(function (s) { return s > pos + 1; });
      if (target === undefined) target = pos + setWidth / PHOTOS.length;
    } else {
      var earlier = stops.filter(function (s) { return s < pos - 1; });
      target = earlier.length ? earlier[earlier.length - 1] : pos - setWidth / PHOTOS.length;
    }
    tween = { from: pos, to: target, start: performance.now(),
              ms: reduceMotion.matches ? 0 : ARROW_MS };
  }

  function wrap() {
    if (setWidth <= 0) return;
    while (pos >= setWidth) pos -= setWidth;
    while (pos < 0) pos += setWidth;
  }

  function apply() {
    root.scrollLeft = pos;
    lastApplied = root.scrollLeft;
  }

  function tick(now) {
    if (lastTime !== null) {
      var dt = Math.min((now - lastTime) / 1000, 0.1); // clamp after a throttled tab

      // If scrollLeft moved without us (trackpad / touch swipe), adopt it.
      if (!dragging && Math.abs(root.scrollLeft - lastApplied) > 1) {
        pos = root.scrollLeft;
        tween = null;
      }

      if (tween) {
        var t = tween.ms ? Math.min((now - tween.start) / tween.ms, 1) : 1;
        var eased = 1 - Math.pow(1 - t, 3);
        pos = tween.from + (tween.to - tween.from) * eased;
        if (t >= 1) tween = null;
      } else if (!dragging) {
        pos += SPEED * speedFactor * dt;
      }

      wrap();
      apply();
    }
    lastTime = now;
    rafId = requestAnimationFrame(tick);
  }

  function start() { if (rafId) return; lastTime = null; rafId = requestAnimationFrame(tick); }
  function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
