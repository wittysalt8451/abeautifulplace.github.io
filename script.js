/* ============================================
   LEBANON HANOVER DOCUMENTARY
   JavaScript for navigation and interactions
   ============================================ */

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileNav();
    initActiveNavHighlight();
});


/**
 * SMOOTH SCROLL
 * Handles smooth scrolling for anchor links
 * Accounts for sticky navigation height
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Scroll to element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}


/**
 * MOBILE NAVIGATION
 * Toggle menu on mobile devices
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navToggle || !navContainer) return;
    
    navToggle.addEventListener('click', function() {
        const isOpen = navContainer.classList.contains('is-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const nav = document.querySelector('.nav');
        if (!nav.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (navToggle && navContainer) {
        navToggle.classList.add('is-open');
        navContainer.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
    }
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (navToggle && navContainer) {
        navToggle.classList.remove('is-open');
        navContainer.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
}


/**
 * ACTIVE NAV HIGHLIGHT
 * Highlights the current section in navigation while scrolling
 * Uses Intersection Observer for performance
 */
function initActiveNavHighlight() {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) return;
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(function(link) {
                    link.classList.remove('is-active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
                if (activeLink) {
                    activeLink.classList.add('is-active');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    });
    
    // Observe each section
    sections.forEach(function(section) {
        observer.observe(section);
    });
}


/**
 * Add active state styling for nav links
 * This is added via JS to keep CSS simpler
 */
(function addActiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.is-active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
})();
