// Main application entry point
class InfinityApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.initializeComponents();
        this.setupAnimations();
    }

    setupGlobalEventListeners() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            // Close user dropdown
            const userDropdown = document.getElementById('userDropdown');
            const userAvatarBtn = document.getElementById('userAvatarBtn');
            
            if (userDropdown && userAvatarBtn && 
                !userDropdown.contains(e.target) && 
                !userAvatarBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }

            // Close mobile menu
            const menuToggle = document.getElementById('mobileMenuToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (menuToggle && navMenu && 
                !menuToggle.contains(e.target) && 
                !navMenu.contains(e.target) &&
                navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Escape key closes modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close user dropdown
                const userDropdown = document.getElementById('userDropdown');
                if (userDropdown) userDropdown.classList.remove('show');

                // Close mobile menu
                const menuToggle = document.getElementById('mobileMenuToggle');
                const navMenu = document.getElementById('navMenu');
                if (menuToggle && navMenu && navMenu.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                // Close auth modal
                const authModal = document.getElementById('authModal');
                if (authModal && authModal.classList.contains('show')) {
                    authModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    initializeComponents() {
        // Animate stats on home page
        this.animateStats();
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize charts if on dashboard
        if (document.querySelector('.chart-container')) {
            // Charts are initialized by chartManager
            console.log('Charts will be initialized by chartManager');
        }
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat h3');
        stats.forEach(stat => {
            if (stat.dataset.animated) return;
            
            const finalValue = stat.textContent;
            stat.textContent = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateValue(stat, 0, parseFloat(finalValue.replace(/[^0-9.]/g, '')), 2000);
                        observer.unobserve(entry.target);
                        stat.dataset.animated = 'true';
                    }
                });
            });
            
            observer.observe(stat);
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            if (element.textContent.includes('Cr')) {
                element.textContent = '₹' + current.toLocaleString() + 'Cr+';
            } else if (element.textContent.includes('%')) {
                element.textContent = current.toFixed(1) + '%';
            } else if (element.textContent.includes('+')) {
                element.textContent = current.toLocaleString() + '+';
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    initializeTooltips() {
        // Add tooltip functionality to elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = element.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-element';
                tooltip.textContent = tooltipText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 10000;
                    white-space: nowrap;
                    pointer-events: none;
                    transform: translateX(-50%);
                    left: 50%;
                    bottom: 100%;
                    margin-bottom: 5px;
                `;
                
                element.appendChild(tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = element.querySelector('.tooltip-element');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    setupAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .module-card, .stat-card').forEach(element => {
            observer.observe(element);
        });
    }

    // Helper methods for authentication (used in auth.js)
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            input.classList.remove('error');
            const errorElement = document.getElementById(`${input.id}Error`);
            if (errorElement) errorElement.classList.remove('show');

            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.classList.add('show');
                }
            } else if (input.type === 'email' && !Utils.validateEmail(input.value)) {
                isValid = false;
                input.classList.add('error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                    errorElement.classList.add('show');
                }
            } else if (input.type === 'password' && input.value.length < 6) {
                isValid = false;
                input.classList.add('error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.textContent = 'Password must be at least 6 characters';
                    errorElement.classList.add('show');
                }
            }
        });

        return isValid;
    }

    showLoading(button, isLoading) {
        if (isLoading) {
            button.innerHTML = '<span class="loading-spinner"></span> Processing...';
            button.disabled = true;
        } else {
            // Restore original content
            const originalHTML = button.dataset.originalHTML || '<i class="fas fa-sign-in-alt"></i> Sign In';
            button.innerHTML = originalHTML;
            button.disabled = false;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new InfinityApp();
});