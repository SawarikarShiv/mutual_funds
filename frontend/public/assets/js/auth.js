// Authentication functions
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Demo authentication
    const demoUsers = ['demo', 'admin', 'user', 'test'];
    const demoPasswords = ['demo123', 'admin123', 'password', 'test123'];
    
    if ((demoUsers.includes(username.toLowerCase()) || username.includes('@')) && 
        demoPasswords.includes(password)) {
        
        localStorage.setItem('infinity_auth', 'true');
        localStorage.setItem('infinity_user', username);
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials. Try: demo / demo123');
    }
});