/* ============================================================
   StockAR — Interacciones
   Sin dependencias. Sin cursor personalizado.
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. NAVBAR STICKY (agrega clase al hacer scroll)
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     2. MENÚ MOBILE
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navDropdowns = document.querySelectorAll('.nav__dropdown');

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      navDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        dropdown.querySelector('.nav__dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    navDropdowns.forEach((dropdown) => {
      const dropdownToggle = dropdown.querySelector('.nav__dropdown-toggle');
      dropdownToggle.addEventListener('click', () => {
        if (window.innerWidth >= 900) return;

        const isOpen = dropdown.classList.toggle('is-open');
        dropdownToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
          navDropdowns.forEach((otherDropdown) => {
            if (otherDropdown === dropdown) return;

            otherDropdown.classList.remove('is-open');
            otherDropdown.querySelector('.nav__dropdown-toggle').setAttribute('aria-expanded', 'false');
          });
        }
      });
    });

    // Cerrar al clickear un link
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar al clickear fuera
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Cerrar al pasar a desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL (con offset por navbar sticky)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      // Actualiza la URL sin saltar
      history.pushState(null, '', targetId);
    });
  });

  /* ----------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Stagger sutil para grupos
    revealElements.forEach((el, i) => {
      const parent = el.parentElement;
      const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [el];
      const idx = Array.prototype.indexOf.call(siblings, el);
      el.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
      observer.observe(el);
    });
  } else {
    // Fallback: mostrar todo directamente
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     5. FAQ ACORDEÓN (solo uno abierto a la vez)
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ----------------------------------------------------------
     6. PARALLAX SUTIL DEL MOCKUP HERO
     (solo en desktop y sin reduced motion)
  ---------------------------------------------------------- */
  const mockup = document.getElementById('heroMockup');

  if (mockup && !prefersReducedMotion && window.matchMedia('(min-width: 980px)').matches) {
    let ticking = false;

    const update = () => {
      const rect = mockup.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const delta = (elementCenter - viewportCenter) / viewportCenter;
      const translate = Math.max(-14, Math.min(14, delta * 14));
      mockup.style.transform = `translateY(${translate}px)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     7. AÑO EN EL FOOTER
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();