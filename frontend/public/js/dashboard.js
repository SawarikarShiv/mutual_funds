// js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Initialize live updates
    startLiveUpdates();
});

function loadDashboardData() {
    // Load portfolio summary
    fetchDashboardStats();
    
    // Load recent activity
    fetchRecentActivity();
    
    // Load market data
    fetchMarketData();
}

function fetchDashboardStats() {
    // Mock data - in production, fetch from API
    const stats = {
        portfolioValue: 2478560,
        activeFunds: 12,
        totalReturns: 215400,
        pendingActions: 8
    };
    
    // Update DOM elements
    document.querySelectorAll('.stat-value')[0].textContent = formatCurrency(stats.portfolioValue);
    document.querySelectorAll('.stat-value')[1].textContent = stats.activeFunds;
    document.querySelectorAll('.stat-value')[2].textContent = formatCurrency(stats.totalReturns);
    document.querySelectorAll('.stat-value')[3].textContent = stats.pendingActions;
}

function fetchRecentActivity() {
    // Mock activity data
    const activities = [
        {
            type: 'investment',
            title: 'SIP Investment Processed',
            description: 'Monthly SIP in HDFC Top 100 Fund',
            time: 'Today, 10:30 AM',
            icon: 'fa-download'
        },
        {
            type: 'switch',
            title: 'Fund Switch Completed',
            description: 'Debt to Hybrid Fund switch for Rajesh Kumar',
            time: 'Yesterday, 2:15 PM',
            icon: 'fa-exchange-alt'
        },
        {
            type: 'user',
            title: 'New User Registered',
            description: 'Investor account created for Priya Sharma',
            time: '2 days ago',
            icon: 'fa-user-plus'
        }
    ];
    
    // This would be updated in production
    console.log('Loaded recent activities:', activities);
}

function fetchMarketData() {
    // Simulate market data updates
    setInterval(() => {
        const change = (Math.random() - 0.5) * 0.5;
        const changeElement = document.querySelector('.stat-change.positive');
        
        if (changeElement) {
            const currentText = changeElement.textContent;
            const currentChange = parseFloat(currentText.match(/[\d.]+/)[0]);
            const newChange = Math.max(0, currentChange + (Math.random() - 0.5) * 0.2);
            
            changeElement.innerHTML = `
                <i class="fas fa-arrow-up"></i>
                +${newChange.toFixed(2)}% today
            `;
        }
    }, 10000); // Update every 10 seconds
}

function startLiveUpdates() {
    // Update portfolio value live
    setInterval(() => {
        const portfolioValue = document.querySelectorAll('.stat-value')[0];
        if (portfolioValue) {
            const currentValue = parseFloat(portfolioValue.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 5000;
            const newValue = currentValue + change;
            
            portfolioValue.textContent = formatCurrency(newValue);
        }
    }, 15000); // Update every 15 seconds
}