/* ── Mobile menu ── */
const toggle     = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Overlay creado dinámicamente
const navOverlay = document.createElement('div');
navOverlay.id = 'nav-overlay';
document.body.appendChild(navOverlay);

function openMobile() {
  mobileMenu.classList.add('open');
  navOverlay.classList.add('show');
  toggle.querySelector('i').className = 'fa fa-xmark';
  document.body.style.overflow = 'hidden';
}

function closeMobile() {
  mobileMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  toggle.querySelector('i').className = 'fa fa-bars';
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMobile() : openMobile();
});
navOverlay.addEventListener('click', closeMobile);
// Cierra en landscape / resize a desktop
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMobile(); }, { passive: true });

/* ── Accordion ── */
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.parentElement;
    const body   = btn.nextElementSibling;
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.accordion-body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// Abrir el primero por defecto
const firstBody = document.querySelector('.accordion-item.open .accordion-body');
if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';

/* ── Testimonial slider ── */
let testiCurrent = 0;
const testiCards = document.getElementById('testiCards');
const testiDots  = document.querySelectorAll('.testi-dot');

function goTesti(idx) {
  testiCurrent = idx;
  testiCards.style.transform = `translateX(-${idx * 100}%)`;
  testiDots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

setInterval(() => goTesti((testiCurrent + 1) % 3), 5500);

/* ── Counter animation ── */
const counters      = document.querySelectorAll('.stat-num[data-target]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const step   = Math.ceil(target / 60);
    let current  = 0;
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + '+';
      if (current >= target) clearInterval(timer);
    }, 28);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

/* ── Back to top ── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 400);
});

/* ── Newsletter ── */
function handleSubscribe(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent    = '¡Gracias!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent    = 'Suscribirse';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
  return false;
}

/* ══════════════════════════════════════
   EFECTOS & TRANSICIONES MODERNAS
══════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 450);
});

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  if (progressBar) progressBar.style.width = (scrolled * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ── Navbar glassy on scroll ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll(
  '.qs-card, .srv-card, .stat-card, .blog-card, .port-item, ' +
  '.section-title, .why-text, .why-images, ' +
  '.faq-text, .faq-image, .newsletter h2, .newsletter p, .nl-form'
);

revealEls.forEach((el, i) => {
  el.classList.add('auto-reveal');
  el.style.transitionDelay = (i % 4 * 0.1) + 's';
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Button ripple ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText =
      `width:${size}px;height:${size}px;` +
      `left:${e.clientX - rect.left - size / 2}px;` +
      `top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ── Hero image float ── */
const heroImg = document.querySelector('.hero-image img');
if (heroImg) heroImg.style.animation = 'float 4s ease-in-out infinite';

/* ── Testi dot click ── */
testiDots.forEach((dot, i) => dot.addEventListener('click', () => goTesti(i)));

/* ── Touch swipe — Testimonials ── */
(function () {
  const track = document.getElementById('testiCards');
  if (!track) return;
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    goTesti(diff > 0
      ? (testiCurrent + 1) % 3
      : (testiCurrent - 1 + 3) % 3);
  }, { passive: true });
})();

/* ── Portfolio — swipe hint en móvil ── */
(function () {
  const slider = document.querySelector('.portfolio-slider');
  if (!slider || window.innerWidth > 768) return;
  const hint = document.createElement('p');
  hint.className = 'swipe-hint';
  hint.innerHTML = '<i class="fa fa-hand-pointer"></i> Desliza para ver más trabajos';
  slider.parentElement.insertBefore(hint, slider);
})();

/* ── Footer accordion — móvil ── */
(function () {
  function initAccordion() {
    const isMobile = window.innerWidth <= 768;
    document.querySelectorAll('.footer-col').forEach(col => {
      const h4 = col.querySelector('h4');
      const ul  = col.querySelector('ul');
      if (!h4 || !ul) return;

      if (isMobile) {
        if (!h4.querySelector('.fc-toggle')) {
          const span = document.createElement('span');
          span.className = 'fc-toggle';
          span.textContent = '+';
          h4.appendChild(span);
          h4.addEventListener('click', onH4Click);
        }
        ul.style.maxHeight = '0px';
      } else {
        const span = h4.querySelector('.fc-toggle');
        if (span) { span.remove(); h4.removeEventListener('click', onH4Click); }
        ul.style.maxHeight = '';
        ul.style.overflow  = '';
      }
    });
  }

  function onH4Click() {
    const h4     = this;
    const ul     = h4.nextElementSibling;
    const toggle = h4.querySelector('.fc-toggle');
    const isOpen = ul.style.maxHeight !== '0px' && ul.style.maxHeight !== '';

    document.querySelectorAll('.footer-col ul').forEach(u => { u.style.maxHeight = '0px'; });
    document.querySelectorAll('.fc-toggle').forEach(t => { t.textContent = '+'; });

    if (!isOpen) {
      ul.style.maxHeight = ul.scrollHeight + 'px';
      if (toggle) toggle.textContent = '−';
    }
  }

  initAccordion();
  window.addEventListener('resize', initAccordion, { passive: true });
})();
