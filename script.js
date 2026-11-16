'use strict';

/* ----------------------------------------------------------
   0. SITE CONFIG — edit these values to customize the site
   ---------------------------------------------------------- */
const CONFIG = {
  // Path to the CV PDF. Place your file at ./assets/Eslam-Essa-Gabr-CV.pdf
  cvPath: 'assets/Eslam-Essa-Gabr-CV.pdf',
  cvFileName: 'Eslam-Essa-Gabr-CV.pdf',
  email: 'eslamgabr500@gmail.com',
  // Roles for the hero typing animation (grounded in the CV)
  roles: [
    'Full-Stack Development',
    'EdTech Entrepreneurship',
    'ERP Systems Solutions',
    'Freelancing Mentorship',
    'Career Consulting'
  ],
  typeSpeed: 68,       // ms per typed char
  deleteSpeed: 38,     // ms per deleted char
  holdTime: 1700       // ms pause on a full word
};

/* ----------------------------------------------------------
   1. HELPERS
   ---------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = window.matchMedia('(pointer: fine)').matches;

/* Toast notification */
let toastTimer = null;
function showToast(msg, type = 'info') {
  const toast = $('#toast');
  if (!toast) return;
  $('#toastMsg').textContent = msg;
  const icon = $('#toastIcon');
  icon.className = type === 'success'
    ? 'fa-solid fa-circle-check'
    : type === 'warning'
      ? 'fa-solid fa-triangle-exclamation'
      : 'fa-solid fa-circle-info';
  toast.classList.remove('success', 'warning');
  if (type !== 'info') toast.classList.add(type);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4600);
}

/* ----------------------------------------------------------
   2. PRELOADER — remove once the page has loaded
   ---------------------------------------------------------- */
(function preloader() {
  const el = $('#preloader');
  if (!el) return;
  const remove = () => el.remove();
  if (document.readyState === 'complete') {
    setTimeout(remove, 350);
  } else {
    window.addEventListener('load', () => setTimeout(remove, 350));
    setTimeout(remove, 2200); // safety fallback
  }
})();

/* ----------------------------------------------------------
   3. NAVBAR — scrolled state, mobile menu, scrollspy
   ---------------------------------------------------------- */
(function navbar() {
  const bar = $('#navbar');
  const burger = $('#hamburger');
  const links = $('#primaryNav');

  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', toggleMenu);
  // Close the mobile menu after choosing a destination
  links.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  // Close when clicking outside the panel (mobile)
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !e.target.closest('#primaryNav') && !e.target.closest('#hamburger')) closeMenu();
  });

  /* Scrollspy — highlight the section currently in view */
  const navAnchors = $$('.nav-link', links);
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => spy.observe(s));
})();

/* ----------------------------------------------------------
   4. TYPING ANIMATION (hero)
   ---------------------------------------------------------- */
(function typing() {
  const el = $('#typed');
  if (!el || reduceMotion) {
    if (el) el.textContent = CONFIG.roles[0];
    return;
  }
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = CONFIG.roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIdx);

    let delay = deleting ? CONFIG.deleteSpeed : CONFIG.typeSpeed;

    if (!deleting && charIdx === word.length) {
      delay = CONFIG.holdTime;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % CONFIG.roles.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ----------------------------------------------------------
   5. SCROLL REVEAL — IntersectionObserver
   ---------------------------------------------------------- */
(function reveal() {
  const items = $$('.reveal');
  if (!items.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => io.observe(i));
})();

/* ----------------------------------------------------------
   6. ANIMATED STATISTIC COUNTERS
   ---------------------------------------------------------- */
(function counters() {
  const nums = $$('.counter');
  if (!nums.length) return;
  const animate = el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = (target >= 1000 ? target.toLocaleString('en-US') : target) + suffix;
      return;
    }
    const duration = 1900;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.round(easeOut(p) * target);
      el.textContent = (target >= 1000 ? val.toLocaleString('en-US') : val) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
})();

/* ----------------------------------------------------------
   7. ELEGANT IMAGE PLACEHOLDERS
   Any <img data-ph="Label"> that fails to load (e.g. before you
   add the real file) is swapped for a branded SVG placeholder.
   ---------------------------------------------------------- */
(function imageFallbacks() {
  function placeholder(label) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>" +
      "<defs>" +
      "<linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#0a0e1c'/><stop offset='1' stop-color='#0d1226'/>" +
      "</linearGradient>" +
      "<linearGradient id='ac' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#38bdf8'/><stop offset='1' stop-color='#a855f7'/>" +
      "</linearGradient>" +
      "</defs>" +
      "<rect width='800' height='600' fill='url(#bg)'/>" +
      "<circle cx='640' cy='110' r='180' fill='#6366f1' opacity='0.13'/>" +
      "<circle cx='130' cy='520' r='200' fill='#38bdf8' opacity='0.10'/>" +
      "<circle cx='400' cy='235' r='86' fill='none' stroke='url(#ac)' stroke-width='4' opacity='0.85'/>" +
      "<circle cx='400' cy='210' r='30' fill='url(#ac)' opacity='0.9'/>" +
      "<path d='M320 330 Q400 275 480 330' fill='none' stroke='url(#ac)' stroke-width='10' stroke-linecap='round' opacity='0.9'/>" +
      "<rect x='150' y='398' width='500' height='46' rx='23' fill='#121834'/>" +
      "<text x='400' y='429' font-family='Arial, sans-serif' font-size='24' font-weight='700' fill='#c9d4ee' text-anchor='middle'>" +
      label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
      "</text>" +
      "<text x='400' y='478' font-family='Arial, sans-serif' font-size='15' fill='#66738f' text-anchor='middle'>drop your image into ./assets/ to replace this</text>" +
      "</svg>";
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  $$('img[data-ph]').forEach(img => {
    const swap = () => {
      if (img.dataset.failed) return;
      img.dataset.failed = '1';
      img.src = placeholder(img.dataset.ph || 'Image');
    };
    img.addEventListener('error', swap);
    // Handles images that failed before JS attached the listener
    if (img.complete && img.naturalWidth === 0) swap();
  });
})();

/* ----------------------------------------------------------
   8. CV DOWNLOAD — graceful notice if the PDF is missing
   When the site is opened over http(s) the button verifies the
   file first. When opened directly from disk (file://), the
   browser handles the download natively.
   ---------------------------------------------------------- */
(function cvDownload() {
  const btn = $('#cvBtn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    if (!location.protocol.startsWith('http')) return; // file:// → let the browser decide
    e.preventDefault();
    fetch(CONFIG.cvPath, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          const a = document.createElement('a');
          a.href = CONFIG.cvPath;
          a.download = CONFIG.cvFileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast('Downloading CV — thank you for your interest!', 'success');
        } else {
          showToast('CV not found yet. Place your PDF at: ' + CONFIG.cvPath, 'warning');
        }
      })
      .catch(() => showToast('CV not found yet. Place your PDF at: ' + CONFIG.cvPath, 'warning'));
  });
})();

/* ----------------------------------------------------------
   9. CONTACT FORM — composes a mailto: message (no backend)
   ---------------------------------------------------------- */
(function contactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const fields = ['name', 'email', 'subject', 'message'];
    let valid = true;
    fields.forEach(f => {
      const input = form.elements[f];
      const bad = !String(data.get(f) || '').trim();
      input.classList.toggle('invalid', bad);
      if (bad) valid = false;
    });
    const email = String(data.get('email') || '');
    if (valid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.elements.email.classList.add('invalid');
      valid = false;
    }
    if (!valid) {
      showToast('Please fill in all fields with a valid email.', 'warning');
      return;
    }
    const subject = encodeURIComponent('Portfolio contact: ' + data.get('subject'));
    const body = encodeURIComponent(
      data.get('message') + '\n\n— ' + data.get('name') + ' (' + data.get('email') + ')'
    );
    window.location.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
    showToast('Opening your email app with the message pre-filled...', 'success');
    form.reset();
  });
})();

/* ----------------------------------------------------------
   10. BACK TO TOP
   ---------------------------------------------------------- */
(function backToTop() {
  const btn = $('#toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
})();

/* ----------------------------------------------------------
   11. CUSTOM CURSOR — decorative only, native cursor preserved
   ---------------------------------------------------------- */
(function cursor() {
  if (!finePointer || reduceMotion) return;
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;

  let x = -100, y = -100, rx = -100, ry = -100, active = false;

  document.addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    if (!active) {
      active = true;
      document.body.classList.add('cursor-active');
    }
    dot.style.transform = `translate(${x - 3.5}px, ${y - 3.5}px)`;
  }, { passive: true });

  (function loop() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    const size = ring.offsetWidth || 38;
    ring.style.transform = `translate(${rx - size / 2}px, ${ry - size / 2}px)`;
    requestAnimationFrame(loop);
  })();

  // Grow the ring over interactive elements
  const hoverSel = 'a, button, .chip, .org-card, input, textarea, .stat-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) ring.classList.remove('hovered');
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
})();

/* ----------------------------------------------------------
   12. SUBTLE 3D TILT on the featured project image
   ---------------------------------------------------------- */
(function tilt() {
  if (!finePointer || reduceMotion) return;
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'none'; });
  });
})();

/* ----------------------------------------------------------
   13. FOOTER YEAR
   ---------------------------------------------------------- */
(function year() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();
