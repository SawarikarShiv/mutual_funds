// Authentication Module for Infinity Mutual Funds
const Auth = {
    // Check if user is logged in
    isAuthenticated: function() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Get current user
    getCurrentUser: function() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Login user
    login: function(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Remove password from stored user object for security
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }
        
        return { success: false, message: 'Invalid email or password' };
    },

    // Register new user
    register: function(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }
        
        // Create user object
        const newUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: `${userData.firstName} ${userData.lastName}`,
            ...userData,
            avatar: (userData.firstName[0] + userData.lastName[0]).toUpperCase(),
            createdDate: new Date().toISOString(),
            portfolio: {
                value: 500000,
                investments: [],
                lastUpdated: new Date().toISOString()
            }
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Remove password from stored user object
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        return { success: true, user: userWithoutPassword };
    },

    // Logout user
    logout: function() {
        localStorage.removeItem('currentUser');
        return { success: true };
    },

    // Update user profile
    updateProfile: function(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Not authenticated' };
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Update user data
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user session
            const { password, ...updatedUser } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            return { success: true, user: updatedUser };
        }
        
        return { success: false, message: 'User not found' };
    },

    // Change password
    changePassword: function(currentPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Not authenticated' };
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Verify current password
            if (users[userIndex].password !== currentPassword) {
                return { success: false, message: 'Current password is incorrect' };
            }
            
            // Update password
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            return { success: true };
        }
        
        return { success: false, message: 'User not found' };
    },

    // Get all users (admin function)
    getAllUsers: function() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        // Remove passwords before returning
        return users.map(({ password, ...user }) => user);
    },

    // Initialize demo users if none exist
    initializeDemoData: function() {
        if (!localStorage.getItem('users')) {
            const demoUsers = [
                {
                    id: 'user_demo_1',
                    name: 'Amit Sharma',
                    firstName: 'Amit',
                    lastName: 'Sharma',
                    email: 'amit@example.com',
                    password: 'password123',
                    phone: '9876543210',
                    avatar: 'AS',
                    createdDate: new Date().toISOString(),
                    portfolio: {
                        value: 2478560,
                        investments: [
                            { fund: 'SBI Bluechip Fund', amount: 500000, date: '2024-01-15' },
                            { fund: 'HDFC Balanced Advantage', amount: 750000, date: '2024-03-20' },
                            { fund: 'ICICI Prudential Bond', amount: 300000, date: '2024-05-10' }
                        ],
                        lastUpdated: new Date().toISOString()
                    }
                },
                {
                    id: 'user_demo_2',
                    name: 'Priya Patel',
                    firstName: 'Priya',
                    lastName: 'Patel',
                    email: 'priya@example.com',
                    password: 'password123',
                    phone: '9876543211',
                    avatar: 'PP',
                    createdDate: new Date().toISOString(),
                    portfolio: {
                        value: 1850000,
                        investments: [
                            { fund: 'Axis Bluechip Fund', amount: 600000, date: '2024-02-10' },
                            { fund: 'Kotak Emerging Equity', amount: 450000, date: '2024-04-15' }
                        ],
                        lastUpdated: new Date().toISOString()
                    }
                },
                // Additional demo user for testing
                {
                    id: 'user_demo_3',
                    name: 'Demo User',
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@example.com',
                    password: 'demo123',
                    phone: '9876543212',
                    avatar: 'DU',
                    createdDate: new Date().toISOString(),
                    portfolio: {
                        value: 1500000,
                        investments: [
                            { fund: 'Nifty 50 Index Fund', amount: 800000, date: '2024-01-10' },
                            { fund: 'Tata Digital India Fund', amount: 400000, date: '2024-03-25' }
                        ],
                        lastUpdated: new Date().toISOString()
                    }
                }
            ];
            
            localStorage.setItem('users', JSON.stringify(demoUsers));
            console.log('Demo users initialized');
        }
    }
};

// Initialize demo data on load
Auth.initializeDemoData();

// Authentication form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]')?.value || 
                         this.querySelector('input[type="text"]')?.value;
            const password = this.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                showMessage('Please enter both email and password', 'error');
                return;
            }
            
            const result = Auth.login(email, password);
            
            if (result.success) {
                // Store additional info for compatibility
                localStorage.setItem('infinity_user', result.user.name || result.user.email);
                localStorage.setItem('infinity_auth', 'true');
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showMessage(result.message || 'Invalid credentials. Try: demo@example.com / demo123', 'error');
            }
        });
    }
    
    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: this.querySelector('#firstName')?.value,
                lastName: this.querySelector('#lastName')?.value,
                email: this.querySelector('#email')?.value,
                password: this.querySelector('#password')?.value,
                phone: this.querySelector('#phone')?.value,
                agreeTerms: this.querySelector('#agreeTerms')?.checked
            };
            
            // Validate form
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                showMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (!formData.agreeTerms) {
                showMessage('You must agree to the terms and conditions', 'error');
                return;
            }
            
            const result = Auth.register(formData);
            
            if (result.success) {
                // Store additional info for compatibility
                localStorage.setItem('infinity_user', result.user.name || result.user.email);
                localStorage.setItem('infinity_auth', 'true');
                
                showMessage('Registration successful! Redirecting...', 'success');
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        });
    }
    
    // Logout button handler
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            Auth.logout();
            localStorage.removeItem('infinity_auth');
            localStorage.removeItem('infinity_user');
            window.location.href = 'index.html';
        });
    });
    
    // Profile update handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: this.querySelector('#firstName')?.value,
                lastName: this.querySelector('#lastName')?.value,
                email: this.querySelector('#email')?.value,
                phone: this.querySelector('#phone')?.value
            };
            
            const result = Auth.updateProfile(formData);
            
            if (result.success) {
                showMessage('Profile updated successfully!', 'success');
                // Update UI if needed
                updateUserProfileUI(result.user);
            } else {
                showMessage(result.message, 'error');
            }
        });
    }
    
    // Password change handler
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = this.querySelector('#currentPassword')?.value;
            const newPassword = this.querySelector('#newPassword')?.value;
            const confirmPassword = this.querySelector('#confirmPassword')?.value;
            
            if (newPassword !== confirmPassword) {
                showMessage('New passwords do not match', 'error');
                return;
            }
            
            const result = Auth.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                showMessage('Password changed successfully!', 'success');
                this.reset();
            } else {
                showMessage(result.message, 'error');
            }
        });
    }
});

// Utility function to show messages
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.padding = '10px 15px';
    messageDiv.style.margin = '10px 0';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.fontSize = '14px';
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#fee';
        messageDiv.style.color = '#c33';
        messageDiv.style.border = '1px solid #fcc';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#efe';
        messageDiv.style.color = '#3a3';
        messageDiv.style.border = '1px solid #cfc';
    } else {
        messageDiv.style.backgroundColor = '#eef';
        messageDiv.style.color = '#33a';
        messageDiv.style.border = '1px solid #ccf';
    }
    
    // Insert message before the form
    const form = document.getElementById('loginForm') || 
                 document.getElementById('registerForm') ||
                 document.getElementById('profileForm') ||
                 document.getElementById('changePasswordForm');
    
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    } else {
        document.body.insertBefore(messageDiv, document.body.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Update user profile UI (can be customized based on your UI)
function updateUserProfileUI(user) {
    // Update avatar if element exists
    const avatarElement = document.querySelector('.user-avatar, .avatar');
    if (avatarElement && user.avatar) {
        avatarElement.textContent = user.avatar;
    }
    
    // Update name if element exists
    const nameElement = document.querySelector('.user-name, .profile-name');
    if (nameElement && user.name) {
        nameElement.textContent = user.name;
    }
    
    // Update email if element exists
    const emailElement = document.querySelector('.user-email, .profile-email');
    if (emailElement && user.email) {
        emailElement.textContent = user.email;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}

// Add global access for debugging (optional)
window.Auth = Auth;