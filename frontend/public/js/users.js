// js/users.js - User Management Functions

let usersData = [];
let filteredUsers = [];
let currentUserPage = 1;
const usersPerPage = 15;

document.addEventListener('DOMContentLoaded', function() {
    initializeUsersPage();
});

function initializeUsersPage() {
    loadUsersData();
    setupUsersListeners();
    updateUserStats();
}

function loadUsersData() {
    // Sample user data
    usersData = [
        {
            id: 1,
            name: 'Rahul Sharma',
            email: 'rahul.sharma@email.com',
            phone: '+91 9876543210',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-01-15',
            lastLogin: '2024-01-14 10:30',
            totalInvestment: 1250000,
            portfolioValue: 1450000,
            kycStatus: 'Verified',
            panNumber: 'ABCDE1234F'
        },
        {
            id: 2,
            name: 'Priya Patel',
            email: 'priya.patel@email.com',
            phone: '+91 9876543211',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-02-20',
            lastLogin: '2024-01-14 09:15',
            totalInvestment: 850000,
            portfolioValue: 950000,
            kycStatus: 'Verified',
            panNumber: 'BCDEF1234G'
        },
        {
            id: 3,
            name: 'Amit Kumar',
            email: 'amit.kumar@email.com',
            phone: '+91 9876543212',
            userType: 'Distributor',
            status: 'Active',
            registrationDate: '2023-03-10',
            lastLogin: '2024-01-13 14:20',
            totalInvestment: 0,
            portfolioValue: 0,
            kycStatus: 'Pending',
            panNumber: 'CDEFG1234H',
            distributorCode: 'DIST001'
        },
        {
            id: 4,
            name: 'Sneha Gupta',
            email: 'sneha.gupta@email.com',
            phone: '+91 9876543213',
            userType: 'Investor',
            status: 'Inactive',
            registrationDate: '2023-04-05',
            lastLogin: '2023-12-20 11:45',
            totalInvestment: 450000,
            portfolioValue: 480000,
            kycStatus: 'Verified',
            panNumber: 'DEFGH1234I'
        },
        {
            id: 5,
            name: 'Vikram Singh',
            email: 'vikram.singh@email.com',
            phone: '+91 9876543214',
            userType: 'Admin',
            status: 'Active',
            registrationDate: '2023-01-01',
            lastLogin: '2024-01-14 08:00',
            totalInvestment: 0,
            portfolioValue: 0,
            kycStatus: 'Verified',
            panNumber: 'EFGHI1234J',
            role: 'Administrator'
        },
        {
            id: 6,
            name: 'Anjali Mehta',
            email: 'anjali.mehta@email.com',
            phone: '+91 9876543215',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-05-12',
            lastLogin: '2024-01-14 16:30',
            totalInvestment: 2200000,
            portfolioValue: 2500000,
            kycStatus: 'Verified',
            panNumber: 'FGHIJ1234K'
        },
        {
            id: 7,
            name: 'Rajesh Nair',
            email: 'rajesh.nair@email.com',
            phone: '+91 9876543216',
            userType: 'Distributor',
            status: 'Suspended',
            registrationDate: '2023-06-18',
            lastLogin: '2024-01-10 13:15',
            totalInvestment: 0,
            portfolioValue: 0,
            kycStatus: 'Rejected',
            panNumber: 'GHIJK1234L',
            distributorCode: 'DIST002'
        },
        {
            id: 8,
            name: 'Meera Reddy',
            email: 'meera.reddy@email.com',
            phone: '+91 9876543217',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-07-22',
            lastLogin: '2024-01-14 12:00',
            totalInvestment: 750000,
            portfolioValue: 820000,
            kycStatus: 'Pending',
            panNumber: 'HIJKL1234M'
        },
        {
            id: 9,
            name: 'Karan Malhotra',
            email: 'karan.malhotra@email.com',
            phone: '+91 9876543218',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-08-30',
            lastLogin: '2024-01-13 17:45',
            totalInvestment: 3200000,
            portfolioValue: 3800000,
            kycStatus: 'Verified',
            panNumber: 'IJKLM1234N'
        },
        {
            id: 10,
            name: 'Neha Choudhary',
            email: 'neha.choudhary@email.com',
            phone: '+91 9876543219',
            userType: 'Investor',
            status: 'Active',
            registrationDate: '2023-09-14',
            lastLogin: '2024-01-14 15:20',
            totalInvestment: 1200000,
            portfolioValue: 1350000,
            kycStatus: 'Verified',
            panNumber: 'JKLMN1234O'
        }
    ];

    // Add more sample users
    for (let i = 11; i <= 50; i++) {
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Krishna', 'Shaurya', 'Yash', 'Dhruv'];
        const lastNames = ['Verma', 'Joshi', 'Deshmukh', 'Kulkarni', 'Rao', 'Nair', 'Menon', 'Pillai', 'Iyer', 'Chatterjee'];
        const userTypes = ['Investor', 'Distributor', 'Advisor', 'Employee'];
        const statuses = ['Active', 'Inactive', 'Suspended', 'Pending'];
        const kycStatuses = ['Verified', 'Pending', 'Rejected'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
        
        const totalInvestment = Math.floor(Math.random() * 5000000) + 100000;
        const portfolioValue = totalInvestment * (1 + Math.random() * 0.3);
        
        usersData.push({
            id: i,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            userType: userType,
            status: status,
            registrationDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            lastLogin: `2024-01-${String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')} ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            totalInvestment: totalInvestment,
            portfolioValue: portfolioValue,
            kycStatus: kycStatus,
            panNumber: generateRandomPAN(),
            ...(userType === 'Distributor' && { distributorCode: `DIST${String(i).padStart(3, '0')}` }),
            ...(userType === 'Admin' && { role: 'Administrator' })
        });
    }
    
    filteredUsers = [...usersData];
    renderUsersTable();
}

function generateRandomPAN() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let pan = '';
    // First 5 letters
    for (let i = 0; i < 5; i++) {
        pan += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // 4 numbers
    for (let i = 0; i < 4; i++) {
        pan += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    // Last letter
    pan += letters.charAt(Math.floor(Math.random() * letters.length));
    
    return pan;
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentUserPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
    const pageUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Update pagination controls
    updateUserPagination(totalPages);
    
    // Clear table
    tbody.innerHTML = '';
    
    // Populate table
    pageUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Status badge class
        const statusClass = `status-${user.status.toLowerCase()}`;
        
        // KYC status badge class
        const kycClass = `kyc-${user.kycStatus.toLowerCase()}`;
        
        // User type icon
        const typeIcon = getUserTypeIcon(user.userType);
        
        row.innerHTML = `
            <td>
                <div class="user-avatar">
                    ${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <small>${user.email}</small>
                </div>
            </td>
            <td>
                <span class="user-type ${user.userType.toLowerCase()}">
                    <i class="fas ${typeIcon}"></i> ${user.userType}
                </span>
            </td>
            <td>${user.phone}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${user.status}
                </span>
            </td>
            <td>
                <span class="kyc-badge ${kycClass}">
                    ${user.kycStatus}
                </span>
            </td>
            <td>${InfinityMF.formatCurrency(user.portfolioValue)}</td>
            <td>${InfinityMF.formatDate(user.registrationDate)}</td>
            <td>${formatLastLogin(user.lastLogin)}</td>
            <td>
                <div class="user-actions">
                    <button class="btn-icon" onclick="viewUserDetails(${user.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editUser(${user.id})" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="sendMessage(${user.id})" title="Send Message">
                        <i class="fas fa-envelope"></i>
                    </button>
                    ${user.userType === 'Investor' ? `
                    <button class="btn-icon" onclick="viewPortfolio(${user.id})" title="View Portfolio">
                        <i class="fas fa-chart-pie"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update results count
    updateResultsCount();
}

function getUserTypeIcon(userType) {
    const icons = {
        'Investor': 'fa-user',
        'Distributor': 'fa-users',
        'Admin': 'fa-user-shield',
        'Advisor': 'fa-user-tie',
        'Employee': 'fa-user-cog'
    };
    return icons[userType] || 'fa-user';
}

function formatLastLogin(lastLogin) {
    if (!lastLogin) return 'Never';
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffMs = now - loginDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        if (diffHours < 1) {
            return 'Just now';
        }
        return `${diffHours}h ago`;
    } else if (diffHours < 168) { // 7 days
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
    
    return InfinityMF.formatDate(lastLogin);
}

function updateUserPagination(totalPages) {
    const currentPageElement = document.getElementById('currentUserPage');
    const totalPagesElement = document.getElementById('totalUserPages');
    const prevBtn = document.getElementById('prevUserPage');
    const nextBtn = document.getElementById('nextUserPage');
    
    if (currentPageElement) currentPageElement.textContent = currentUserPage;
    if (totalPagesElement) totalPagesElement.textContent = totalPages;
    if (prevBtn) prevBtn.disabled = currentUserPage === 1;
    if (nextBtn) nextBtn.disabled = currentUserPage === totalPages;
}

function updateResultsCount() {
    const element = document.getElementById('usersResultsCount');
    if (element) {
        const start = (currentUserPage - 1) * usersPerPage + 1;
        const end = Math.min(currentUserPage * usersPerPage, filteredUsers.length);
        element.textContent = `Showing ${start}-${end} of ${filteredUsers.length} users`;
    }
}

function updateUserStats() {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.status === 'Active').length;
    const investors = usersData.filter(u => u.userType === 'Investor').length;
    const kycVerified = usersData.filter(u => u.kycStatus === 'Verified').length;
    
    document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
    document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
    document.getElementById('totalInvestors').textContent = investors.toLocaleString();
    document.getElementById('kycVerified').textContent = kycVerified.toLocaleString();
}

function setupUsersListeners() {
    // Search users
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterUsers, 300));
    }
    
    // Filter by user type
    const typeFilter = document.getElementById('userTypeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterUsers);
    }
    
    // Filter by status
    const statusFilter = document.getElementById('userStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }
    
    // Filter by KYC status
    const kycFilter = document.getElementById('kycStatusFilter');
    if (kycFilter) {
        kycFilter.addEventListener('change', filterUsers);
    }
    
    // Export users
    const exportBtn = document.getElementById('exportUsers');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUsersData);
    }
    
    // Add new user
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const userType = document.getElementById('userTypeFilter').value;
    const status = document.getElementById('userStatusFilter').value;
    const kycStatus = document.getElementById('kycStatusFilter').value;
    
    filteredUsers = usersData.filter(user => {
        // Search filter
        if (searchTerm && 
            !user.name.toLowerCase().includes(searchTerm) &&
            !user.email.toLowerCase().includes(searchTerm) &&
            !user.phone.includes(searchTerm) &&
            !user.panNumber.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // User type filter
        if (userType !== 'all' && user.userType !== userType) {
            return false;
        }
        
        // Status filter
        if (status !== 'all' && user.status !== status) {
            return false;
        }
        
        // KYC status filter
        if (kycStatus !== 'all' && user.kycStatus !== kycStatus) {
            return false;
        }
        
        return true;
    });
    
    currentUserPage = 1;
    renderUsersTable();
}

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

function clearUserFilters() {
    document.getElementById('searchUsers').value = '';
    document.getElementById('userTypeFilter').value = 'all';
    document.getElementById('userStatusFilter').value = 'all';
    document.getElementById('kycStatusFilter').value = 'all';
    
    filterUsers();
}

function changeUserPage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const newPage = currentUserPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentUserPage = newPage;
        renderUsersTable();
    }
}

function exportUsersData() {
    const exportData = filteredUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        'User Type': user.userType,
        Status: user.status,
        'KYC Status': user.kycStatus,
        PAN: user.panNumber,
        'Total Investment': user.totalInvestment,
        'Portfolio Value': user.portfolioValue,
        'Registration Date': user.registrationDate,
        'Last Login': user.lastLogin
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    InfinityMF.showNotification('Users data exported successfully', 'success');
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
        headers.map(header => 
            JSON.stringify(row[header], (key, value) => 
                value === null ? '' : value
            )
        ).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
}

function showAddUserModal() {
    // Open modal for adding new user
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Clear form
        document.getElementById('newUserName').value = '';
        document.getElementById('newUserEmail').value = '';
        document.getElementById('newUserPhone').value = '';
        document.getElementById('newUserType').value = 'Investor';
        document.getElementById('newUserPAN').value = '';
    }
}

function addNewUser() {
    const name = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const userType = document.getElementById('newUserType').value;
    const pan = document.getElementById('newUserPAN').value.trim();
    
    if (!name || !email || !phone) {
        InfinityMF.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        InfinityMF.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone
    if (!validatePhone(phone)) {
        InfinityMF.showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Validate PAN
    if (pan && !validatePAN(pan)) {
        InfinityMF.showNotification('Please enter a valid PAN number', 'error');
        return;
    }
    
    const newUser = {
        id: usersData.length + 1,
        name: name,
        email: email,
        phone: phone,
        userType: userType,
        status: 'Active',
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        totalInvestment: 0,
        portfolioValue: 0,
        kycStatus: pan ? 'Pending' : 'Not Submitted',
        panNumber: pan || 'Not Provided'
    };
    
    usersData.unshift(newUser);
    filterUsers();
    updateUserStats();
    
    // Close modal
    document.getElementById('addUserModal').style.display = 'none';
    
    InfinityMF.showNotification('User added successfully', 'success');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return re.test(phone);
}

function validatePAN(pan) {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(pan.toUpperCase());
}

function viewUserDetails(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    // Show user details in modal
    const modal = document.getElementById('userDetailsModal');
    if (modal) {
        // Populate modal with user details
        document.getElementById('userDetailName').textContent = user.name;
        document.getElementById('userDetailEmail').textContent = user.email;
        document.getElementById('userDetailPhone').textContent = user.phone;
        document.getElementById('userDetailType').textContent = user.userType;
        document.getElementById('userDetailStatus').textContent = user.status;
        document.getElementById('userDetailKYC').textContent = user.kycStatus;
        document.getElementById('userDetailPAN').textContent = user.panNumber;
        document.getElementById('userDetailInvestment').textContent = InfinityMF.formatCurrency(user.totalInvestment);
        document.getElementById('userDetailPortfolio').textContent = InfinityMF.formatCurrency(user.portfolioValue);
        document.getElementById('userDetailRegDate').textContent = InfinityMF.formatDate(user.registrationDate);
        document.getElementById('userDetailLastLogin').textContent = formatLastLogin(user.lastLogin);
        
        modal.style.display = 'block';
    }
}

function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    // Show edit user modal
    const modal = document.getElementById('editUserModal');
    if (modal) {
        // Populate form with user data
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserPhone').value = user.phone;
        document.getElementById('editUserType').value = user.userType;
        document.getElementById('editUserStatus').value = user.status;
        document.getElementById('editUserKYC').value = user.kycStatus;
        document.getElementById('editUserPAN').value = user.panNumber;
        
        modal.style.display = 'block';
    }
}

function updateUser() {
    const userId = parseInt(document.getElementById('editUserId').value);
    const user = usersData.find(u => u.id === userId);
    
    if (!user) return;
    
    // Update user data
    user.name = document.getElementById('editUserName').value.trim();
    user.email = document.getElementById('editUserEmail').value.trim();
    user.phone = document.getElementById('editUserPhone').value.trim();
    user.userType = document.getElementById('editUserType').value;
    user.status = document.getElementById('editUserStatus').value;
    user.kycStatus = document.getElementById('editUserKYC').value;
    user.panNumber = document.getElementById('editUserPAN').value.trim();
    
    // Close modal
    document.getElementById('editUserModal').style.display = 'none';
    
    // Refresh table
    filterUsers();
    
    InfinityMF.showNotification('User updated successfully', 'success');
}

function sendMessage(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    // Show message modal
    const modal = document.getElementById('sendMessageModal');
    if (modal) {
        document.getElementById('messageUserId').value = userId;
        document.getElementById('messageUserName').textContent = user.name;
        modal.style.display = 'block';
    }
}

function sendUserMessage() {
    const userId = parseInt(document.getElementById('messageUserId').value);
    const message = document.getElementById('userMessage').value.trim();
    const subject = document.getElementById('messageSubject').value.trim();
    
    if (!message) {
        InfinityMF.showNotification('Please enter a message', 'error');
        return;
    }
    
    // Here you would typically send the message via API
    console.log(`Sending message to user ${userId}:`, { subject, message });
    
    // Close modal
    document.getElementById('sendMessageModal').style.display = 'none';
    document.getElementById('userMessage').value = '';
    document.getElementById('messageSubject').value = '';
    
    InfinityMF.showNotification('Message sent successfully', 'success');
}

function viewPortfolio(userId) {
    // Redirect to portfolio page with user ID
    window.location.href = `portfolio.html?userId=${userId}`;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Initialize search functionality
function initUserSearch() {
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterUsers, 300));
    }
}

// Export functions for use in other modules
window.UserManager = {
    getUsers: () => usersData,
    getUserById: (id) => usersData.find(u => u.id === id),
    filterUsers: filterUsers,
    exportUsersData: exportUsersData
};