// Renders the upcoming-events list from content/calendar.json.
// Edit that file to add/remove/update events — this script never needs to change.
(function () {
  var list = document.getElementById('tpCalList');
  if (!list) return;

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var STATUS_CLASS = { open: 'is-open', waitlist: 'is-wait', members: 'is-members' };
  var STATUS_LABEL = { open: 'Open', waitlist: 'Waitlist', members: 'Members Only' };

  fetch('content/calendar.json')
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function (err) {
      console.error('Could not load content/calendar.json', err);
      list.innerHTML = '<p class="tp-cal-empty">Calendar is being updated — check back shortly.</p>';
    });

  function render(events) {
    if (!events || !events.length) {
      list.innerHTML = '<p class="tp-cal-empty">No upcoming events posted yet.</p>';
      return;
    }

    events
      .slice()
      .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })
      .forEach(function (event) {
        var date = new Date(event.date + 'T00:00:00');
        var day = date.getDate();
        var month = MONTHS[date.getMonth()];

        var row = document.createElement('div');
        row.className = 'tp-cal-row';
        row.innerHTML =
          '<div class="tp-cal-date">' + day + '<span>' + month + '</span></div>' +
          '<div class="tp-cal-name">' + escapeHtml(event.title) + '</div>' +
          '<div class="tp-cal-loc">' + escapeHtml(event.location) + '</div>' +
          '<div class="tp-status ' + (STATUS_CLASS[event.status] || 'is-open') + '">' +
            (STATUS_LABEL[event.status] || 'Open') +
          '</div>';
        list.appendChild(row);
      });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
})();
