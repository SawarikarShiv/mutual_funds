// portfolio.js - Live Portfolio Management

let portfolioData = [];
let marketData = [];
let performanceChart = null;
let allocationChart = null;

// Initialize portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadPortfolioData();
    loadMarketData();
    
    // Initialize charts
    initializeCharts();
    
    // Setup event listeners
    document.getElementById('refreshPortfolio').addEventListener('click', refreshAllData);
    
    // Start live updates
    startLiveUpdates();
    
    // Show welcome message
    setTimeout(() => {
        showToast('Live portfolio data loaded! Real-time updates active.', 'success');
    }, 1000);
});

// Load portfolio holdings
function loadPortfolioData() {
    // Mock data - In production, fetch from API
    portfolioData = [
        {
            id: 1,
            name: 'HDFC Top 100 Fund',
            category: 'Equity Large Cap',
            units: 450.25,
            avgCost: 520.50,
            currentNav: 615.20,
            investedValue: 234500,
            currentValue: 276834,
            gainLoss: 42334,
            xirr: 15.8,
            change: 1.2
        },
        {
            id: 2,
            name: 'ICICI Pru Bluechip Fund',
            category: 'Equity Large Cap',
            units: 320.50,
            avgCost: 480.25,
            currentNav: 560.75,
            investedValue: 154000,
            currentValue: 179680,
            gainLoss: 25680,
            xirr: 14.2,
            change: 0.8
        },
        {
            id: 3,
            name: 'SBI Small Cap Fund',
            category: 'Equity Small Cap',
            units: 150.75,
            avgCost: 85.50,
            currentNav: 120.25,
            investedValue: 12889,
            currentValue: 18128,
            gainLoss: 5239,
            xirr: 32.5,
            change: 2.5
        },
        {
            id: 4,
            name: 'Axis Long Term Equity',
            category: 'ELSS',
            units: 180.00,
            avgCost: 380.50,
            currentNav: 410.25,
            investedValue: 68490,
            currentValue: 73845,
            gainLoss: 5355,
            xirr: 20.5,
            change: -0.5
        },
        {
            id: 5,
            name: 'Mirae Asset Emerging',
            category: 'Equity Large & Mid Cap',
            units: 220.40,
            avgCost: 320.75,
            currentNav: 350.20,
            investedValue: 70714,
            currentValue: 77168,
            gainLoss: 6454,
            xirr: 24.8,
            change: 1.8
        }
    ];
    
    updatePortfolioTable();
    updatePortfolioStats();
}

// Load market data
function loadMarketData() {
    // Mock market data
    marketData = [
        { symbol: 'NIFTY 50', value: 22416.07, change: 0.45 },
        { symbol: 'SENSEX', value: 73845.12, change: 0.38 },
        { symbol: 'BANKNIFTY', value: 47218.34, change: 0.62 },
        { symbol: 'FINNIFTY', value: 20845.67, change: 0.28 },
        { symbol: 'MIDCPNIFTY', value: 12456.78, change: 0.85 }
    ];
    
    updateMarketWatch();
}

// Update portfolio table
function updatePortfolioTable() {
    const tableBody = document.getElementById('portfolioTableBody');
    tableBody.innerHTML = '';
    
    portfolioData.forEach(fund => {
        const gainPercent = ((fund.gainLoss / fund.investedValue) * 100).toFixed(2);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${fund.name}</strong></td>
            <td>${fund.category}</td>
            <td>${fund.units.toFixed(2)}</td>
            <td>₹${fund.avgCost.toFixed(2)}</td>
            <td>
                ₹${fund.currentNav.toFixed(2)}
                <span style="font-size: 12px; color: ${fund.change >= 0 ? '#4cc9f0' : '#f72585'}; margin-left: 8px;">
                    ${fund.change >= 0 ? '↗' : '↘'} ${Math.abs(fund.change)}%
                </span>
            </td>
            <td>₹${fund.investedValue.toLocaleString()}</td>
            <td><strong>₹${fund.currentValue.toLocaleString()}</strong></td>
            <td style="color: ${fund.gainLoss >= 0 ? '#4cc9f0' : '#f72585'};">
                ₹${fund.gainLoss.toLocaleString()} (${gainPercent}%)
            </td>
            <td style="color: #4cc9f0; font-weight: 600;">
                ${fund.xirr}%
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update portfolio statistics
function updatePortfolioStats() {
    let totalInvested = 0;
    let totalCurrent = 0;
    let totalGain = 0;
    
    portfolioData.forEach(fund => {
        totalInvested += fund.investedValue;
        totalCurrent += fund.currentValue;
        totalGain += fund.gainLoss;
    });
    
    const todayChange = (Math.random() * 3 - 1).toFixed(2);
    const xirr = 15.8 + (Math.random() - 0.5) * 0.5;
    
    // Update DOM elements
    document.getElementById('totalValue').textContent = formatCurrency(totalCurrent);
    document.getElementById('totalGain').textContent = formatCurrency(totalGain);
    document.getElementById('investedAmount').textContent = formatCurrency(totalInvested);
    document.getElementById('xirrValue').textContent = xirr.toFixed(2) + '%';
    
    document.getElementById('todayChange').textContent = 
        `${todayChange >= 0 ? '+' : ''}${todayChange}% today`;
    
    document.getElementById('overallReturn').textContent = 
        `${((totalGain / totalInvested) * 100).toFixed(2)}% overall`;
    
    // Update chart data
    updateCharts();
}

// Update market watch
function updateMarketWatch() {
    const container = document.getElementById('marketWatch');
    container.innerHTML = '';
    
    marketData.forEach(stock => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${stock.symbol}</div>
                <div style="font-size: 20px; font-weight: 700; margin-bottom: 5px;">
                    ${stock.value.toLocaleString('en-IN')}
                </div>
                <div style="color: ${stock.change >= 0 ? '#4cc9f0' : '#f72585'};">
                    ${stock.change >= 0 ? '↗' : '↘'} ${Math.abs(stock.change)}%
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initialize charts
function initializeCharts() {
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    
    // Performance Chart
    performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Portfolio Value',
                data: [22.5, 22.8, 23.2, 23.5, 23.8, 23.6, 23.9, 24.2, 24.5, 24.8, 25.1, 25.4],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'L';
                        }
                    }
                }
            }
        }
    });
    
    // Allocation Chart
    allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Equity Large Cap', 'Equity Small Cap', 'ELSS', 'Large & Mid Cap'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: [
                    '#4361ee',
                    '#4cc9f0',
                    '#f72585',
                    '#7209b7'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update charts with live data
function updateCharts() {
    if (!performanceChart || !allocationChart) return;
    
    // Update performance chart with random walk
    const currentData = performanceChart.data.datasets[0].data;
    const lastValue = currentData[currentData.length - 1];
    const newValue = lastValue + (Math.random() - 0.5) * 0.2;
    currentData.push(newValue);
    currentData.shift(); // Remove first element
    performanceChart.update();
    
    // Update allocation chart
    const total = portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
    const categories = {};
    
    portfolioData.forEach(fund => {
        categories[fund.category] = (categories[fund.category] || 0) + fund.currentValue;
    });
    
    const labels = Object.keys(categories);
    const data = Object.values(categories).map(value => (value / total * 100).toFixed(1));
    
    allocationChart.data.labels = labels;
    allocationChart.data.datasets[0].data = data;
    allocationChart.update();
}

// Refresh all data
function refreshAllData() {
    const btn = document.getElementById('refreshPortfolio');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update with small random changes
        portfolioData.forEach(fund => {
            fund.currentNav += (Math.random() - 0.5) * 2;
            fund.change = (Math.random() - 0.5) * 2;
            fund.currentValue = fund.units * fund.currentNav;
            fund.gainLoss = fund.currentValue - fund.investedValue;
        });
        
        // Update market data
        marketData.forEach(stock => {
            stock.value += (Math.random() - 0.5) * 50;
            stock.change = (Math.random() - 0.5) * 1;
        });
        
        // Update UI
        updatePortfolioTable();
        updatePortfolioStats();
        updateMarketWatch();
        
        // Show success message
        showToast('Portfolio data refreshed successfully!', 'success');
        
        // Restore button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}

// Start live updates
function startLiveUpdates() {
    // Update portfolio values every 30 seconds
    setInterval(() => {
        portfolioData.forEach(fund => {
            // Simulate small price changes
            const change = (Math.random() - 0.5) * 0.5;
            fund.currentNav += change;
            fund.change = parseFloat((fund.change + (Math.random() - 0.5) * 0.2).toFixed(2));
            fund.currentValue = fund.units * fund.currentNav;
            fund.gainLoss = fund.currentValue - fund.investedValue;
        });
        
        updatePortfolioTable();
        updatePortfolioStats();
        
        // Update last updated time
        updateTime();
    }, 30000);
    
    // Update market data every 15 seconds
    setInterval(() => {
        marketData.forEach(stock => {
            stock.value += (Math.random() - 0.5) * 20;
            stock.change = parseFloat((stock.change + (Math.random() - 0.5) * 0.1).toFixed(2));
        });
        
        updateMarketWatch();
    }, 15000);
}

// Export portfolio to CSV
function exportPortfolio() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fund Name,Category,Units,Avg Cost,Current NAV,Invested Value,Current Value,Gain/Loss,XIRR\n";
    
    portfolioData.forEach(fund => {
        const row = [
            fund.name,
            fund.category,
            fund.units,
            fund.avgCost,
            fund.currentNav,
            fund.investedValue,
            fund.currentValue,
            fund.gainLoss,
            fund.xirr
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
    
    showToast('Portfolio exported to CSV!', 'success');
}