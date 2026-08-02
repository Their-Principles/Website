// Recent Moments — continuous editorial photo strip (Soho House-inspired).
// Slow seamless translate3d loop, pause/slow on hover, draggable, arrow
// controls, touch-friendly, respects prefers-reduced-motion, pauses when
// the tab is inactive. No external libraries.
//
// Content: real Their Principles events only. No real photography has been
// supplied yet, so each item renders as a toned placeholder tile with the
// real event caption. TODO(client): drop photos into
// assets/images/events/<event>/ and set the `image` fields below.
(function () {
  var root = document.getElementById('tpMarquee');
  if (!root) return;

  var track = root.querySelector('.tp-marquee-track');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real events from Luma. Sizes cycle for the editorial mixed-width collage.
  var items = [
    { caption: 'July Pass',                                    image: '', size: 'wide' },     // TODO(client): assets/images/events/july-pass/
    { caption: 'Game Night with BS Miami',                     image: '', size: 'narrow' },   // TODO(client): assets/images/events/game-night/
    { caption: 'The War for Your Attention',                   image: '', size: 'standard' }, // TODO(client): assets/images/events/attention-talk/
    { caption: 'This Summer, We Create',                       image: '', size: 'wide' },     // TODO(client): assets/images/events/summer-create/
    { caption: 'Padel Experience',                             image: '', size: 'standard' }, // TODO(client): assets/images/events/padel/
    { caption: 'Mentorship Experience with Moshe Mana',        image: '', size: 'narrow' }    // TODO(client): assets/images/events/mentorship/
  ];

  var SPEED_PX_PER_S = 28;      // slow, editorial glide
  var HOVER_SPEED_FACTOR = 0.3; // slows (not stops) on hover

  var offset = 0;
  var halfWidth = 0;
  var speedFactor = 1;
  var dragging = false;
  var dragStartX = 0;
  var dragStartOffset = 0;
  var lastTime = null;
  var rafId = null;

  build();

  function build() {
    // Two copies of the set make the loop seamless: when the first copy has
    // fully scrolled past, the offset wraps back by exactly half the track.
    for (var copy = 0; copy < 2; copy++) {
      items.forEach(function (item, i) {
        var el = document.createElement('div');
        el.className = 'tp-marquee-item is-' + (item.size || 'standard');
        el.setAttribute('role', 'group');
        el.setAttribute('aria-label', item.caption);
        if (copy === 1) el.setAttribute('aria-hidden', 'true');

        if (item.image) {
          var img = document.createElement('img');
          img.src = item.image;
          img.alt = item.caption;
          img.loading = 'lazy';
          img.draggable = false;
          el.appendChild(img);
        }
        var caption = document.createElement('div');
        caption.className = 'tp-marquee-caption';
        caption.textContent = item.caption;
        el.appendChild(caption);
        track.appendChild(el);
      });
    }

    requestAnimationFrame(function () {
      halfWidth = track.scrollWidth / 2;
      if (!prefersReducedMotion) start();
    });

    root.addEventListener('mouseenter', function () { speedFactor = HOVER_SPEED_FACTOR; });
    root.addEventListener('mouseleave', function () { speedFactor = 1; });

    // Manual drag (mouse + touch via pointer events)
    root.addEventListener('pointerdown', function (e) {
      dragging = true;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      root.classList.add('is-dragging');
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      offset = dragStartOffset - (e.clientX - dragStartX);
      wrap();
      apply();
    });
    ['pointerup', 'pointercancel'].forEach(function (evt) {
      root.addEventListener(evt, function () {
        dragging = false;
        root.classList.remove('is-dragging');
      });
    });

    // Arrow controls nudge by one viewport-ish step
    var prev = document.getElementById('tpMarqueePrev');
    var next = document.getElementById('tpMarqueeNext');
    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });

    // Pause when the tab is inactive
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!prefersReducedMotion) start();
    });

    window.addEventListener('resize', function () {
      halfWidth = track.scrollWidth / 2;
    }, { passive: true });
  }

  function nudge(direction) {
    var step = Math.min(root.clientWidth * 0.6, 420) * direction;
    var startOffset = offset;
    var startTime = null;
    var DURATION = 500;
    function stepFrame(now) {
      if (startTime === null) startTime = now;
      var t = Math.min((now - startTime) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      offset = startOffset + step * eased;
      wrap();
      apply();
      if (t < 1) requestAnimationFrame(stepFrame);
    }
    requestAnimationFrame(stepFrame);
  }

  function wrap() {
    if (halfWidth <= 0) return;
    if (offset >= halfWidth) offset -= halfWidth;
    if (offset < 0) offset += halfWidth;
  }

  function apply() {
    track.style.transform = 'translate3d(' + -offset + 'px, 0, 0)';
  }

  function tick(now) {
    if (lastTime !== null && !dragging) {
      var dt = (now - lastTime) / 1000;
      offset += SPEED_PX_PER_S * speedFactor * dt;
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
})();
