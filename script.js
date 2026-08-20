document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Slight delay for the outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // 2. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            accordionItems.forEach(acc => acc.classList.remove('active'));
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. GSAP Animations (Make sure GSAP is loaded)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // General Fade In
        gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
            let delay = elem.getAttribute('data-delay') || 0;
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%", // when top of elem hits 85% of viewport
                    toggleActions: "play none none none"
                },
                opacity: 0,
                duration: 1,
                delay: parseFloat(delay),
                ease: "power2.out"
            });
        });

        // Slide Up Fade
        gsap.utils.toArray('.gs-reveal-up').forEach(function(elem) {
            let delay = elem.getAttribute('data-delay') || 0;
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: parseFloat(delay),
                ease: "power2.out"
            });
        });

        // Parallax Image Effect
        gsap.utils.toArray('.parallax-img').forEach(function(img) {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                y: -100, // moves image up as you scroll down
                ease: "none"
            });
        });

        // Number Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            let target = parseInt(counter.getAttribute('data-target'));
            gsap.to(counter, {
                scrollTrigger: {
                    trigger: counter,
                    start: "top 90%",
                },
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power1.inOut",
                onUpdate: function() {
                    counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                }
            });
        });
        
        // 4b. Gear Parallax & 3D Interactive Motion
        const gearWrapper = document.querySelector('.gear-marquee-wrapper');
        const gearInner = document.querySelector('.rotating-gear-inner');
        if (gearWrapper && gearInner) {
            gearWrapper.addEventListener('mousemove', (e) => {
                const rect = gearWrapper.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gearInner.style.transform = `perspective(1000px) rotateX(${-y * 28}deg) rotateY(${x * 28}deg) scale(1.06)`;
                gearInner.style.transition = 'transform 0.1s ease-out';
            });

            gearWrapper.addEventListener('mouseleave', () => {
                gearInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                gearInner.style.transition = 'transform 0.5s ease';
            });
        }
        
    } else {
        console.warn("GSAP or ScrollTrigger not loaded.");
    }

    // 5. Scroll Spy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 6. Contact Form Interaction
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        // Auto-expand textarea on typing
        const textarea = contactForm.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const acceptance = document.getElementById('contact-acceptance').checked;

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill out all required fields.';
                    formStatus.className = 'form-status-message error';
                }
                return;
            }

            if (!acceptance) {
                if (formStatus) {
                    formStatus.textContent = 'Please accept the data collection agreement.';
                    formStatus.className = 'form-status-message error';
                }
                return;
            }

            // Simulate loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
                    
                    if (formStatus) {
                        formStatus.textContent = 'Thank you for getting in touch! We will get back to you shortly.';
                        formStatus.className = 'form-status-message success';
                    }

                    contactForm.reset();

                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.innerHTML = originalHtml;
                        }
                    }, 4000);
                }, 1000);
            }
        });
    }

    // 7. Interactive 4-Column Services Panel Hover Showcase (Fabrica Replica)
    const servicePanels = document.querySelectorAll('.service-panel-col');
    const serviceBgs = document.querySelectorAll('.service-panel-bg');

    if (servicePanels.length > 0 && serviceBgs.length > 0) {
        servicePanels.forEach(panel => {
            const panelNum = panel.getAttribute('data-panel');

            panel.addEventListener('mouseenter', () => {
                servicePanels.forEach(p => p.classList.remove('active'));
                serviceBgs.forEach(bg => bg.classList.remove('active'));

                panel.classList.add('active');
                const targetBg = document.querySelector(`.service-panel-bg[data-bg="${panelNum}"]`);
                if (targetBg) {
                    targetBg.classList.add('active');
                }
            });

            panel.addEventListener('click', () => {
                servicePanels.forEach(p => p.classList.remove('active'));
                serviceBgs.forEach(bg => bg.classList.remove('active'));

                panel.classList.add('active');
                const targetBg = document.querySelector(`.service-panel-bg[data-bg="${panelNum}"]`);
                if (targetBg) {
                    targetBg.classList.add('active');
                }
            });
        });
    }

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
