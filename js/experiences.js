// Experience rows: the photograph behind each row is revealed by CSS on
// hover/focus. Touch devices have no hover, so a row gets .is-active while it
// sits in the middle of the viewport — mobile users never see blank dark rows.
//
// The four directory panels are handled entirely in CSS (see the
// "DIRECTORY PANEL IMAGERY" block in css/components.css); on mobile their
// photographs are simply shown by default.
(function () {
  // Apply each experience row's data-image. Rows with no photograph yet keep a
  // quiet tonal wash rather than a broken image.
  document.querySelectorAll('.tp-exp-bg').forEach(function (bg) {
    var src = bg.getAttribute('data-image');
    if (src) {
      bg.style.backgroundImage = 'url("' + src + '")';
    } else {
      bg.style.backgroundImage =
        'linear-gradient(150deg, rgba(240,239,234,0.14) 0%, rgba(40,15,9,0.4) 60%, rgba(40,15,9,0.5) 100%)';
    }
  });

  var rows = document.querySelectorAll('.tp-exp-row');
  if (!rows.length) return;
  if (!window.matchMedia('(hover: none)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
  }, {
    rootMargin: '-35% 0px -35% 0px', // a band around the vertical middle
    threshold: 0
  });

  rows.forEach(function (row) { observer.observe(row); });
})();
