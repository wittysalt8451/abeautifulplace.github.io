/* ============================================
   A BEAUTIFUL PLACE - Documentary Website
   Minimal JavaScript for enhanced UX
   ============================================ */

/**
 * Initialize the website functionality
 * Called when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initScrollIndicator();
    initFadeInOnScroll();
});


/**
 * SMOOTH SCROLL
 * Handles smooth scrolling for anchor links
 * Already supported by CSS scroll-behavior, but this adds extra control
 */
function initSmoothScroll() {
    // Get all anchor links that point to sections on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


/**
 * SCROLL INDICATOR
 * Hides the scroll indicator when user scrolls down
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    let hasScrolled = false;
    
    window.addEventListener('scroll', function() {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
            
            // Remove from DOM after fade out
            setTimeout(function() {
                scrollIndicator.style.display = 'none';
            }, 500);
        }
    }, { passive: true });
}


/**
 * FADE IN ON SCROLL
 * Subtle fade-in effect for sections as they enter viewport
 * Uses Intersection Observer for performance
 */
function initFadeInOnScroll() {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) return;
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Select all sections except hero (hero is visible immediately)
    const sections = document.querySelectorAll('.synopsis, .quotes, .details, .footer');
    
    // Set initial state
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,      // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px'  // Slight offset from bottom
    });
    
    // Observe each section
    sections.forEach(function(section) {
        observer.observe(section);
    });
}


/**
 * UTILITY: Debounce function
 * Limits how often a function can be called
 * Useful for scroll/resize handlers (not currently used but available)
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


/**
 * UTILITY: Check if element is in viewport
 * Can be used for custom scroll effects
 * 
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is visible
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
