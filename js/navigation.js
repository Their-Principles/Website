// Navigation: scroll-aware hide/reveal header, fullscreen mobile menu,
// and subtle page transitions between the real HTML pages.
(function () {
  var nav = document.getElementById('tpNav');
  if (!nav) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Solid background: transparent over a dark hero, solid otherwise.
     Pages without a dark hero set data-force-solid on the nav. ----- */
  var forceSolid = nav.hasAttribute('data-force-solid');
  function updateSolid() {
    if (forceSolid || window.scrollY > 60) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }

  /* ----- Soho House-style reveal behavior:
     visible while actively scrolling, hides ~1000ms after scrolling stops
     (unless at the very top or the pointer is near the top edge). ----- */
  var hideTimer = null;
  var pointerNearTop = false;
  var menuOpen = false;
  var HIDE_DELAY_MS = 1000;

  function show() { nav.classList.remove('is-hidden'); }
  function hide() {
    if (window.scrollY <= 60 || pointerNearTop || menuOpen) return;
    nav.classList.add('is-hidden');
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  }

  window.addEventListener('scroll', function () {
    updateSolid();
    show();
    scheduleHide();
  }, { passive: true });

  document.addEventListener('mousemove', function (e) {
    pointerNearTop = e.clientY < 80;
    if (pointerNearTop) show();
    else scheduleHide();
  }, { passive: true });

  // Keep it visible when keyboard focus is inside the nav
  nav.addEventListener('focusin', function () { clearTimeout(hideTimer); show(); });
  nav.addEventListener('focusout', scheduleHide);

  updateSolid();
  scheduleHide();

  /* ----- Mobile fullscreen menu ----- */
  var toggle = document.getElementById('tpNavToggle');
  var overlay = document.getElementById('tpNavOverlay');
  if (toggle && overlay) {
    function setMenu(open) {
      menuOpen = open;
      overlay.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      if (open) show();
    }
    toggle.addEventListener('click', function () { setMenu(!menuOpen); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); }
    });
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ----- Page transitions: fade out before navigating to another page on
     this site. Anchors, downloads, external links and modified clicks are
     left alone; back/forward keeps working because we never touch history. ----- */
  if (!prefersReducedMotion) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        link.target === '_blank' ||
        href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') ||
        href.indexOf('#') !== -1 && href.split('#')[0] === location.pathname.split('/').pop()
      ) return;
      if (!href.endsWith('.html') && href !== '/') return;

      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(function () { location.href = href; }, 280);
    });

    // Restore visibility when a page is resurrected from the bfcache
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('page-exit');
    });
  }

  /* ----- Section entrance: fade-up elements marked .tp-reveal ----- */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.tp-reveal').forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.tp-reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
})();
