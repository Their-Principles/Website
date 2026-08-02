// Past-events carousel: autoplay + manual controls, no external library.
// Content comes from content/carousel.json so the community team can add
// photos without touching this file.
(function () {
  var root = document.getElementById('tpCarousel');
  if (!root) return;

  var track = root.querySelector('.tp-carousel-track');
  var dotsWrap = root.querySelector('.tp-carousel-dots');
  var prevBtn = root.querySelector('.tp-carousel-prev');
  var nextBtn = root.querySelector('.tp-carousel-next');

  var AUTOPLAY_MS = 5000;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;
  var slides = [];
  var dots = [];
  var current = 0;

  fetch('content/carousel.json')
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function (err) {
      console.error('Could not load content/carousel.json', err);
      root.innerHTML = '<p class="tp-cal-empty">Photos coming soon.</p>';
    });

  function render(items) {
    if (!items || !items.length) return;

    items.forEach(function (item, i) {
      var slide = document.createElement('div');
      slide.className = 'tp-carousel-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + items.length);

      if (item.image) {
        var img = document.createElement('img');
        img.src = item.image;
        img.alt = item.caption || '';
        img.loading = 'lazy';
        slide.appendChild(img);
      }

      var caption = document.createElement('div');
      caption.className = 'tp-carousel-caption';
      caption.textContent = item.caption || '';
      slide.appendChild(caption);

      track.appendChild(slide);
      slides.push(slide);

      var dot = document.createElement('button');
      dot.className = 'tp-carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    goTo(0);

    prevBtn.addEventListener('click', function () { goTo(current - 1); restartAutoplay(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); restartAutoplay(); });

    track.addEventListener('scroll', function () {
      var index = Math.round(track.scrollLeft / track.clientWidth);
      if (index !== current) setActive(index);
    }, { passive: true });

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);
    root.addEventListener('touchstart', stopAutoplay, { passive: true });

    if (!prefersReducedMotion) startAutoplay();
  }

  function goTo(index) {
    var next = (index + slides.length) % slides.length;
    track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' });
    setActive(next);
  }

  function setActive(index) {
    current = index;
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
  }

  function startAutoplay() {
    stopAutoplay();
    if (prefersReducedMotion || slides.length < 2) return;
    timer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restartAutoplay() { startAutoplay(); }
})();
