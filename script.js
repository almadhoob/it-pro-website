/**
 * The IT Pro Community (www.it-bh.pro)
 * Production Logic: Plain Vanilla JavaScript
 * Zero external frameworks, zero bloatware, zero em dashes.
 */

(function () {
  'use strict';

  // State and Element References
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const officialEmail = 'info@it-bh.pro';

  let toastTimeout = null;

  /**
   * Helper: Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Feature 1: Mobile Navigation Drawer
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
   * Feature 2: Sticky Header Elevation on Scroll
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
   * Feature 3: Smooth Scrolling with Sticky Header Offset
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
   * Feature 4: Active Navigation ScrollSpy via IntersectionObserver
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

  /**
   * Feature 5: Copy Official Email to Clipboard with Accessible Toast
   */
  function initCopyEmail() {
    if (!copyEmailBtn || !toast) return;

    function showToast() {
      toast.classList.add('show');
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
      toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
      }, 3000);
    }

    copyEmailBtn.addEventListener('click', async function () {
      let copySucceeded = false;

      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(officialEmail);
          copySucceeded = true;
        } catch (err) {
          copySucceeded = false;
        }
      }

      // Fallback for non-secure contexts or legacy browsers
      if (!copySucceeded) {
        try {
          const tempTextarea = document.createElement('textarea');
          tempTextarea.value = officialEmail;
          tempTextarea.style.position = 'fixed';
          tempTextarea.style.opacity = '0';
          tempTextarea.style.pointerEvents = 'none';
          document.body.appendChild(tempTextarea);
          tempTextarea.focus();
          tempTextarea.select();
          copySucceeded = document.execCommand('copy');
          document.body.removeChild(tempTextarea);
        } catch (err) {
          copySucceeded = false;
        }
      }

      if (copySucceeded) {
        showToast();
        const originalContent = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;color:var(--brand-red-deep);" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
        setTimeout(function () {
          copyEmailBtn.innerHTML = originalContent;
        }, 2500);
      } else {
        // Fallback: trigger mailto if clipboard copy is blocked
        window.location.href = 'mailto:' + officialEmail;
      }
    });
  }

  // Initialize all features once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileMenu();
      initHeaderElevation();
      initSmoothScroll();
      initScrollSpy();
      initCopyEmail();
    });
  } else {
    initMobileMenu();
    initHeaderElevation();
    initSmoothScroll();
    initScrollSpy();
    initCopyEmail();
  }
})();
