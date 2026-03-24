// ============================================
// PORTFOLIO WEBSITE - JAVASCRIPT
// Functionality & Interactions
// ============================================

/**
 * LOADING ANIMATION
 * Fade out loader after page fully loads
 */
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 500);
    }
});

// ============================================
// NAVIGATION - HAMBURGER MENU
// ============================================

/**
 * Initialize hamburger menu toggle
 * Toggles between mobile menu open/closed states
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hamburger') && !e.target.closest('.nav-menu')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

/**
 * Handle smooth scrolling for navigation links
 * Uses smooth scroll behavior with fallback
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Get navbar height to offset scroll
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// DARK MODE TOGGLE
// ============================================

/**
 * Initialize dark mode toggle
 * Switches between light and dark themes
 * Persists preference in localStorage
 */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const htmlElement = document.documentElement;
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set initial theme based on saved preference or system preference
    if (isDarkMode) {
        enableDarkMode();
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Use system preference if no saved preference
        enableDarkMode();
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'true');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'false');
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches && !isDarkMode) {
                enableDarkMode();
            }
        });
    }
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

/**
 * Animate elements as they come into view
 * Uses Intersection Observer API for smooth, performant animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (!revealElements.length) return;

    // Create intersection observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after reveal for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

/**
 * Initialize contact form with validation and submission
 * Includes form field validation and feedback
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const feedback = document.getElementById('formFeedback');

        // Simple client-side validation
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        if (!name || !email || !subject || !message) {
            showFeedback(feedback, 'Please fill in all fields.', 'error');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback(feedback, 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend)
        try {
            // This is a demo - in production, send to your backend
            // Example: const response = await fetch('/api/contact', { method: 'POST', body: formData });
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showFeedback(feedback, 'Thank you! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Clear feedback after 5 seconds
            setTimeout(() => {
                feedback.classList.remove('success');
            }, 5000);

        } catch (error) {
            showFeedback(feedback, 'Something went wrong. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Display form feedback messages
 */
function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `form-feedback ${type}`;
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

/**
 * Add shadow to navbar when scrolling
 * Enhances visual hierarchy as user scrolls
 */
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
}

// ============================================
// ACTIVE NAVIGATION LINK INDICATOR
// ============================================

/**
 * Highlight active navigation section based on scroll position
 * Updates as user scrolls through different sections
 */
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        // Check which section is currently in view
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Remove active class from all links and add to current
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary-color)';
            } else {
                link.style.color = '';
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for optimizing scroll events
 * Limits function execution frequency
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Check if element is in viewport
 * Useful for animations and lazy loading
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

// ============================================
// TYPING ANIMATION (Optional Enhancement)
// ============================================

/**
 * Animate hero subtitle with typing effect
 * Creates engaging entrance animation
 */
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle || subtitle.textContent.length === 0) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.visibility = 'visible';

    let index = 0;
    const speed = 50; // milliseconds per character

    function type() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

// ============================================
// PAGE PERFORMANCE OPTIMIZATIONS
// ============================================

/**
 * Lazy load images for better performance
 * Uses native lazy loading with polyfill
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading support
        return;
    }

    // Polyfill for browsers without native lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// FORM FIELD VALIDATION IN REAL-TIME
// ============================================

/**
 * Add real-time validation feedback for form inputs
 */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (!value) {
        isValid = false;
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (field.name === 'message' && value.length < 10) {
        isValid = false;
    }

    if (isValid) {
        field.style.borderColor = '#4A90E2';
        field.classList.remove('error');
    } else {
        field.style.borderColor = '#EF4444';
        field.classList.add('error');
    }

    return isValid;
}

// ============================================
// IMAGE LIGHTBOX / MODAL
// ============================================

/**
 * Initialize image lightbox for portfolio and design cards
 * Allows users to view full-size images with click-to-open functionality
 */
function initImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (!lightbox || !lightboxImage || !lightboxClose) return;

    // Get all card images
    const cardImages = document.querySelectorAll('.card-image img');

    // Add click event to each card image
    cardImages.forEach(image => {
        image.style.cursor = 'pointer';
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        });
    });

    // Close lightbox on close button click
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// CAROUSEL / IMAGE SLIDER
// ============================================

/**
 * Initialize auto-sliding carousel
 * Automatically slides through images with navigation controls
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    /**
     * Update carousel position
     */
    function updateCarousel() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Update active indicator
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    /**
     * Move to next slide
     */
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }

    /**
     * Move to previous slide
     */
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }

    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateCarousel();
        resetAutoSlide();
    }

    /**
     * Start auto-slide with 5-second interval
     */
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    /**
     * Reset auto-slide timer
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Event listeners for indicator dots
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Start auto-slide on page load
    startAutoSlide();

    // Pause auto-slide on hover
    track.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    track.parentElement.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Initialize carousel display
    updateCarousel();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initHamburgerMenu();
    initSmoothScrolling();
    initDarkMode();
    initScrollReveal();
    initContactForm();
    initNavbarScrollEffect();
    initActiveNavLink();
    initFormValidation();
    initImageLightbox();
    initCarousel();
    
    // Optional animations (comment out if not needed)
    initTypingAnimation();
    initLazyLoading();

    // Log initialization complete
    console.log('Portfolio website initialized successfully!');
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handler for debugging
 */
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

// ============================================
// ANALYTICS & PERFORMANCE TRACKING (Optional)
// ============================================

/**
 * Track page performance metrics
 * Useful for monitoring and optimization
 */
function trackPerformance() {
    if (window.performance && window.performance.timing) {
        const navigationStart = window.performance.timing.navigationStart;
        const loadCompleted = window.performance.timing.loadEventEnd;
        const loadTime = loadCompleted - navigationStart;

        console.log('Page Load Time:', loadTime, 'ms');
    }
}

// Track performance when page fully loads
window.addEventListener('load', trackPerformance);
