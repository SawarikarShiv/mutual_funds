// assets/js/admin-auth.js

const AdminAuth = {
    // Check if admin is authenticated
    isAuthenticated() {
        try {
            const adminData = localStorage.getItem('admin_data');
            if (!adminData) return false;
            
            const admin = JSON.parse(adminData);
            
            // Check session expiry (24 hours)
            const loginTime = admin.login_time;
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
            const isExpired = (Date.now() - loginTime) > sessionDuration;
            
            if (isExpired) {
                this.logout();
                return false;
            }
            
            return admin;
        } catch (error) {
            console.error('Auth check error:', error);
            this.logout();
            return false;
        }
    },
    
    // Logout function
    logout() {
        try {
            localStorage.removeItem('admin_data');
            localStorage.removeItem('admin_saved_email');
            localStorage.removeItem('admin_remember_me');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },
    
    // Get current admin
    getCurrentAdmin() {
        return this.isAuthenticated();
    },
    
    // Check permission
    hasPermission(requiredRole) {
        const admin = this.getCurrentAdmin();
        if (!admin) return false;
        
        const rolesHierarchy = {
            'support': 1,
            'manager': 2,
            'admin': 3,
            'super_admin': 4
        };
        
        const adminRole = admin.role.toLowerCase();
        const requiredLevel = rolesHierarchy[requiredRole.toLowerCase()] || 0;
        const adminLevel = rolesHierarchy[adminRole] || 0;
        
        return adminLevel >= requiredLevel;
    },
    
    // Protect admin routes
    protectRoute(requiredRole = 'admin') {
        const admin = this.isAuthenticated();
        
        if (!admin) {
            // Redirect to login
            window.location.href = 'admin-login.html';
            return false;
        }
        
        if (!this.hasPermission(requiredRole)) {
            // Show permission denied
            this.showPermissionDenied();
            return false;
        }
        
        return true;
    },
    
    // Show permission denied
    showPermissionDenied() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <div style="font-size: 120px; margin-bottom: 20px;">
                        <i class="fas fa-ban"></i>
                    </div>
                    <h1 style="font-size: 36px; margin-bottom: 10px;">Permission Denied</h1>
                    <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                        You don't have permission to access this page.
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <a href="admin.html" style="
                            padding: 12px 24px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 10px;
                            color: white;
                            text-decoration: none;
                            font-weight: 500;
                            transition: all 0.3s;
                            backdrop-filter: blur(10px);
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                        onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            <i class="fas fa-arrow-left"></i> Back to Dashboard
                        </a>
                        <button onclick="AdminAuth.logoutAndRedirect()" style="
                            padding: 12px 24px;
                            background: rgba(239, 68, 68, 0.2);
                            border-radius: 10px;
                            color: white;
                            border: none;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.3s;
                            backdrop-filter: blur(10px);
                        " onmouseover="this.style.background='rgba(239,68,68,0.3)'" 
                        onmouseout="this.style.background='rgba(239,68,68,0.2)'">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Logout and redirect
    logoutAndRedirect() {
        this.logout();
        window.location.href = 'admin-login.html';
    },
    
    // Add admin menu items based on role
    setupAdminMenu() {
        const admin = this.getCurrentAdmin();
        if (!admin) return;
        
        // Hide/show menu items based on role
        const role = admin.role.toLowerCase();
        
        if (role.includes('support')) {
            // Hide sensitive options for support
            document.querySelectorAll('[data-role="admin"]').forEach(el => {
                el.style.display = 'none';
            });
        }
        
        // Update admin info in sidebar
        const adminName = document.getElementById('adminName');
        const adminEmail = document.getElementById('adminEmail');
        const adminAvatar = document.getElementById('adminAvatar');
        const adminRole = document.querySelector('.admin-role');
        
        if (adminName && admin.name) adminName.textContent = admin.name;
        if (adminEmail && admin.email) adminEmail.textContent = admin.email;
        if (adminRole && admin.role) adminRole.textContent = admin.role;
        
        if (adminAvatar && admin.avatar) {
            adminAvatar.textContent = admin.avatar;
        } else if (admin.name) {
            const initials = admin.name.split(' ').map(n => n[0]).join('').toUpperCase();
            adminAvatar.textContent = initials.substring(0, 2);
        }
    }
};

// Auto-protect admin pages
if (window.location.pathname.includes('admin') && 
    !window.location.pathname.includes('admin-login')) {
    document.addEventListener('DOMContentLoaded', function() {
        if (AdminAuth.protectRoute()) {
            AdminAuth.setupAdminMenu();
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
} else {
    window.AdminAuth = AdminAuth;
}