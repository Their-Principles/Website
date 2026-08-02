// Nav: solid background once the hero is scrolled past + mobile menu toggle
(function () {
  var nav = document.getElementById('tpNav');
  if (!nav) return;

  // Pages with no dark hero behind the nav (e.g. Mentors) set this attribute
  // so the nav stays solid from the start instead of starting transparent-
  // over-nothing, which would make the cream nav text unreadable on the
  // cream page background.
  var forceSolid = nav.hasAttribute('data-force-solid');

  function updateSolidState() {
    if (forceSolid || window.scrollY > 60) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }
  updateSolidState();
  window.addEventListener('scroll', updateSolidState, { passive: true });

  var toggle = document.getElementById('tpNavToggle');
  var overlay = document.getElementById('tpNavOverlay');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', function () {
    var isOpen = overlay.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Close' : 'Menu';
  });

  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  });
})();
