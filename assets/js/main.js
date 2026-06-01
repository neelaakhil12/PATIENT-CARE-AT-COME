// Patient Care At Home - Main JavaScript File

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
(function () {
    const splash = document.getElementById('splash-screen');
    const typingEl = document.getElementById('typing-text');
    if (!splash || !typingEl) return;

    // Prevent scrolling while splash is visible
    document.body.style.overflow = 'hidden';

    const fullText = 'Patient Care At Home';
    let charIndex = 0;

    // ── Phase 1: Type each character one by one ──
    const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
            typingEl.textContent += fullText[charIndex];
            charIndex++;
        } else {
            clearInterval(typeInterval);
            // ── Phase 2: Pause 0.8s, then slide up & fade out ──
            setTimeout(() => {
                splash.style.transform = 'translateY(-100%)';
                splash.style.opacity = '0';
                splash.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.75s ease';
                // ── Phase 3: Remove from DOM after animation completes ──
                setTimeout(() => {
                    splash.remove();
                    document.body.classList.remove('splash-active');
                    document.body.style.overflow = '';
                }, 800);
            }, 800);
        }
    }, 80); // 80ms per character → ~1.6 s for full phrase
})();
// ──────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: false,       // ← replay every time element enters viewport
            mirror: true,      // ← also animate when scrolling back up
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Sticky Header Scroll Effect
    const header = document.getElementById('navbar-container');
    const headerLogo = document.getElementById('navbar-logo-text');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.remove('bg-transparent', 'py-5');
                header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'py-3', 'border-b', 'border-blue-100');
                if (headerLogo) {
                    headerLogo.classList.remove('text-white');
                    headerLogo.classList.add('text-brand-primary');
                }
            } else {
                header.classList.add('bg-transparent', 'py-5');
                header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'py-3', 'border-b', 'border-blue-100');
                // Only make it text-white if we are on pages that have dark heroes.
                // Let's dynamically check if the nav needs light text or dark text on top
                const isHeroLight = document.body.classList.contains('light-hero');
                if (headerLogo) {
                    if (isHeroLight) {
                        headerLogo.classList.add('text-brand-primary');
                        headerLogo.classList.remove('text-white');
                    } else {
                        headerLogo.classList.add('text-white');
                        headerLogo.classList.remove('text-brand-primary');
                    }
                }
            }
        });
        
        // Initial trigger to set right classes
        window.dispatchEvent(new Event('scroll'));
    }

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = mobileMenuBtn ? mobileMenuBtn.querySelectorAll('span') : [];

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            // Toggle hamburger icon animation
            if (hamburgerLines.length >= 3) {
                hamburgerLines[0].classList.toggle('rotate-45');
                hamburgerLines[0].classList.toggle('translate-y-2');
                hamburgerLines[1].classList.toggle('opacity-0');
                hamburgerLines[2].classList.toggle('-rotate-45');
                hamburgerLines[2].classList.toggle('-translate-y-2');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    if (hamburgerLines.length >= 3) {
                        hamburgerLines[0].classList.remove('rotate-45', 'translate-y-2');
                        hamburgerLines[1].classList.remove('opacity-0');
                        hamburgerLines[2].classList.remove('-rotate-45', '-translate-y-2');
                    }
                }
            }
        });
    }

    // 5. Counters Animation (using Intersection Observer)
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length > 0) {
        const countUp = (counterEl) => {
            const target = +counterEl.getAttribute('data-target');
            const suffix = counterEl.getAttribute('data-suffix') || '';
            const duration = 1500; // 1.5 seconds animation
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic Ease-Out
                    const currentValue = Math.floor(easeProgress * target);
                    counterEl.textContent = currentValue + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counterEl.textContent = target + suffix;
                }
            };

            requestAnimationFrame(updateCount);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 6. Testimonial Carousel/Slider (Autoplay & manual controls)
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (testimonialSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            testimonialSlides.forEach((slide, idx) => {
                slide.classList.add('hidden', 'opacity-0');
                slide.classList.remove('flex', 'opacity-100');
                if (testimonialDots[idx]) {
                    testimonialDots[idx].classList.remove('bg-brand-primary', 'w-6');
                    testimonialDots[idx].classList.add('bg-blue-200', 'w-2');
                }
            });

            testimonialSlides[index].classList.remove('hidden', 'opacity-0');
            testimonialSlides[index].classList.add('flex', 'opacity-100');
            if (testimonialDots[index]) {
                testimonialDots[index].classList.add('bg-brand-primary', 'w-6');
                testimonialDots[index].classList.remove('bg-blue-200', 'w-2');
            }
            currentSlide = index;
        };

        const nextSlide = () => {
            let next = (currentSlide + 1) % testimonialSlides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            let prev = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            showSlide(prev);
        };

        const startAutoplay = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoplay = () => {
            clearInterval(slideInterval);
        };

        // Add Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
        }

        testimonialDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                showSlide(idx);
                startAutoplay();
            });
        });

        // Initialize Slider
        showSlide(0);
        startAutoplay();

        // Pause autoplay when hovering
        const sliderContainer = document.querySelector('.testimonial-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoplay);
            sliderContainer.addEventListener('mouseleave', startAutoplay);
        }
    }

    // 7. Contact Form Handler (Validaion & Toast Alert)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather input fields
            const nameVal = document.getElementById('fullname')?.value.trim();
            const phoneVal = document.getElementById('phone')?.value.trim();
            const emailVal = document.getElementById('email')?.value.trim();
            const serviceVal = document.getElementById('service')?.value;
            const messageVal = document.getElementById('message')?.value.trim();

            if (!nameVal || !phoneVal || !emailVal || !serviceVal || !messageVal) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            // Simple email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simple phone validation regex (basic check for numbers, length)
            const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
            if (!phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
                showToast('Please enter a valid phone number.', 'error');
                return;
            }

            // Successful Submit Action: show toast and clear form
            showToast('Thank you! Your request has been sent. We will get back to you shortly.', 'success');
            contactForm.reset();
        });
    }

    // Toast Alert Helper
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `flex items-center p-4 mb-4 text-sm rounded-xl shadow-lg border transition-all duration-500 transform translate-y-2 opacity-0 select-none`;
        
        if (type === 'success') {
            toast.className += ' bg-teal-50 border-teal-200 text-teal-800';
            toast.innerHTML = `
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-teal-500 bg-teal-100 rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3 font-semibold">${message}</div>
            `;
        } else {
            toast.className += ' bg-rose-50 border-rose-200 text-rose-800';
            toast.innerHTML = `
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-rose-500 bg-rose-100 rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3 font-semibold">${message}</div>
            `;
        }

        toastContainer.appendChild(toast);
        
        // Trigger entry animation
        setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 10);

        // Auto remove toast
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-2', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-24 right-5 z-50 flex flex-col max-w-sm w-full pointer-events-none';
        document.body.appendChild(container);
        return container;
    }
});
