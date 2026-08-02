// Form handling: application (invited/general modes), contact, and the
// members login demo state. Client-side validation with stable layout
// (error slots are pre-reserved in CSS so nothing shifts).
//
// TODO(client): none of these forms are connected to a backend yet.
// Replace the endpoints below (e.g. with Formspree URLs) to go live —
// until then submissions validate and show the success state locally.
(function () {
  var ENDPOINTS = {
    application: '',   // TODO(client): e.g. https://formspree.io/f/xxxxxxx
    contact: ''        // TODO(client): e.g. https://formspree.io/f/yyyyyyy
  };

  /* ---- Application form: two doors into the same room ---- */
  var appForm = document.getElementById('tpApplicationForm');
  if (appForm) {
    var modeButtons = document.querySelectorAll('.tp-mode-switch button');
    var inviteField = document.getElementById('tpInviteCodeField');
    var params = new URLSearchParams(location.search);
    var mode = params.get('type') === 'invited' ? 'invited' : 'general';

    function setMode(next) {
      mode = next;
      modeButtons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-mode') === next));
      });
      if (inviteField) inviteField.hidden = next !== 'invited';
    }
    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
    });
    setMode(mode);

    wireForm(appForm, ENDPOINTS.application, function () {
      // invitation code only required in invited mode
      var code = document.getElementById('appInviteCode');
      if (mode === 'invited' && code && !code.value.trim()) {
        showError(code, true);
        return false;
      }
      return true;
    });
  }

  /* ---- Contact form ---- */
  var contactForm = document.getElementById('tpContactForm');
  if (contactForm) wireForm(contactForm, ENDPOINTS.contact);

  /* ---- Members login: DEMO ONLY — no real authentication exists yet.
     TODO(client): replace with the real auth flow when a member system is
     chosen. This validates the email and shows a clear "not yet live"
     message rather than pretending to log anyone in. ---- */
  var loginForm = document.getElementById('tpLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('memberEmail');
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      showError(email, !valid);
      if (!valid) return;
      var success = loginForm.parentElement.querySelector('.tp-form-success');
      if (success) {
        success.textContent = 'Member access is not open yet. We have noted your address and will be in touch.';
        success.classList.add('is-visible');
      }
      loginForm.hidden = true;
    });
  }

  /* ---- Shared plumbing ---- */
  function wireForm(form, endpoint, extraCheck) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var success = form.parentElement.querySelector('.tp-form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = validate(form);
      if (extraCheck && !extraCheck()) valid = false;
      if (!valid) return;

      submitBtn.disabled = true;
      var submission = endpoint
        ? fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        : Promise.resolve({ ok: true }); // no endpoint yet — local success state

      submission
        .then(function (res) {
          if (res.ok) {
            form.hidden = true;
            if (success) success.classList.add('is-visible');
          } else if (success) {
            flashError(success);
          }
        })
        .catch(function () { if (success) flashError(success); })
        .finally(function () { submitBtn.disabled = false; });
    });
  }

  function validate(form) {
    var valid = true;
    form.querySelectorAll('[data-required]').forEach(function (field) {
      if (field.closest('[hidden]')) return;
      var value = field.value.trim();
      var ok = value.length > 0;
      if (ok && field.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (ok && field.type === 'number') {
        var n = parseInt(value, 10);
        var min = parseInt(field.min, 10), max = parseInt(field.max, 10);
        if (!isNaN(min) && n < min) ok = false;
        if (!isNaN(max) && n > max) ok = false;
      }
      showError(field, !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  function showError(field, show) {
    var slot = field.parentElement.querySelector('.tp-field-error');
    if (slot) slot.classList.toggle('is-visible', show);
    field.setAttribute('aria-invalid', String(show));
  }

  function flashError(el) {
    el.textContent = 'Something went wrong — please email us directly at theirprinciples@gmail.com.';
    el.classList.add('is-visible');
  }
})();
