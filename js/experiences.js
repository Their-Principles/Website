// Experiences + directory panels: hover/focus reveals are pure CSS on
// desktop. On touch devices there is no hover, so rows/panels get
// .is-active when they cross the middle of the viewport — mobile users
// never see blank dark rows.
(function () {
  // Apply each reveal layer's data-image as its background. Rows/panels with
  // no image yet keep a quiet tonal treatment instead of a broken image.
  document.querySelectorAll('.tp-exp-bg, .tp-panel-bg').forEach(function (bg) {
    var src = bg.getAttribute('data-image');
    if (src) {
      bg.style.backgroundImage = 'url("' + src + '")';
    } else {
      bg.style.backgroundImage =
        'linear-gradient(150deg, rgba(168,137,78,0.14) 0%, rgba(40,15,9,0.4) 60%, rgba(21,31,12,0.5) 100%)';
    }
  });

  var targets = document.querySelectorAll('.tp-exp-row, .tp-panel');
  if (!targets.length) return;

  var isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
  }, {
    // A band around the vertical middle of the viewport
    rootMargin: '-35% 0px -35% 0px',
    threshold: 0
  });

  targets.forEach(function (el) { observer.observe(el); });
})();
