// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL VARIABLES =====
    let currentPage = 'dashboard';
    
    // ===== SAMPLE DATA =====
    const sampleData = {
        activities: [
            {
                id: 1,
                type: 'purchase',
                fund: 'SBI Bluechip Fund',
                amount: '₹25,000',
                date: 'Today, 10:30 AM',
                icon: 'fa-arrow-up',
                color: 'success'
            },
            {
                id: 2,
                type: 'redemption',
                fund: 'HDFC Balanced Advantage',
                amount: '₹15,000',
                date: 'Yesterday, 2:45 PM',
                icon: 'fa-arrow-down',
                color: 'danger'
            },
            {
                id: 3,
                type: 'sip',
                fund: 'ICICI Prudential Tech Fund',
                amount: '₹10,000',
                date: 'Mar 15, 9:00 AM',
                icon: 'fa-sync',
                color: 'primary'
            },
            {
                id: 4,
                type: 'nav_change',
                fund: 'Nippon India Small Cap',
                amount: '+3.2%',
                date: 'Mar 14, 6:00 PM',
                icon: 'fa-chart-line',
                color: 'warning'
            }
        ],
        
        holdings: [
            {
                id: 1,
                name: 'SBI Bluechip Fund',
                category: 'Large Cap',
                allocation: '35.2%',
                value: '₹6,42,000',
                change: '+12.5%',
                changeType: 'positive'
            },
            {
                id: 2,
                name: 'HDFC Balanced Advantage',
                category: 'Hybrid',
                allocation: '25.8%',
                value: '₹4,71,000',
                change: '+8.3%',
                changeType: 'positive'
            },
            {
                id: 3,
                name: 'ICICI Prudential Tech Fund',
                category: 'Sectoral',
                allocation: '18.5%',
                value: '₹3,38,000',
                change: '+15.2%',
                changeType: 'positive'
            },
            {
                id: 4,
                name: 'Nippon India Small Cap',
                category: 'Small Cap',
                allocation: '12.3%',
                value: '₹2,25,000',
                change: '-2.1%',
                changeType: 'negative'
            }
        ],
        
        alerts: [
            {
                id: 1,
                type: 'price',
                title: 'Price Alert Triggered',
                message: 'SBI Bluechip Fund reached ₹150.25',
                time: '10 mins ago',
                priority: 'high'
            },
            {
                id: 2,
                type: 'portfolio',
                title: 'Portfolio Performance',
                message: 'Your portfolio gained 3.2% this week',
                time: '2 hours ago',
                priority: 'medium'
            },
            {
                id: 3,
                type: 'sip',
                title: 'SIP Reminder',
                message: 'SIP payment for HDFC Fund due tomorrow',
                time: '1 day ago',
                priority: 'high'
            }
        ],
        
        portfolioData: [
            {
                id: 1,
                name: 'SBI Bluechip Fund',
                category: 'Large Cap',
                units: '4,250',
                avgPrice: '₹145.25',
                currentNav: '₹151.00',
                investment: '₹6,17,312',
                currentValue: '₹6,42,000',
                gain: '₹24,688',
                gainPercent: '+4.0%'
            },
            {
                id: 2,
                name: 'HDFC Balanced Advantage',
                category: 'Hybrid',
                units: '8,500',
                avgPrice: '₹53.25',
                currentNav: '₹55.40',
                investment: '₹4,52,625',
                currentValue: '₹4,71,000',
                gain: '₹18,375',
                gainPercent: '+4.1%'
            },
            {
                id: 3,
                name: 'ICICI Prudential Tech Fund',
                category: 'Sectoral',
                units: '2,150',
                avgPrice: '₹152.00',
                currentNav: '₹157.25',
                investment: '₹3,26,800',
                currentValue: '₹3,38,000',
                gain: '₹11,200',
                gainPercent: '+3.4%'
            }
        ],
        
        fundsData: [
            {
                id: 1,
                name: 'SBI Bluechip Fund',
                category: 'Large Cap',
                rating: 5,
                risk: 'Medium',
                amc: 'SBI',
                nav: '₹151.00',
                change: '+1.25%',
                changeType: 'positive',
                expenseRatio: '1.05%',
                aum: '₹42,500 Cr'
            },
            {
                id: 2,
                name: 'HDFC Balanced Advantage',
                category: 'Hybrid',
                rating: 4,
                risk: 'Low',
                amc: 'HDFC',
                nav: '₹55.40',
                change: '+0.45%',
                changeType: 'positive',
                expenseRatio: '1.25%',
                aum: '₹38,200 Cr'
            },
            {
                id: 3,
                name: 'ICICI Prudential Tech Fund',
                category: 'Sectoral',
                rating: 4,
                risk: 'High',
                amc: 'ICICI',
                nav: '₹157.25',
                change: '-0.85%',
                changeType: 'negative',
                expenseRatio: '1.45%',
                aum: '₹12,800 Cr'
            },
            {
                id: 4,
                name: 'Nippon India Small Cap',
                category: 'Small Cap',
                rating: 3,
                risk: 'Very High',
                amc: 'Nippon',
                nav: '₹125.50',
                change: '+2.15%',
                changeType: 'positive',
                expenseRatio: '1.35%',
                aum: '₹28,400 Cr'
            },
            {
                id: 5,
                name: 'Axis Bluechip Fund',
                category: 'Large Cap',
                rating: 5,
                risk: 'Medium',
                amc: 'Axis',
                nav: '₹42.25',
                change: '+0.75%',
                changeType: 'positive',
                expenseRatio: '0.95%',
                aum: '₹31,500 Cr'
            },
            {
                id: 6,
                name: 'Kotak Corporate Bond Fund',
                category: 'Debt',
                rating: 4,
                risk: 'Low',
                amc: 'Kotak',
                nav: '₹25.80',
                change: '+0.25%',
                changeType: 'positive',
                expenseRatio: '0.45%',
                aum: '₹15,200 Cr'
            }
        ]
    };
    
    // ===== INITIALIZATION =====
    initNavigation();
    initDashboard();
    initPortfolio();
    initFunds();
    initCharts();
    
    // ===== NAVIGATION FUNCTIONS =====
    function initNavigation() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Get target page
                const targetId = this.getAttribute('href').substring(1);
                
                // Switch page
                switchPage(targetId);
            });
        });
        
        // Mobile toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }
        
        // User dropdown
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', function() {
                // Implement user dropdown menu
                console.log('User profile clicked');
            });
        }
        
        // Logout button
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    // Implement logout logic
                    window.location.href = 'login.html';
                }
            });
        }
    }
    
    // ===== PAGE SWITCHING =====
    function switchPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page-section');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageId;
            
            // Update page title
            updatePageTitle(pageId);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    function updatePageTitle(pageId) {
        const titles = {
            'dashboard': 'Dashboard',
            'portfolio': 'My Portfolio',
            'funds': 'Mutual Funds',
            'transactions': 'Transactions',
            'reports': 'Reports',
            'research': 'Research'
        };
        
        document.title = `${titles[pageId]} | MutualFundPro`;
    }
    
    // ===== DASHBOARD FUNCTIONS =====
    function initDashboard() {
        populateActivities();
        populateHoldings();
        populateAlerts();
    }
    
    function populateActivities() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        let html = '';
        sampleData.activities.forEach(activity => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon ${activity.color}">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">
                            <strong>${activity.type.toUpperCase()}</strong> - ${activity.fund}
                        </div>
                        <div class="activity-info">
                            <span class="activity-amount">${activity.amount}</span>
                            <span class="activity-date">${activity.date}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        activityList.innerHTML = html;
    }
    
    function populateHoldings() {
        const holdingsList = document.querySelector('.holdings-list');
        if (!holdingsList) return;
        
        let html = '';
        sampleData.holdings.forEach(holding => {
            html += `
                <div class="holding-item">
                    <div class="holding-info">
                        <div class="holding-name">${holding.name}</div>
                        <div class="holding-category">${holding.category}</div>
                    </div>
                    <div class="holding-stats">
                        <div class="holding-allocation">${holding.allocation}</div>
                        <div class="holding-value">${holding.value}</div>
                        <div class="holding-change ${holding.changeType}">${holding.change}</div>
                    </div>
                </div>
            `;
        });
        
        holdingsList.innerHTML = html;
    }
    
    function populateAlerts() {
        const alertsList = document.querySelector('.alerts-list');
        if (!alertsList) return;
        
        let html = '';
        sampleData.alerts.forEach(alert => {
            html += `
                <div class="alert-item ${alert.priority}">
                    <div class="alert-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-message">${alert.message}</div>
                        <div class="alert-time">${alert.time}</div>
                    </div>
                    <button class="alert-action">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        alertsList.innerHTML = html;
        
        // Add event listeners to dismiss buttons
        const dismissButtons = document.querySelectorAll('.alert-action');
        dismissButtons.forEach(button => {
            button.addEventListener('click', function() {
                const alertItem = this.closest('.alert-item');
                alertItem.style.opacity = '0';
                setTimeout(() => {
                    alertItem.remove();
                    updateNotificationCount();
                }, 300);
            });
        });
        
        updateNotificationCount();
    }
    
    function updateNotificationCount() {
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            const alerts = document.querySelectorAll('.alert-item').length;
            notificationCount.textContent = alerts;
            notificationCount.style.display = alerts > 0 ? 'flex' : 'none';
        }
    }
    
    // ===== PORTFOLIO FUNCTIONS =====
    function initPortfolio() {
        populatePortfolioTable();
        setupPortfolioFilters();
    }
    
    function populatePortfolioTable() {
        const tableBody = document.getElementById('portfolioTableBody');
        if (!tableBody) return;
        
        let html = '';
        sampleData.portfolioData.forEach(fund => {
            const isPositive = fund.gainPercent.startsWith('+');
            
            html += `
                <tr>
                    <td>
                        <div class="fund-name">${fund.name}</div>
                        <div class="fund-category">${fund.category}</div>
                    </td>
                    <td>${fund.category}</td>
                    <td>${fund.units}</td>
                    <td>${fund.avgPrice}</td>
                    <td>${fund.currentNav}</td>
                    <td>${fund.investment}</td>
                    <td>${fund.currentValue}</td>
                    <td>
                        <div class="${isPositive ? 'positive' : 'negative'}">
                            ${fund.gain} (${fund.gainPercent})
                        </div>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action" title="Sell">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button class="btn-action" title="Add More">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // Add event listeners to action buttons
        const actionButtons = document.querySelectorAll('.btn-action');
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.querySelector('i').className;
                if (action.includes('fa-eye')) {
                    showFundDetails(this);
                } else if (action.includes('fa-arrow-down')) {
                    initiateRedemption(this);
                } else if (action.includes('fa-plus')) {
                    initiatePurchase(this);
                }
            });
        });
    }
    
    function setupPortfolioFilters() {
        const searchInput = document.querySelector('.search-input');
        const categoryFilter = document.querySelector('.filter-select');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterPortfolioTable();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                filterPortfolioTable();
            });
        }
    }
    
    function filterPortfolioTable() {
        const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
        const categoryFilter = document.querySelector('.filter-select')?.value || 'All Categories';
        
        const rows = document.querySelectorAll('#portfolioTableBody tr');
        
        rows.forEach(row => {
            const fundName = row.querySelector('.fund-name').textContent.toLowerCase();
            const category = row.querySelector('.fund-category').textContent;
            
            const matchesSearch = fundName.includes(searchTerm);
            const matchesCategory = categoryFilter === 'All Categories' || 
                                   category === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function showFundDetails(button) {
        const row = button.closest('tr');
        const fundName = row.querySelector('.fund-name').textContent;
        alert(`Viewing details for: ${fundName}`);
    }
    
    function initiateRedemption(button) {
        const row = button.closest('tr');
        const fundName = row.querySelector('.fund-name').textContent;
        alert(`Initiating redemption for: ${fundName}`);
    }
    
    function initiatePurchase(button) {
        const row = button.closest('tr');
        const fundName = row.querySelector('.fund-name').textContent;
        alert(`Adding more to: ${fundName}`);
    }
    
    // ===== FUNDS FUNCTIONS =====
    function initFunds() {
        populateFundsGrid();
        setupFundFilters();
        setupFundScreener();
    }
    
    function populateFundsGrid() {
        const fundsGrid = document.getElementById('fundsGrid');
        if (!fundsGrid) return;
        
        let html = '';
        sampleData.fundsData.forEach(fund => {
            const stars = '★'.repeat(fund.rating) + '☆'.repeat(5 - fund.rating);
            
            html += `
                <div class="fund-card" data-category="${fund.category.toLowerCase()}" 
                     data-risk="${fund.risk.toLowerCase()}" data-amc="${fund.amc.toLowerCase()}">
                    <div class="fund-header">
                        <div>
                            <div class="fund-name">${fund.name}</div>
                            <span class="fund-category">${fund.category}</span>
                        </div>
                        <div class="fund-rating" title="Rating: ${fund.rating}/5">
                            ${stars}
                        </div>
                    </div>
                    <div class="fund-body">
                        <div class="fund-metric">
                            <span class="metric-label">Risk Level</span>
                            <span class="metric-value">${fund.risk}</span>
                        </div>
                        <div class="fund-metric">
                            <span class="metric-label">Current NAV</span>
                            <span class="metric-value">${fund.nav}</span>
                        </div>
                        <div class="fund-metric">
                            <span class="metric-label">Today's Change</span>
                            <span class="metric-value ${fund.changeType}">
                                ${fund.change}
                            </span>
                        </div>
                        <div class="fund-metric">
                            <span class="metric-label">Expense Ratio</span>
                            <span class="metric-value">${fund.expenseRatio}</span>
                        </div>
                        <div class="fund-metric">
                            <span class="metric-label">AUM</span>
                            <span class="metric-value">${fund.aum}</span>
                        </div>
                    </div>
                    <div class="fund-footer">
                        <button class="btn btn-outline btn-sm view-fund">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        <button class="btn btn-primary btn-sm invest-fund">
                            <i class="fas fa-rupee-sign"></i> Invest
                        </button>
                    </div>
                </div>
            `;
        });
        
        fundsGrid.innerHTML = html;
        
        // Add event listeners to fund buttons
        document.querySelectorAll('.view-fund').forEach(button => {
            button.addEventListener('click', function() {
                const fundCard = this.closest('.fund-card');
                const fundName = fundCard.querySelector('.fund-name').textContent;
                showFundDetailsModal(fundName);
            });
        });
        
        document.querySelectorAll('.invest-fund').forEach(button => {
            button.addEventListener('click', function() {
                const fundCard = this.closest('.fund-card');
                const fundName = fundCard.querySelector('.fund-name').textContent;
                initiateInvestment(fundName);
            });
        });
    }
    
    function setupFundFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', filterFunds);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFundFilters);
        }
        
        // Apply filters on select change
        document.querySelectorAll('.fund-filters select').forEach(select => {
            select.addEventListener('change', filterFunds);
        });
    }
    
    function filterFunds() {
        const category = document.getElementById('categoryFilter')?.value.toLowerCase() || '';
        const risk = document.getElementById('riskFilter')?.value.toLowerCase() || '';
        const amc = document.getElementById('amcFilter')?.value.toLowerCase() || '';
        const rating = document.getElementById('ratingFilter')?.value || '';
        
        const fundCards = document.querySelectorAll('.fund-card');
        
        fundCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardRisk = card.dataset.risk;
            const cardAmc = card.dataset.amc;
            const cardRating = card.querySelector('.fund-rating').textContent;
            
            const matchesCategory = !category || cardCategory.includes(category);
            const matchesRisk = !risk || cardRisk.includes(risk);
            const matchesAmc = !amc || cardAmc.includes(amc);
            const matchesRating = !rating || cardRating.length >= parseInt(rating);
            
            if (matchesCategory && matchesRisk && matchesAmc && matchesRating) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function resetFundFilters() {
        document.querySelectorAll('.fund-filters select').forEach(select => {
            select.value = '';
        });
        
        const fundCards = document.querySelectorAll('.fund-card');
        fundCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    function setupFundScreener() {
        const screenerBtn = document.getElementById('screenerBtn');
        const screenerModal = document.getElementById('screenerModal');
        const closeModal = document.querySelector('.close-modal');
        
        if (screenerBtn && screenerModal) {
            screenerBtn.addEventListener('click', function() {
                screenerModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                screenerModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside
        if (screenerModal) {
            screenerModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    function showFundDetailsModal(fundName) {
        alert(`Showing detailed analysis for: ${fundName}`);
        // In a real app, this would open a modal with detailed fund analysis
    }
    
    function initiateInvestment(fundName) {
        const amount = prompt(`Enter investment amount for ${fundName}:`, '10000');
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            alert(`Investing ₹${amount} in ${fundName}...`);
            // In a real app, this would redirect to investment page
        } else if (amount !== null) {
            alert('Please enter a valid amount.');
        }
    }
    
    // ===== CHARTS FUNCTIONS =====
    function initCharts() {
        createPerformanceChart();
        createAllocationChart();
        
        // Update charts on period change
        const periodSelect = document.querySelector('.chart-select');
        if (periodSelect) {
            periodSelect.addEventListener('change', function() {
                updatePerformanceChart(this.value);
            });
        }
    }
    
    function createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        const performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [1500000, 1520000, 1560000, 1580000, 1620000, 1650000, 
                           1680000, 1700000, 1720000, 1760000, 1800000, 1825400],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Benchmark (Nifty 50)',
                    data: [1500000, 1510000, 1530000, 1540000, 1560000, 1580000,
                           1590000, 1610000, 1630000, 1650000, 1670000, 1680000],
                    borderColor: '#7209b7',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '₹' + context.parsed.y.toLocaleString('en-IN');
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value / 100000).toFixed(1) + 'L';
                            }
                        }
                    }
                }
            }
        });
        
        window.performanceChart = performanceChart;
    }
    
    function createAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;
        
        const allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Hybrid', 'Others'],
                datasets: [{
                    data: [35.2, 20.5, 12.3, 18.6, 8.4, 5.0],
                    backgroundColor: [
                        '#4361ee',
                        '#7209b7',
                        '#f72585',
                        '#4cc9f0',
                        '#f8961e',
                        '#4895ef'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
        
        window.allocationChart = allocationChart;
    }
    
    function updatePerformanceChart(period) {
        // This function would fetch new data based on selected period
        console.log('Updating chart for period:', period);
        
        if (window.performanceChart) {
            // Update chart data based on period
            // In a real app, this would fetch new data from server
            window.performanceChart.update();
        }
    }
    
    // ===== UTILITY FUNCTIONS =====
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    function formatPercentage(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }
    
    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add toast to page
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            hideToast(toast);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() {
            hideToast(toast);
        });
    }
    
    function hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    // ===== EVENT LISTENERS =====
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update charts on resize
        if (window.performanceChart) {
            window.performanceChart.resize();
        }
        if (window.allocationChart) {
            window.allocationChart.resize();
        }
    });
    
    // Handle page load
    window.addEventListener('load', function() {
        // Show welcome message
        setTimeout(() => {
            showToast('Welcome back to your investment dashboard!', 'success');
        }, 1000);
        
        // Update charts
        if (window.performanceChart) {
            window.performanceChart.update();
        }
        if (window.allocationChart) {
            window.allocationChart.update();
        }
    });
    
    // Handle offline/online status
    window.addEventListener('online', function() {
        showToast('You are back online!', 'success');
    });
    
    window.addEventListener('offline', function() {
        showToast('You are offline. Some features may not work.', 'warning');
    });
    
    // ===== EXPORT FUNCTIONS =====
    function exportPortfolioToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Fund Name,Category,Units,Avg Price,Current NAV,Investment,Current Value,Gain/Loss,Gain %\n";
        
        sampleData.portfolioData.forEach(fund => {
            const row = [
                fund.name,
                fund.category,
                fund.units.replace(',', ''),
                fund.avgPrice.replace('₹', ''),
                fund.currentNav.replace('₹', ''),
                fund.investment.replace('₹', '').replace(',', ''),
                fund.currentValue.replace('₹', '').replace(',', ''),
                fund.gain.replace('₹', '').replace(',', ''),
                fund.gainPercent.replace('%', '').replace('+', '')
            ].join(',');
            
            csvContent += row + "\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "portfolio_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Add export functionality
    const exportBtn = document.querySelector('.btn-outline');
    if (exportBtn && exportBtn.textContent.includes('Export')) {
        exportBtn.addEventListener('click', exportPortfolioToCSV);
    }
});