// Events + community stats — the single editable source of truth.
// The calendar and the stat band are rendered from the data below; nothing
// event- or stat-related is hard-coded in the HTML.
//
// ── HOW TO UPDATE ──────────────────────────────────────────────────────────
// Add/edit entries in `events`. Dates are YYYY-MM-DD. Leave `url` empty until
// the event's real Luma registration link is available. Anything unknown
// stays an empty string — never invent details.
// ───────────────────────────────────────────────────────────────────────────

// Verified against the Luma screenshots supplied on 2026-08-02.
var events = [
  {
    title: 'July Pass',
    date: '2026-08-01',
    time: '12:00 PM',
    location: 'Epic Pickleball & Padel Athletic Club',
    image: '',                       // TODO(client): assets/images/events/july-pass/
    url: '',                          // TODO(client): Luma registration URL
    status: '',
    category: 'Padel'
  },
  {
    title: 'July Pass',
    date: '2026-07-23',
    time: '7:00 PM',
    location: '21 SE 1st Ave #10',
    image: '',
    url: '',
    status: '',
    category: 'Padel'
  },
  {
    title: 'Game Night with BS Miami',
    date: '2026-07-09',
    time: '8:00 PM',
    location: 'Pamplemousse On The Bay',
    image: '',                       // TODO(client): assets/images/events/game-night/
    url: '',
    status: '',
    category: 'Game Night'
  },
  {
    title: 'the war for your attention with Andrés Preschel',
    date: '2026-06-11',
    time: '7:00 PM',
    location: 'Miami Beach, FL',
    image: '',                       // TODO(client): assets/images/events/attention-talk/
    url: '',
    status: '',
    category: 'Conversation'
  },
  {
    title: 'this summer, we create.',
    date: '2026-05-28',
    time: '7:00 PM',
    location: 'Northeast Coconut Grove',
    image: '',                       // TODO(client): assets/images/events/summer-create/
    url: '',
    status: '',
    category: 'Creative'
  }
  // TODO(client): Mentorship Experience with Moshe Mana — date, time and
  // location were not in the supplied Luma screenshots. Add the entry here
  // once those details are confirmed; do not guess them.
];

var communityStats = {
  members: 74,        // TODO(client): keep current — update here only
  eventsHosted: 4,
  established: 2026
};

// ── LUMA INTEGRATION (future) ──────────────────────────────────────────────
// When a Luma data source is approved, implement this adapter to return an
// array shaped exactly like `events` above, then swap it in inside init().
// There is currently NO configured Luma endpoint — this is a placeholder,
// not a working integration.
async function fetchLumaEvents() {
  // TODO: connect official Luma source or approved backend endpoint.
  // Map Luma's response into: { title, date, time, location, image, url, status, category }
  throw new Error('Luma integration not configured');
}
// ───────────────────────────────────────────────────────────────────────────

(function () {
  var list = document.getElementById('tpCalList');
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---- Calendar ---- */
  if (list) {
    var filterButtons = document.querySelectorAll('.tp-cal-filter');
    var currentFilter = pickDefaultFilter();

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.getAttribute('data-filter');
        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        render();
      });
    });
    filterButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === currentFilter));
    });
    render();
  }

  function pickDefaultFilter() {
    // Default to Upcoming when anything is upcoming, otherwise show Past
    return splitEvents().upcoming.length ? 'upcoming' : 'past';
  }

  function splitEvents() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var upcoming = [], past = [];
    events.forEach(function (ev) {
      (new Date(ev.date + 'T00:00:00') >= today ? upcoming : past).push(ev);
    });
    upcoming.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    past.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    return { upcoming: upcoming, past: past };
  }

  function render() {
    var groups = splitEvents();
    var rows = currentFilter === 'past' ? groups.past : groups.upcoming;
    list.textContent = '';

    if (!rows.length) {
      var empty = document.createElement('p');
      empty.className = 'tp-cal-empty';
      empty.textContent = currentFilter === 'past'
        ? 'Past gatherings will appear here.'
        : 'New experiences are announced to members first. The next dates are coming soon.';
      list.appendChild(empty);
      return;
    }

    rows.forEach(function (ev) {
      var date = new Date(ev.date + 'T00:00:00');
      var el = document.createElement(ev.url ? 'a' : 'div');
      el.className = 'tp-cal-row';
      if (ev.url) { el.href = ev.url; el.target = '_blank'; el.rel = 'noopener'; }

      var dateCol = document.createElement('div');
      dateCol.className = 'tp-cal-date';
      dateCol.textContent = date.getDate();
      var monthEl = document.createElement('span');
      monthEl.textContent = MONTHS[date.getMonth()] + ' ' + date.getFullYear();
      dateCol.appendChild(monthEl);

      var nameCol = document.createElement('div');
      nameCol.className = 'tp-cal-name';
      nameCol.textContent = ev.title;
      if (ev.category || ev.time) {
        var meta = document.createElement('small');
        meta.textContent = [ev.category, ev.time].filter(Boolean).join(' · ');
        nameCol.appendChild(meta);
      }

      var locCol = document.createElement('div');
      locCol.className = 'tp-cal-loc';
      locCol.textContent = ev.location;

      var statusCol = document.createElement('div');
      statusCol.className = 'tp-status' + (ev.status === 'open' ? ' is-open' : '');
      statusCol.textContent = ev.status ? ev.status : (currentFilter === 'past' ? 'Held' : '');

      el.appendChild(dateCol);
      el.appendChild(nameCol);
      el.appendChild(locCol);
      el.appendChild(statusCol);
      list.appendChild(el);
    });
  }

  /* ---- Stats band: values + labels from communityStats ---- */
  var statsRoot = document.getElementById('tpStats');
  if (statsRoot) {
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
  }
})();
