// Utility functions
class Utils {
    // Format currency
    static formatCurrency(amount, currency = '₹') {
        if (amount >= 10000000) {
            return `${currency}${(amount / 10000000).toFixed(2)}Cr`;
        } else if (amount >= 100000) {
            return `${currency}${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) {
            return `${currency}${(amount / 1000).toFixed(1)}K`;
        }
        return `${currency}${amount}`;
    }

    // Format percentage
    static formatPercentage(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }

    // Debounce function
    static debounce(func, wait) {
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

    // Validate email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone
    static validatePhone(phone) {
        const re = /^[\d\s\+\-\(\)]{10,}$/;
        return re.test(phone);
    }

    // Generate random ID
    static generateId(prefix = '') {
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    // Copy to clipboard
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Show notification
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add CSS for notifications
    static initNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    border-radius: 10px;
                    background: rgba(30, 41, 59, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                }
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                .notification-success {
                    border-left: 4px solid #10b981;
                }
                .notification-error {
                    border-left: 4px solid #ef4444;
                }
                .notification-info {
                    border-left: 4px solid #3b82f6;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize notifications
Utils.initNotificationStyles();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}