// Dashboard functionality
document.querySelector('.logout-btn')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('infinity_auth');
        localStorage.removeItem('infinity_user');
        window.location.href = 'login.html';
    }
});

// Update username from localStorage
const savedUser = localStorage.getItem('infinity_user');
if (savedUser && document.querySelector('.username')) {
    document.querySelector('.username').textContent = savedUser;
}