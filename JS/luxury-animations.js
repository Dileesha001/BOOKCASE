/**
 * BOOKCASE — Master Ultra-Luxury Animation & Micro-Interaction Engine
 * Features:
 *  1. 3D Mouse Parallax Tilt for Hero Showcase & Featured Book Artwork
 *  2. Interactive Mouse-Following Spotlight Shine on Book Cards
 *  3. Cinematic Hero GSAP Timeline Entrance
 *  4. Scroll progress tracking indicator at Header Top
 *  5. Staggered GSAP & IntersectionObserver Scroll Reveals
 *  6. Bulletproof Fail-safe: Content is 100% visible by default
 */

(function () {
    'use strict';

    function initLuxuryAnimations() {
        console.log('[BOOKCASE] Initializing luxury animation engine...');

        // Register ScrollTrigger if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Add gsap-ready class to body
        document.body.classList.add('gsap-ready');

        /* ── 1. HEADER TOP SCROLL PROGRESS BAR ───────────────────────────── */
        const scrollProgress = document.getElementById('scrollProgress');
        function updateScrollProgress() {
            if (!scrollProgress) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        /* ── 2. CINEMATIC HERO ENTRANCE (GSAP TIMELINE) ───────────────────── */
        const heroSection = document.querySelector('#home') || document.querySelector('.hero');
        if (typeof gsap !== 'undefined') {
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            if (document.querySelector('#header')) {
                heroTl.fromTo('#header',
                    { y: -40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, clearProps: 'transform' }
                );
            }

            if (heroSection) {
                const eyebrow = heroSection.querySelector('.hero-eyebrow');
                const scriptText = heroSection.querySelector('.hero-script');
                const heroTextLines = heroSection.querySelectorAll('.herotext .ht-line, .herotext');
                const heroSub = heroSection.querySelector('.herosub');
                const exploreBtns = heroSection.querySelectorAll('.explore-btn');
                const heroImg = heroSection.querySelector('.heroimg');

                if (eyebrow) heroTl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
                if (scriptText) heroTl.fromTo(scriptText, { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3');
                if (heroTextLines.length > 0) {
                    heroTl.fromTo(heroTextLines,
                        { opacity: 0, y: 24, skewY: 1 },
                        { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out' },
                        '-=0.4'
                    );
                }
                if (heroSub) heroTl.fromTo(heroSub, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
                if (exploreBtns.length > 0) {
                    heroTl.fromTo(exploreBtns,
                        { opacity: 0, scale: 0.9, y: 10 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' },
                        '-=0.3'
                    );
                }
                if (heroImg) {
                    heroTl.fromTo(heroImg,
                        { opacity: 0, scale: 0.92, y: 30 },
                        {
                            opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
                            onComplete: function() {
                                heroImg.classList.add('heroimg-floating');
                            }
                        },
                        '-=0.8'
                    );
                }
            }
        } else {
            // Fallback for Hero if GSAP is unavailable
            if (heroSection) {
                const heroImg = heroSection.querySelector('.heroimg');
                if (heroImg) heroImg.classList.add('heroimg-floating');
            }
        }

        /* ── 3. 3D MOUSE PARALLAX TILT FOR HERO & FEATURED BOOK ─────────── */
        function setup3DPillTilt(containerSelector, elementSelector, maxTilt) {
            const container = document.querySelector(containerSelector);
            const element = document.querySelector(elementSelector);
            if (!container || !element) return;

            let rect = container.getBoundingClientRect();
            window.addEventListener('resize', function() { rect = container.getBoundingClientRect(); }, { passive: true });

            container.addEventListener('mousemove', function (e) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = -((y - centerY) / centerY) * (maxTilt || 10);
                const rotateY = ((x - centerX) / centerX) * (maxTilt || 10);

                element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            container.addEventListener('mouseleave', function () {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        }

        setup3DPillTilt('#home', '.heroimg', 8);
        setup3DPillTilt('.Subsec', '.mandodari', 10);

        /* ── 4. INTERACTIVE MOUSE-FOLLOWING SPOTLIGHT & TILT ON CARDS ─────── */
        const cards = document.querySelectorAll('.box2, .box');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');

                // Subtle 3D tilt calculation
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = -((y - centerY) / centerY) * 6;
                const tiltY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });

        /* ── 5. SCROLL TRIGGER REVEALS FOR SECTIONS & CATEGORIES ─────────── */
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Category pills stagger
            const categoriesWrap = document.querySelector('.catagories');
            if (categoriesWrap) {
                const catBoxes = categoriesWrap.querySelectorAll('.box');
                if (catBoxes.length > 0) {
                    gsap.fromTo(catBoxes,
                        { opacity: 0, y: 20, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out',
                            scrollTrigger: { trigger: categoriesWrap, start: 'top 88%', once: true }
                        }
                    );
                }
            }

            // Trust bar reveal
            const trustBar = document.querySelector('.trust-bar');
            if (trustBar) {
                const trustItems = trustBar.querySelectorAll('.trust-item');
                if (trustItems.length > 0) {
                    gsap.fromTo(trustItems,
                        { opacity: 0, y: 20, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)',
                            scrollTrigger: { trigger: trustBar, start: 'top 88%', once: true }
                        }
                    );
                }
            }

            // Featured Subsection reveal
            const subsec = document.querySelector('.Subsec');
            if (subsec) {
                const subimg = subsec.querySelector('.subimg');
                const subcontent = subsec.querySelector('.subcontent');
                if (subimg) {
                    gsap.fromTo(subimg,
                        { opacity: 0, x: -30, scale: 0.95 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: subsec, start: 'top 85%', once: true } }
                    );
                }
                if (subcontent) {
                    gsap.fromTo(subcontent.children,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: subsec, start: 'top 85%', once: true } }
                    );
                }
            }

            // Book category sections reveal
            document.querySelectorAll('.subcat').forEach(function (section) {
                const cardsInGrid = section.querySelectorAll('.box2');
                if (cardsInGrid.length > 0) {
                    gsap.fromTo(cardsInGrid,
                        { opacity: 0, y: 30, scale: 0.96 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
                            scrollTrigger: { trigger: section, start: 'top 85%', once: true }
                        }
                    );
                }
            });

            // Payment logos stagger
            const paylogos = document.querySelector('.paylogos');
            if (paylogos) {
                const logos = paylogos.querySelectorAll('img');
                gsap.fromTo(logos,
                    { opacity: 0, scale: 0.8, y: 15 },
                    {
                        opacity: 0.55, scale: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'back.out(1.2)',
                        scrollTrigger: { trigger: paylogos, start: 'top 92%', once: true }
                    }
                );
            }
        }

        /* ── 6. INTERSECTION OBSERVER FALLBACK ────────────────────────────── */
        if ('IntersectionObserver' in window) {
            const observerOptions = { threshold: 0.05, rootMargin: '0px 0px -40px 0px' };
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('[data-reveal], .subpage-hero-art').forEach(function (el) {
                revealObserver.observe(el);
            });
        }

        console.log('[BOOKCASE] Luxury animation engine fully mounted');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLuxuryAnimations);
    } else {
        initLuxuryAnimations();
    }
})();
