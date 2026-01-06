// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.sidebarOpen = true;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.bindEvents();
        this.updateUI();
        this.initCharts();
    }

    checkAuth() {
        const user = localStorage.getItem('infinity_user');
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        this.currentUser = JSON.parse(user);
    }

    loadUserData() {
        // Load additional user data if needed
        // In a real app, this would make an API call
        console.log('Dashboard initialized for:', this.currentUser.name);
    }

    bindEvents() {
        // Sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // User profile dropdown
        const userProfileBtn = document.getElementById('userProfileBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }

        // Logout buttons
        const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutDropdownBtn');
        logoutBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        });

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performGlobalSearch(e.target.value);
                }
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('show');
            });
        });

        // Modal outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Initialize tooltips
        this.initTooltips();

        // Handle form submissions
        this.handleForms();

        // Handle responsive behavior
        this.handleResponsive();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar) {
            sidebar.classList.toggle('active', !this.sidebarOpen);
        }
        
        if (menuToggle) {
            menuToggle.innerHTML = this.sidebarOpen ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        }
    }

    updateUI() {
        // Update user info
        const userName = document.getElementById('userFullName');
        const userEmail = document.getElementById('userEmail');
        const userInitials = document.getElementById('userInitials');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        
        if (userInitials && this.currentUser.name) {
            const initials = this.currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            userInitials.textContent = initials;
        }

        // Update active nav item
        this.updateActiveNav();
    }

    updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const dataPage = item.getAttribute('data-page');
            if (dataPage && currentPage.includes(dataPage)) {
                item.classList.add('active');
            }
        });
    }

    initCharts() {
        // This would initialize dashboard charts
        // Chart.js is already loaded in the HTML
        console.log('Charts initialized');
    }

    initTooltips() {
        // Initialize Bootstrap-like tooltips
        const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = element.getAttribute('title');
                if (!tooltipText) return;
                
                element.removeAttribute('title');
                
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = tooltipText;
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.opacity = '1';
                
                element._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', () => {
                if (element._tooltip) {
                    element._tooltip.remove();
                    element._tooltip = null;
                }
                const tooltipText = element.getAttribute('data-original-title') || element.getAttribute('title');
                if (tooltipText) {
                    element.setAttribute('title', tooltipText);
                }
            });
        });
    }

    handleForms() {
        // Handle form validation and submission
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(form)) {
                    this.submitForm(form);
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearInputError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.hasAttribute('required');
        
        // Clear previous errors
        this.clearInputError(input);
        
        if (isRequired && !value) {
            this.showInputError(input, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Number validation
        if (type === 'number' && value) {
            const numValue = parseFloat(value);
            const min = parseFloat(input.getAttribute('min'));
            const max = parseFloat(input.getAttribute('max'));
            
            if (!isNaN(min) && numValue < min) {
                this.showInputError(input, `Value must be at least ${min}`);
                return false;
            }
            
            if (!isNaN(max) && numValue > max) {
                this.showInputError(input, `Value must be at most ${max}`);
                return false;
            }
        }
        
        // Phone validation
        if (input.name === 'phone' && value) {
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    showInputError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('form-error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        errorElement.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('error');
        
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.remove();
        }
    }

    submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, this would be an API call
            console.log('Form submitted:', data);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showNotification('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();
        }, 1500);
    }

    performGlobalSearch(query) {
        if (!query.trim()) return;
        
        // In a real app, this would search across the entire application
        console.log('Global search:', query);
        
        // For now, just show a notification
        this.showNotification(`Searching for "${query}"...`, 'info');
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('infinity_user');
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.toast').forEach(toast => {
            toast.remove();
        });
        
        // Create new notification
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
    }

    handleResponsive() {
        // Check screen width and adjust sidebar
        const checkScreenSize = () => {
            if (window.innerWidth <= 1024) {
                this.sidebarOpen = false;
                const sidebar = document.getElementById('sidebar');
                const menuToggle = document.getElementById('menuToggle');
                
                if (sidebar) sidebar.classList.add('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                this.sidebarOpen = true;
                const sidebar = document.getElementById('sidebar');
                const menuToggle = document.getElementById('menuToggle');
                
                if (sidebar) sidebar.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        };
        
        // Check on load
        checkScreenSize();
        
        // Check on resize
        window.addEventListener('resize', debounce(checkScreenSize, 250));
        
        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }

    // Utility functions
    formatCurrency(amount) {
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
    }

    formatPercentage(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    getRandomColor() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
            '#fa709a', '#fee140', '#30cfd0', '#330867'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateGradient(color1, color2) {
        return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
    }
}

// Export for global use
window.Dashboard = Dashboard;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Add custom tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            white-space: nowrap;
            animation: fadeIn 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .custom-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.9);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});