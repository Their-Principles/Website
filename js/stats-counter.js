// Animated count-up for the stats band. Triggers once, the first time the
// band scrolls into view. Respects prefers-reduced-motion.
(function () {
  var stats = document.querySelectorAll('[data-count-target]');
  if (!stats.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION_MS = 1200;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    stats.forEach(setFinalValue);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  stats.forEach(function (el) { observer.observe(el); });

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10) || 0;
    var suffix = el.getAttribute('data-count-suffix') || '';
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / DURATION_MS, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function setFinalValue(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10) || 0;
    var suffix = el.getAttribute('data-count-suffix') || '';
    el.textContent = target + suffix;
  }
})();
