// Renders the mentor grid on mentors.html from content/mentors.json.
(function () {
  var grid = document.getElementById('tpMentorGrid');
  if (!grid) return;

  fetch('content/mentors.json')
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function (err) {
      console.error('Could not load content/mentors.json', err);
      grid.innerHTML = '<p class="tp-cal-empty">Mentor profiles coming soon.</p>';
    });

  function render(mentors) {
    if (!mentors || !mentors.length) return;

    mentors.forEach(function (mentor) {
      var card = document.createElement('div');
      card.className = 'tp-mentor-card';

      var photo = document.createElement('div');
      photo.className = 'tp-mentor-photo';
      if (mentor.photo) {
        var img = document.createElement('img');
        img.src = mentor.photo;
        img.alt = mentor.name || '';
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        photo.textContent = '';
        photo.appendChild(img);
      } else {
        photo.textContent = 'Photo — ' + (mentor.name || 'TODO');
      }

      card.appendChild(photo);
      card.insertAdjacentHTML('beforeend',
        '<h3>' + escapeHtml(mentor.name) + '</h3>' +
        '<div class="tp-affiliation">' + escapeHtml(mentor.affiliation) + '</div>' +
        '<p class="tp-bio">' + escapeHtml(mentor.bio) + '</p>'
      );

      grid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
})();
