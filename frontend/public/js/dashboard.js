// js/dashboard.js - Dashboard Functions for Infinity MF System

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initializeDashboardCharts();
    
    // Setup event listeners
    setupDashboardListeners();
    
    // Start auto-refresh
    startDashboardAutoRefresh();
}

function loadDashboardData() {
    // Load summary statistics
    loadSummaryStats();
    
    // Load recent transactions
    loadRecentTransactions();
    
    // Load top performing funds
    loadTopPerformingFunds();
    
    // Load upcoming SIPs
    loadUpcomingSIPs();
    
    // Load market overview
    loadMarketOverview();
}

function loadSummaryStats() {
    // Sample data - Replace with actual API call
    const summaryData = {
        totalInvestment: 1250000,
        currentValue: 1450000,
        totalReturns: 200000,
        returnsPercentage: 16.0,
        activeSIPs: 5,
        totalFunds: 8,
        todayChange: 8500,
        monthlyReturns: 45000
    };
    
    // Update summary cards
    updateSummaryCard('totalInvestment', summaryData.totalInvestment);
    updateSummaryCard('currentValue', summaryData.currentValue);
    updateSummaryCard('totalReturns', summaryData.totalReturns);
    updateSummaryCard('returnsPercentage', summaryData.returnsPercentage);
    updateSummaryCard('activeSIPs', summaryData.activeSIPs);
    updateSummaryCard('totalFunds', summaryData.totalFunds);
    updateSummaryCard('todayChange', summaryData.todayChange);
    updateSummaryCard('monthlyReturns', summaryData.monthlyReturns);
}

function updateSummaryCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (elementId.includes('Percentage')) {
        element.textContent = `${value}%`;
        element.style.color = value >= 0 ? '#4CAF50' : '#F44336';
    } else if (elementId.includes('Investment') || elementId.includes('Value') || 
               elementId.includes('Returns') || elementId.includes('Change')) {
        element.textContent = InfinityMF.formatCurrency(value);
        if (elementId.includes('Change') || elementId.includes('Returns')) {
            element.style.color = value >= 0 ? '#4CAF50' : '#F44336';
        }
    } else {
        element.textContent = value;
    }
}

function loadRecentTransactions() {
    // Sample transactions data
    const transactions = [
        {
            id: 1,
            date: '2024-01-15',
            type: 'Purchase',
            fund: 'SBI Bluechip Fund',
            amount: 50000,
            units: 635.5,
            status: 'Completed'
        },
        {
            id: 2,
            date: '2024-01-14',
            type: 'SIP',
            fund: 'HDFC Top 100 Fund',
            amount: 10000,
            units: 12.3,
            status: 'Completed'
        },
        {
            id: 3,
            date: '2024-01-13',
            type: 'Redemption',
            fund: 'ICICI Pru Bluechip Fund',
            amount: 25000,
            units: -368.2,
            status: 'Processing'
        },
        {
            id: 4,
            date: '2024-01-12',
            type: 'Switch',
            fund: 'Kotak Emerging Equity',
            amount: 30000,
            units: 312.5,
            status: 'Completed'
        },
        {
            id: 5,
            date: '2024-01-11',
            type: 'Purchase',
            fund: 'Axis Midcap Fund',
            amount: 20000,
            units: 253.2,
            status: 'Completed'
        }
    ];
    
    const tbody = document.getElementById('recentTransactionsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        const statusClass = transaction.status === 'Completed' ? 'status-completed' :
                           transaction.status === 'Processing' ? 'status-processing' : 'status-pending';
        
        row.innerHTML = `
            <td>${InfinityMF.formatDate(transaction.date)}</td>
            <td>
                <span class="transaction-type ${transaction.type.toLowerCase()}">
                    ${transaction.type}
                </span>
            </td>
            <td>${transaction.fund}</td>
            <td>${InfinityMF.formatCurrency(transaction.amount)}</td>
            <td>${transaction.units.toFixed(2)}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${transaction.status}
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function loadTopPerformingFunds() {
    // Sample top performing funds
    const topFunds = [
        {
            name: 'Nippon India Small Cap Fund',
            returns1Y: 55.4,
            returns3Y: 35.8,
            currentValue: 450000,
            allocation: 31.0
        },
        {
            name: 'Axis Midcap Fund',
            returns1Y: 42.3,
            returns3Y: 30.2,
            currentValue: 285000,
            allocation: 19.7
        },
        {
            name: 'SBI Bluechip Fund',
            returns1Y: 24.8,
            returns3Y: 18.5,
            currentValue: 325000,
            allocation: 22.4
        },
        {
            name: 'ICICI Pru Bluechip Fund',
            returns1Y: 25.2,
            returns3Y: 19.1,
            currentValue: 225000,
            allocation: 15.5
        },
        {
            name: 'HDFC Balanced Advantage',
            returns1Y: 18.5,
            returns3Y: 14.2,
            currentValue: 165000,
            allocation: 11.4
        }
    ];
    
    const container = document.getElementById('topPerformingFunds');
    if (!container) return;
    
    container.innerHTML = '';
    
    topFunds.forEach((fund, index) => {
        const fundCard = document.createElement('div');
        fundCard.className = 'top-fund-card';
        
        const returnsColor = fund.returns1Y >= 0 ? '#4CAF50' : '#F44336';
        
        fundCard.innerHTML = `
            <div class="fund-rank">${index + 1}</div>
            <div class="fund-info">
                <h4>${fund.name}</h4>
                <div class="fund-stats">
                    <span class="returns" style="color: ${returnsColor}">
                        <i class="fas fa-arrow-up"></i> ${fund.returns1Y}% 1Y
                    </span>
                    <span>${fund.returns3Y}% 3Y</span>
                </div>
            </div>
            <div class="fund-allocation">
                <div class="allocation-bar">
                    <div class="allocation-fill" style="width: ${fund.allocation}%"></div>
                </div>
                <span>${fund.allocation}%</span>
            </div>
            <div class="fund-value">
                ${InfinityMF.formatCurrency(fund.currentValue)}
            </div>
        `;
        
        container.appendChild(fundCard);
    });
}

function loadUpcomingSIPs() {
    // Sample upcoming SIPs
    const upcomingSIPs = [
        {
            fund: 'SBI Bluechip Fund',
            date: '2024-01-20',
            amount: 10000,
            status: 'Upcoming'
        },
        {
            fund: 'HDFC Top 100 Fund',
            date: '2024-01-22',
            amount: 5000,
            status: 'Upcoming'
        },
        {
            fund: 'ICICI Pru Bluechip Fund',
            date: '2024-01-25',
            amount: 7500,
            status: 'Due Soon'
        },
        {
            fund: 'Kotak Emerging Equity',
            date: '2024-01-28',
            amount: 8000,
            status: 'Upcoming'
        }
    ];
    
    const container = document.getElementById('upcomingSIPs');
    if (!container) return;
    
    container.innerHTML = '';
    
    upcomingSIPs.forEach(sip => {
        const sipItem = document.createElement('div');
        sipItem.className = 'sip-item';
        
        const daysLeft = calculateDaysLeft(sip.date);
        const statusClass = daysLeft <= 2 ? 'sip-due-soon' : 'sip-upcoming';
        
        sipItem.innerHTML = `
            <div class="sip-fund">
                <h5>${sip.fund}</h5>
                <small>${InfinityMF.formatDate(sip.date)}</small>
            </div>
            <div class="sip-details">
                <span class="sip-amount">${InfinityMF.formatCurrency(sip.amount)}</span>
                <span class="sip-status ${statusClass}">
                    ${daysLeft <= 2 ? 'Due in ' + daysLeft + ' days' : sip.status}
                </span>
            </div>
            <button class="btn btn-sm btn-outline" onclick="skipSIP(${sip.id})">
                Skip
            </button>
        `;
        
        container.appendChild(sipItem);
    });
}

function calculateDaysLeft(dateString) {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function loadMarketOverview() {
    // Sample market data
    const marketData = {
        sensex: {
            value: 71500.12,
            change: 350.45,
            changePercent: 0.49
        },
        nifty: {
            value: 21550.34,
            change: 120.25,
            changePercent: 0.56
        },
        gold: {
            value: 6250.50,
            change: 45.25,
            changePercent: 0.73
        },
        usdInr: {
            value: 83.12,
            change: -0.15,
            changePercent: -0.18
        }
    };
    
    const container = document.getElementById('marketOverview');
    if (!container) return;
    
    Object.keys(marketData).forEach(key => {
        const element = document.getElementById(`market${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (element) {
            const data = marketData[key];
            element.innerHTML = `
                <div class="market-value">${data.value.toFixed(2)}</div>
                <div class="market-change ${data.change >= 0 ? 'positive' : 'negative'}">
                    ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} 
                    (${data.change >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)
                </div>
            `;
        }
    });
}

function initializeDashboardCharts() {
    // Portfolio Performance Chart
    initPerformanceChart();
    
    // Asset Allocation Chart
    initAllocationChart();
    
    // Monthly Returns Chart
    initMonthlyReturnsChart();
    
    // Risk Distribution Chart
    initRiskDistributionChart();
}

function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    // Sample data
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const portfolioData = [1000000, 1050000, 1100000, 1080000, 1150000, 1200000, 1250000, 1300000, 1350000, 1400000, 1450000, 1500000];
    const benchmarkData = [1000000, 1020000, 1050000, 1040000, 1080000, 1120000, 1160000, 1190000, 1230000, 1270000, 1310000, 1350000];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Portfolio',
                    data: portfolioData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Benchmark (Nifty 50)',
                    data: benchmarkData,
                    borderColor: '#2196F3',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${InfinityMF.formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(0) + 'L';
                        }
                    }
                }
            }
        }
    });
}

function initAllocationChart() {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Hybrid', 'Others'],
            datasets: [{
                data: [35, 25, 15, 15, 8, 2],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#00BCD4',
                    '#795548'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

function initMonthlyReturnsChart() {
    const ctx = document.getElementById('monthlyReturnsChart');
    if (!ctx) return;
    
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const returns = [2.5, 3.1, -1.2, 4.2, 2.8, 3.5, 2.1, 3.8, 2.9, 4.1, 3.2, 4.5];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Returns (%)',
                data: returns,
                backgroundColor: function(context) {
                    const value = context.raw;
                    return value >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)';
                },
                borderColor: function(context) {
                    const value = context.raw;
                    return value >= 0 ? '#4CAF50' : '#F44336';
                },
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initRiskDistributionChart() {
    const ctx = document.getElementById('riskDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Equity Exposure', 'Concentration Risk', 'Market Risk', 'Credit Risk', 'Liquidity Risk', 'Currency Risk'],
            datasets: [{
                label: 'Your Portfolio',
                data: [75, 40, 65, 30, 45, 20],
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: '#4CAF50',
                pointBackgroundColor: '#4CAF50'
            }, {
                label: 'Benchmark',
                data: [60, 35, 60, 25, 35, 25],
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: '#2196F3',
                borderDash: [5, 5],
                pointBackgroundColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

function setupDashboardListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            loadDashboardData();
            setTimeout(() => {
                this.classList.remove('refreshing');
                InfinityMF.showNotification('Dashboard data refreshed', 'success');
            }, 1000);
        });
    }
    
    // Date range selector
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            loadDashboardData(this.value);
        });
    }
    
    // Export dashboard
    const exportBtn = document.getElementById('exportDashboard');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardData);
    }
    
    // Quick actions
    document.querySelectorAll('.quick-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            performQuickAction(action);
        });
    });
}

function performQuickAction(action) {
    switch(action) {
        case 'addFunds':
            window.location.href = 'transactions.html?action=purchase';
            break;
        case 'startSIP':
            window.location.href = 'sip.html';
            break;
        case 'generateReport':
            generateQuickReport();
            break;
        case 'contactAdvisor':
            window.location.href = 'contact.html';
            break;
    }
}

function generateQuickReport() {
    // Generate and download a quick report
    const reportData = {
        date: new Date().toLocaleDateString(),
        portfolioValue: 1450000,
        totalInvested: 1250000,
        totalReturns: 200000,
        returnsPercentage: 16.0
    };
    
    const reportContent = `
        INFINITY MF PORTFOLIO REPORT
        ============================
        Date: ${reportData.date}
        
        Portfolio Summary:
        -----------------
        Current Portfolio Value: ${InfinityMF.formatCurrency(reportData.portfolioValue)}
        Total Amount Invested: ${InfinityMF.formatCurrency(reportData.totalInvested)}
        Total Returns: ${InfinityMF.formatCurrency(reportData.totalReturns)}
        Returns Percentage: ${reportData.returnsPercentage}%
        
        Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    InfinityMF.showNotification('Report generated successfully', 'success');
}

function startDashboardAutoRefresh() {
    // Auto-refresh dashboard every 30 seconds if tab is visible
    let refreshInterval;
    
    function refreshIfVisible() {
        if (!document.hidden) {
            refreshDashboard();
        }
    }
    
    function refreshDashboard() {
        // Refresh only summary stats (light refresh)
        loadSummaryStats();
        loadMarketOverview();
    }
    
    refreshInterval = setInterval(refreshIfVisible, 30000);
    
    // Listen to tab visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(refreshInterval);
        } else {
            refreshInterval = setInterval(refreshIfVisible, 30000);
        }
    });
}

function exportDashboardData() {
    const data = {
        summary: {
            totalInvestment: 1250000,
            currentValue: 1450000,
            totalReturns: 200000,
            returnsPercentage: 16.0
        },
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    InfinityMF.showNotification('Dashboard data exported successfully', 'success');
}

// Function to skip a SIP
function skipSIP(sipId) {
    if (confirm('Are you sure you want to skip this SIP installment?')) {
        // Call API to skip SIP
        InfinityMF.showNotification('SIP installment skipped', 'warning');
        loadUpcomingSIPs(); // Refresh the list
    }
}

// Function to add quick transaction
function addQuickTransaction(amount, fundId, type) {
    // This would typically call an API
    InfinityMF.showNotification('Transaction added successfully', 'success');
    loadDashboardData(); // Refresh dashboard
}

// Make functions available globally
window.loadDashboardData = loadDashboardData;
window.refreshDashboard = loadDashboardData;
window.skipSIP = skipSIP;