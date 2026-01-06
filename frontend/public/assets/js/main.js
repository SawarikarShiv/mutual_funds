// Main JavaScript file for Infinity Mutual Funds

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Infinity Mutual Funds - Main JS Loaded');
    
    // Initialize all modules
    initNavigation();
    initAnimations();
    initScrollEffects();
    initTooltips();
    initForms();
});

// Navigation Module
function initNavigation() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                const menuToggle = document.getElementById('mobileMenuToggle');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
}

// Animations Module
function initAnimations() {
    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat h3');
    
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, {
            threshold: 0.5
        });
        
        stats.forEach(stat => observer.observe(stat));
    }
}

// Counter Animation
function animateCounter(element) {
    const finalValue = element.textContent;
    const isCurrency = finalValue.includes('₹');
    const isPercentage = finalValue.includes('%');
    
    // Extract numeric value
    let number = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
    
    let startValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        let currentValue = startValue + (number - startValue) * easeOut;
        
        if (isCurrency) {
            if (finalValue.includes('Cr')) {
                element.textContent = `₹${Math.floor(currentValue).toLocaleString()}Cr+`;
            } else {
                element.textContent = `₹${Math.floor(currentValue).toLocaleString()}`;
            }
        } else if (isPercentage) {
            element.textContent = `${currentValue.toFixed(1)}%`;
        } else {
            element.textContent = `${Math.floor(currentValue).toLocaleString()}+`;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Scroll Effects
function initScrollEffects() {
    // Add scroll class to navbar
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
            
            // Fade in elements on scroll
            fadeInOnScroll();
        });
    }
    
    // Initial fade in check
    fadeInOnScroll();
}

// Fade in elements on scroll
function fadeInOnScroll() {
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-fade');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.opacity = '1';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Form Validation
function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                this.submit();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    
    // Clear previous errors
    clearInputError(input);
    
    if (!value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showInputError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Number validation
    if (type === 'number') {
        const numValue = parseFloat(value);
        const min = parseFloat(input.getAttribute('min'));
        const max = parseFloat(input.getAttribute('max'));
        
        if (!isNaN(min) && numValue < min) {
            showInputError(input, `Value must be at least ${min}`);
            return false;
        }
        
        if (!isNaN(max) && numValue > max) {
            showInputError(input, `Value must be at most ${max}`);
            return false;
        }
    }
    
    // Phone validation
    if (input.name === 'phone') {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showInputError(input, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showInputError(input, message) {
    input.classList.add('error');
    
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('form-error')) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
}

function clearInputError(input) {
    input.classList.remove('error');
    
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.remove();
    }
}

// Utility Functions
window.InfinityFunds = {
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: function(phone) {
        const re = /^[\d\s\+\-\(\)]{10,}$/;
        return re.test(phone);
    },
    
    formatCurrency: function(amount) {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else {
            return `₹${amount.toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            })}`;
        }
    },
    
    formatPercentage: function(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },
    
    formatDateTime: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },
    
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    showNotification: function(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        
        const icon = icons[type] || 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    },
    
    getRandomColor: function() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
            '#fa709a', '#fee140', '#30cfd0', '#330867'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    generateGradient: function(color1, color2) {
        return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
    }
};

// Export for use in other scripts
console.log('Infinity Funds JS utilities loaded successfully!');