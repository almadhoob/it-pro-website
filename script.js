(function () {
  'use strict';

  // State and Element References
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  /**
   * Helper: Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Mobile Navigation Drawer
   */
  function initMobileMenu() {
    if (!mobileToggle || !header) return;

    function toggleMenu(open) {
      const isOpen = typeof open === 'boolean' ? open : !header.classList.contains('nav-open');
      header.classList.toggle('nav-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    mobileToggle.addEventListener('click', function () {
      toggleMenu();
    });

    // Close on navigation link click
    document.querySelectorAll('.primary-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (header.classList.contains('nav-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });

    // Close on click outside header
    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  /**
   * Sticky Header Elevation on Scroll
   */
  function initHeaderElevation() {
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * Smooth Scrolling with Sticky Header Offset
   */
  function initSmoothScroll() {
    const internalAnchors = document.querySelectorAll('a[href^="#"]');

    internalAnchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = header ? header.getBoundingClientRect().height : 72;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        if (prefersReducedMotion()) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }

        // Maintain accessibility focus
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      });
    });
  }

  /**
   * Active Navigation ScrollSpy via IntersectionObserver
   */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) {
      return; // Fallback gracefully if not supported
    }

    const sections = document.querySelectorAll('section[id], div[id="craftsmanship"]');
    if (!sections.length || !navLinks.length) return;

    function setActiveLink(currentId) {
      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        const isActive = href === '#' + currentId;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.getAttribute('id'));
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Initialize all features once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileMenu();
      initHeaderElevation();
      initSmoothScroll();
      initScrollSpy();
    });
  } else {
    initMobileMenu();
    initHeaderElevation();
    initSmoothScroll();
    initScrollSpy();
  }
})();
