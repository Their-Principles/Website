// "Get to Know You" — the no-code-required door into membership.
// TODO(client): replace FORMSPREE_ENDPOINT with your real Formspree form URL
// (https://formspree.io/f/xxxxxxx) once one is created. Until then this file
// still validates and shows the success state so the flow can be reviewed —
// it just skips the network call so nobody sees a false failure.
(function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/TODO_REPLACE_WITH_REAL_FORM_ID';

  var toggleBtn = document.getElementById('tpGtyToggle');
  var form = document.getElementById('tpGtyForm');
  if (!toggleBtn || !form) return;

  var successEl = document.getElementById('tpGtySuccess');
  var submitBtn = form.querySelector('button[type="submit"]');

  toggleBtn.addEventListener('click', function () {
    var isOpen = form.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) form.querySelector('input')?.focus();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var isPlaceholderEndpoint = FORMSPREE_ENDPOINT.indexOf('TODO_REPLACE') !== -1;
    var submission = isPlaceholderEndpoint
      ? Promise.resolve({ ok: true })
      : fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });

    Promise.resolve(submission)
      .then(function (res) {
        if (res.ok) showSuccess();
        else showError('Something went wrong — please try again or email us directly.');
      })
      .catch(function () {
        showError('Something went wrong — please try again or email us directly.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      });
  });

  function validate() {
    var valid = true;
    form.querySelectorAll('[data-required]').forEach(function (field) {
      var errorEl = field.parentElement.querySelector('.tp-gty-error');
      var value = field.value.trim();
      var isValid = value.length > 0;

      if (field.type === 'email' && isValid) {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (errorEl) errorEl.classList.toggle('is-visible', !isValid);
      if (!isValid) valid = false;
    });
    return valid;
  }

  function showSuccess() {
    form.classList.remove('is-open');
    form.reset();
    if (successEl) successEl.classList.add('is-visible');
    toggleBtn.style.display = 'none';
  }

  function showError(message) {
    if (successEl) {
      successEl.textContent = message;
      successEl.classList.add('is-visible');
      setTimeout(function () { successEl.classList.remove('is-visible'); }, 4000);
    }
  }
})();
