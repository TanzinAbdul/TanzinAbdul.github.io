(function () {
    'use strict';

    // --- DOM ELEMENTS ---
    var navbar = document.getElementById('navbar');
    var menuToggle = document.getElementById('menuToggle');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var mobileClose = document.getElementById('mobileClose');
    var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    var allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav-link');
    var abstractModal = document.getElementById('abstractModal');
    var modalTitle = document.getElementById('modalTitle');
    var modalBody = document.getElementById('modalBody');
    var modalCloseBtn = document.getElementById('modalClose');
    var readAbstractButtons = document.querySelectorAll('.read-abstract');
    var revealElements = document.querySelectorAll('.reveal');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- SCROLL: NAV SHADOW / BACKGROUND ---
    function updateNavShadow() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavShadow, { passive: true });

    // --- SCROLL: ACTIVE NAV LINK ---
    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var scrollY = window.scrollY + 120;
        var currentSectionId = '';

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(function (link) {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('nav-active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    // --- SCROLL REVEAL (Intersection Observer) ---
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // --- MOBILE MENU ---
    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function (e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
    }

    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- ESC KEY TO CLOSE OVERLAYS ---
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mobileOverlay && mobileOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
            if (abstractModal && abstractModal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // --- ABSTRACT MODAL ---
    function openModal(title, bodyText) {
        if (!abstractModal || !modalTitle || !modalBody) return;
        modalTitle.textContent = title;
        modalBody.textContent = bodyText;
        abstractModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!abstractModal) return;
        abstractModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    readAbstractButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var title = this.getAttribute('data-title');
            var abstract = this.getAttribute('data-abstract');
            openModal(title, abstract);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (abstractModal) {
        abstractModal.addEventListener('click', function (e) {
            if (e.target === abstractModal) {
                closeModal();
            }
        });
    }

    // --- SMOOTH SCROLLING (fallback for browsers without native support) ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var navHeight = navbar ? navbar.offsetHeight + 12 : 64;
            var y = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });

    // --- INIT ---
    updateNavShadow();
    updateActiveNavLink();
})();
