// js/users.js
document.addEventListener('DOMContentLoaded', function() {
    loadUsersTable();
    setupEventListeners();
});

function loadUsersTable() {
    const users = [
        {
            id: 'ADM001',
            name: 'John Marpung',
            email: 'john@infinitymf.com',
            role: 'admin',
            status: 'active',
            lastLogin: 'Today, 10:30 AM'
        },
        {
            id: 'ADV045',
            name: 'Sarah Johnson',
            email: 'sarah@infinitymf.com',
            role: 'advisor',
            status: 'active',
            lastLogin: 'Yesterday, 3:45 PM'
        },
        {
            id: 'INV789',
            name: 'Rajesh Kumar',
            email: 'rajesh@email.com',
            role: 'investor',
            status: 'active',
            lastLogin: '2 days ago'
        },
        {
            id: 'INV790',
            name: 'Priya Sharma',
            email: 'priya@email.com',
            role: 'investor',
            status: 'pending',
            lastLogin: 'Never'
        },
        {
            id: 'ADM002',
            name: 'Robert Chen',
            email: 'robert@infinitymf.com',
            role: 'admin',
            status: 'active',
            lastLogin: 'Today, 9:15 AM'
        }
    ];
    
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Role badge
        let roleBadge = '';
        if (user.role === 'admin') {
            roleBadge = '<span class="role-badge role-admin">Administrator</span>';
        } else if (user.role === 'advisor') {
            roleBadge = '<span class="role-badge role-advisor">Advisor</span>';
        } else {
            roleBadge = '<span class="role-badge role-investor">Investor</span>';
        }
        
        // Status badge
        let statusBadge = '';
        if (user.status === 'active') {
            statusBadge = '<span class="status-badge status-active">Active</span>';
        } else if (user.status === 'pending') {
            statusBadge = '<span class="status-badge status-pending">Pending</span>';
        } else {
            statusBadge = '<span class="status-badge status-inactive">Inactive</span>';
        }
        
        row.innerHTML = `
            <td><strong>${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${roleBadge}</td>
            <td>${statusBadge}</td>
            <td>${user.lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search users..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }
    
    // Role filter
    const roleFilter = document.querySelector('select');
    if (roleFilter) {
        roleFilter.addEventListener('change', function(e) {
            const role = e.target.value;
            filterUsersByRole(role);
        });
    }
    
    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewUser();
        });
    }
}

function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterUsersByRole(role) {
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
        const roleText = row.cells[3].textContent.toLowerCase();
        if (!role || roleText.includes(role) || roleText === role) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function openAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.remove('active');
    document.getElementById('addUserForm').reset();
}

function addNewUser() {
    const form = document.getElementById('addUserForm');
    const formData = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        role: form.querySelector('select').value,
        password: form.querySelector('input[type="password"]').value
    };
    
    // Generate user ID
    const lastId = 'ADM002'; // In production, get from backend
    const prefix = formData.role === 'admin' ? 'ADM' : formData.role === 'advisor' ? 'ADV' : 'INV';
    const lastNumber = parseInt(lastId.replace(/[^\d]/g, '')) || 0;
    const newId = prefix + String(lastNumber + 1).padStart(3, '0');
    
    // Create new user object
    const newUser = {
        id: newId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active',
        lastLogin: 'Never'
    };
    
    // Show success message
    showToast(`User ${newUser.name} created successfully!`, 'success');
    
    // Close modal
    closeAddUserModal();
    
    // Reload table
    setTimeout(() => {
        loadUsersTable();
    }, 500);
}

function editUser(userId) {
    alert(`Edit user ${userId} - This would open edit modal in production`);
    // In production, this would:
    // 1. Fetch user details from backend
    // 2. Open edit modal with pre-filled data
    // 3. Update user on form submit
}

function deleteUser(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
        showToast(`User ${userId} deleted successfully!`, 'success');
        
        // In production, this would:
        // 1. Send DELETE request to backend API
        // 2. Remove user from table on success
        // 3. Show appropriate error/success message
    }
}

// Export users to CSV
function exportUsers() {
    // In production, this would:
    // 1. Fetch all users from backend
    // 2. Convert to CSV format
    // 3. Trigger download
    showToast('Exporting users data...', 'success');
}