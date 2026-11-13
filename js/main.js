(function () {
  'use strict';

  // 1. Entrance animationend handler
  var appears = document.querySelectorAll('.appear');
  var heroPhoto = document.querySelector('.hero-photo');

  appears.forEach(function (el) {
    el.addEventListener('animationend', function () {
      el.classList.add('is-in');
    }, { once: true });
  });

  if (heroPhoto) {
    heroPhoto.addEventListener('animationend', function () {
      heroPhoto.classList.add('is-in');
    }, { once: true });
  }

  // Fallback timer if animations do not run
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var runningOrFinished = false;
      appears.forEach(function (el) {
        if (typeof el.getAnimations === 'function') {
          var anims = el.getAnimations();
          anims.forEach(function (anim) {
            if (anim.playState === 'running' || anim.playState === 'finished') {
              runningOrFinished = true;
            }
          });
        }
      });
      if (!runningOrFinished) {
        appears.forEach(function (el) { el.classList.add('is-in'); });
        if (heroPhoto) heroPhoto.classList.add('is-in');
      }
    });
  });

  // 2. Mobile burger navigation
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');
  var backdrop = document.querySelector('.menu-backdrop');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (burger) {
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      if (document.body.classList.contains('menu-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  if (nav) {
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
        closeMenu();
      });
    });

    if (window.location.hash) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href === window.location.hash || href.endsWith(window.location.hash)) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // 3. Scroll reveal for below-the-fold sections
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  // 4. Header sticky background toggle on scroll
  function handleScroll() {
    var isScrolled = window.scrollY > 40;
    if (isScrolled) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 5. Contact Form validation & submission
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    var formInputs = contactForm.querySelectorAll('.form-input, .form-textarea, .form-select');

    function validateField(input) {
      var group = input.closest('.form-group');
      if (!group) return true;
      var msgEl = group.querySelector('.field-msg');
      if (!msgEl) return true;

      var error = '';
      var val = input.value.trim();

      if (input.hasAttribute('required') && !val) {
        error = msgEl.getAttribute('data-error') || 'This field is required';
      } else if (input.type === 'email' && val) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          error = 'Enter a valid email address (e.g. name@company.my)';
        }
      }

      if (error) {
        group.classList.add('has-error');
        msgEl.textContent = error;
        input.setAttribute('aria-invalid', 'true');
        return false;
      } else {
        group.classList.remove('has-error');
        msgEl.textContent = msgEl.getAttribute('data-support') || '';
        input.removeAttribute('aria-invalid');
        return true;
      }
    }

    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.closest('.form-group').classList.contains('has-error')) {
          validateField(input);
        }
      });
      input.addEventListener('change', function () {
        if (input.closest('.form-group').classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      formInputs.forEach(function (input) {
        if (!validateField(input)) {
          allValid = false;
        }
      });

      if (!allValid) {
        var firstError = contactForm.querySelector('.form-group.has-error .form-input, .form-group.has-error .form-textarea, .form-group.has-error .form-select');
        if (firstError) firstError.focus();
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(function () {
        contactForm.reset();
        formInputs.forEach(function (input) {
          var group = input.closest('.form-group');
          if (group) {
            group.classList.remove('has-error');
            var msgEl = group.querySelector('.field-msg');
            if (msgEl) msgEl.textContent = msgEl.getAttribute('data-support') || '';
          }
        });

        if (submitBtn) submitBtn.disabled = false;
        formStatus.textContent = "Thank you! Your message has been received. We'll reply within 1 business day.";
        formStatus.classList.add('is-visible');
        setTimeout(function () {
          formStatus.classList.remove('is-visible');
        }, 6000);
      }, 700);
    });
  }

  // 6. Project cards cursor-follow View Repo button
  var projectCards = document.querySelectorAll('.engineering-grid .project-card');
  projectCards.forEach(function (card) {
    var btn = card.querySelector('.view-repo-btn');
    if (!btn) return;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
    });

    card.addEventListener('mouseenter', function () {
      btn.style.opacity = '1';
    });

    card.addEventListener('mouseleave', function () {
      btn.style.opacity = '0';
    });
  });
})();
