/* ═══════════════════════════════════════════════════════
   GPS ADVISORY — APP.JS
   Scroll animations · Sticky bar · Particles · FAQ
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Vivek avatar SVG markup — single source of truth ── */
const VIVEK_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="avatarGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#7a1f25"/>
      <stop offset="100%" stop-color="#3d0c10"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="url(#avatarGrad)" rx="4"/>
  <ellipse cx="100" cy="175" rx="65" ry="45" fill="#5c1519" opacity="0.9"/>
  <path d="M70 155 Q100 140 130 155 L125 175 Q100 165 75 175Z" fill="#7a1f25"/>
  <rect x="90" y="130" width="20" height="25" rx="5" fill="#c4845a"/>
  <ellipse cx="100" cy="115" rx="38" ry="42" fill="#c4845a"/>
  <ellipse cx="100" cy="77" rx="38" ry="18" fill="#5a4040"/>
  <ellipse cx="62" cy="100" rx="8" ry="18" fill="#5a4040"/>
  <ellipse cx="138" cy="100" rx="8" ry="18" fill="#5a4040"/>
  <ellipse cx="90" cy="79" rx="6" ry="10" fill="#8a7070" opacity="0.6"/>
  <ellipse cx="110" cy="79" rx="5" ry="10" fill="#8a7070" opacity="0.6"/>
  <ellipse cx="87" cy="110" rx="5" ry="4" fill="#2a1a0e"/>
  <ellipse cx="113" cy="110" rx="5" ry="4" fill="#2a1a0e"/>
  <ellipse cx="87" cy="109" rx="2" ry="2" fill="#fff" opacity="0.3"/>
  <ellipse cx="113" cy="109" rx="2" ry="2" fill="#fff" opacity="0.3"/>
  <path d="M80 103 Q87 100 95 103" stroke="#3a2a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M105 103 Q113 100 120 103" stroke="#3a2a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M100 112 Q96 120 98 124 Q100 126 102 124 Q104 120 100 112" fill="#b07050" opacity="0.6"/>
  <path d="M91 132 Q100 137 109 132" stroke="#8a5540" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M75 128 Q72 142 80 155 Q100 165 120 155 Q128 142 125 128 Q112 138 100 138 Q88 138 75 128Z" fill="#4a3030" opacity="0.85"/>
  <rect x="97" y="90" width="6" height="10" rx="3" fill="#d4af37" opacity="0.9"/>
  <text x="100" y="55" text-anchor="middle" font-size="14" fill="#d4af37" opacity="0.5" font-family="serif">ॐ</text>
</svg>`;

/* ── DOM ready ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  injectVivekAvatars();
  initParticles();
  initParallax();
  initScrollBehavior();
  initRevealObserver();
  initFaqAccordion();
  initCountUp();
  // Ensure hero section reveals immediately on page load
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
  });
});

/* ══════════════════════════════════════════════════════
   0. PAGE LOAD FADE-IN
   ══════════════════════════════════════════════════════ */
function initPageLoad() {
  // RAF ensures CSS transition fires (avoids paint-skip on first frame)
  requestAnimationFrame(() => document.body.classList.add('page-loaded'));
}

/* ══════════════════════════════════════════════════════
   1. INJECT VIVEK SVG (eliminates duplicate inline SVG)
   ══════════════════════════════════════════════════════ */
function injectVivekAvatars() {
  document.querySelectorAll('[data-vivek-avatar]').forEach(el => {
    el.innerHTML = VIVEK_SVG;
  });
}

/* ══════════════════════════════════════════════════════
   1. FLOATING PARTICLES (Hero section)
   ══════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 22;
  // Build fragment to avoid 22 separate DOM insertions
  const frag = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 4 + 1.5;  // 1.5–5.5 px
    const left     = Math.random() * 100;       // 0–100%
    const delay    = Math.random() * 18;        // 0–18s
    const duration = Math.random() * 18 + 12;  // 12–30s

    p.style.cssText =
      `width:${size}px;height:${size}px;left:${left}%;bottom:-10px;` +
      `animation-duration:${duration}s;animation-delay:-${delay}s;`;

    frag.appendChild(p);
  }

  container.appendChild(frag);
}

/* ══════════════════════════════════════════════════════
   2. SCROLL BEHAVIOR — Nav shrink + Sticky CTA
   ══════════════════════════════════════════════════════ */
function initScrollBehavior() {
  // Cache selectors once
  const nav     = document.getElementById('nav');
  const heroCta = document.getElementById('heroCta');
  const stickyCta = document.getElementById('stickyCta');

  // Use IntersectionObserver for sticky bar — zero scroll cost
  if (heroCta && stickyCta) {
    new IntersectionObserver(
      ([entry]) => stickyCta.classList.toggle('is-visible', !entry.isIntersecting),
      { threshold: 0 }
    ).observe(heroCta);
  }

  // Nav shrink: passive listener, RAF-batched write
  if (nav) {
    let rafPending = false;
    window.addEventListener('scroll', () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        rafPending = false;
      });
    }, { passive: true });
  }
}

/* ══════════════════════════════════════════════════════
   3. REVEAL ANIMATIONS (Intersection Observer)
   ══════════════════════════════════════════════════════ */
function initRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);  // fire-once, no memory leak
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════
   4. FAQ ACCORDION
   ══════════════════════════════════════════════════════ */
function initFaqAccordion() {
  const items = [...document.querySelectorAll('.faq-item')].map(item => ({
    item,
    btn:    item.querySelector('.faq-question'),
    answer: item.querySelector('.faq-answer'),
  })).filter(({ btn, answer }) => btn && answer);

  // Measure exact natural height for each answer and cache it as a CSS var.
  // This gives a perfectly-timed height animation (no max-height:400px guess).
  items.forEach(({ answer }) => {
    answer.removeAttribute('hidden');
    answer.style.height = 'auto';          // temporarily unconstrain
    answer.style.setProperty('--faq-height', `${answer.scrollHeight}px`);
    answer.style.height = '';              // restore CSS height:0
  });

  items.forEach(({ btn, answer }) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      items.forEach(({ btn: b, answer: a }) => {
        b.setAttribute('aria-expanded', 'false');
        a.classList.remove('is-open');
      });

      // Open current if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('is-open');
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   5. GOLD-DUST PARALLAX (Hero particles)
   ══════════════════════════════════════════════════════ */
function initParallax() {
  const container = document.getElementById('particles');
  if (!container || !matchMedia('(hover: hover)').matches) return;

  let rafId = 0;
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const x = (e.clientX / innerWidth - 0.5) * -8;   // 4-8px subtle range
      const y = (e.clientY / innerHeight - 0.5) * -6;
      container.style.transform = `translate3d(${x}px, ${y}px, 0)`; // GPU accelerated
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════
   6. COUNT-UP ANIMATION (stat numbers)
   ══════════════════════════════════════════════════════ */
function initCountUp() {
  const els = document.querySelectorAll('[data-countup]');
  if (!els.length) return;

  // Respect prefers-reduced-motion
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const raw = el.textContent.trim();
        const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        const suffix = raw.replace(/[0-9,]/g, '');  // e.g. "+" or " years"
        const hasComma = raw.includes(',');
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);  // easeOutCubic
          const val = Math.round(target * ease);
          el.textContent = (hasComma ? val.toLocaleString('en-IN') : val) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.3 }
  );

  els.forEach(el => observer.observe(el));
}
