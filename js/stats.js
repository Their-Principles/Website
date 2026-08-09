// Community stats band — the single editable source of truth for the numbers
// shown under the hero. Edit the values here; nothing is hard-coded in the HTML.
//
// (Renamed from js/events.js when this became stats-only.)

var communityStats = {
  members: 74,        // TODO(client): keep current — update here only
  eventsHosted: 4,
  established: 2026
};

(function () {
  var statsRoot = document.getElementById('tpStats');
  if (!statsRoot) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defs = [
    { value: communityStats.members, suffix: '+', label: 'Members' },
    { value: communityStats.eventsHosted, suffix: '+', label: 'Experiences Hosted' },
    { value: communityStats.established, suffix: '', label: 'Established in Miami', static: true }
  ];

  defs.forEach(function (def) {
    var cell = document.createElement('div');
    var num = document.createElement('div');
    num.className = 'tp-stat-num';
    num.textContent = def.static || prefersReducedMotion ? def.value + def.suffix : '0';
    var label = document.createElement('div');
    label.className = 'tp-stat-label';
    label.textContent = def.label;
    cell.appendChild(num);
    cell.appendChild(label);
    statsRoot.appendChild(cell);
    def.el = num;
  });

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        defs.filter(function (d) { return !d.static; }).forEach(animateCount);
      });
    }, { threshold: 0.5 });
    observer.observe(statsRoot);
  }

  function animateCount(def) {
    var start = performance.now();
    var DURATION = 1200;
    function frame(now) {
      var t = Math.min((now - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      def.el.textContent = Math.round(def.value * eased) + (t === 1 ? def.suffix : '');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
