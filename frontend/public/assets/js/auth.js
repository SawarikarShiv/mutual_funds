// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.updateUI();
        this.setupEventListeners();
    }

    loadUser() {
        try {
            const userData = localStorage.getItem('infinity_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            this.currentUser = null;
        }
    }

    saveUser(user) {
        try {
            localStorage.setItem('infinity_user', JSON.stringify(user));
            this.currentUser = user;
            this.updateUI();
            Utils.showNotification('Login successful!', 'success');
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            Utils.showNotification('Error saving user data', 'error');
            return false;
        }
    }

    logout() {
        localStorage.removeItem('infinity_user');
        this.currentUser = null;
        this.updateUI();
        Utils.showNotification('Logged out successfully', 'success');
        return true;
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userGreetingName = document.getElementById('userGreetingName');
        const userInitials = document.getElementById('userInitials');

        if (this.isLoggedIn()) {
            // User is logged in
            if (authButtons) authButtons.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            
            // Update user info
            if (userGreetingName) {
                userGreetingName.textContent = this.currentUser.name.split(' ')[0];
            }
            if (userInitials) {
                const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                userInitials.textContent = initials;
            }
        } else {
            // User is not logged in
            if (authButtons) authButtons.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
        }
    }

    async login(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo credentials
        if (email === 'demo@infinityfunds.com' && password === 'demo123') {
            return {
                success: true,
                user: {
                    id: 1,
                    name: 'Demo User',
                    email: email,
                    phone: '+91 98765 43210',
                    joined: new Date().toISOString().split('T')[0],
                    plan: 'free'
                }
            };
        }

        // Check for existing users
        const users = JSON.parse(localStorage.getItem('infinity_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Remove password before saving
            const { password, ...userWithoutPassword } = user;
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, message: 'Invalid email or password' };
    }

    async register(userData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('infinity_users') || '[]');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            ...userData,
            joined: new Date().toISOString().split('T')[0],
            plan: 'free'
        };

        // Save to users list
        users.push(newUser);
        localStorage.setItem('infinity_users', JSON.stringify(users));

        // Remove password before returning
        const { password, ...userWithoutPassword } = newUser;
        return { success: true, user: userWithoutPassword };
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // User dropdown
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userAvatarBtn) {
            userAvatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdown && !userDropdown.contains(e.target) && userAvatarBtn && !userAvatarBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to sign out?')) {
                    this.logout();
                    if (userDropdown) userDropdown.classList.remove('show');
                    
                    // Redirect to home page if on dashboard
                    if (window.location.pathname.includes('dashboard.html')) {
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }
                }
            });
        }
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthSystem();
});