// Sectors Analysis Module
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize user info
    const currentUser = Auth.getCurrentUser();
    if (currentUser && currentUser.avatar) {
        document.getElementById('userAvatar').textContent = currentUser.avatar;
    }

    // Sample sectors data
    const sectorsData = [
        {
            id: 'sector_001',
            name: 'Technology',
            icon: 'fas fa-laptop-code',
            color: '#2563eb',
            description: 'Software, IT Services, Hardware',
            performance: 12.5,
            change: 2.3,
            risk: 'high',
            funds: 28,
            aum: 125000,
            peRatio: 32.5,
            marketCap: 4500000,
            trend: 'up'
        },
        {
            id: 'sector_002',
            name: 'Banking & Finance',
            icon: 'fas fa-university',
            color: '#10b981',
            description: 'Banks, NBFCs, Insurance',
            performance: 6.8,
            change: 0.8,
            risk: 'medium',
            funds: 22,
            aum: 185000,
            peRatio: 18.2,
            marketCap: 3800000,
            trend: 'up'
        },
        {
            id: 'sector_003',
            name: 'Pharmaceuticals',
            icon: 'fas fa-pills',
            color: '#8b5cf6',
            description: 'Drugs, Healthcare, Biotech',
            performance: 8.2,
            change: 1.2,
            risk: 'medium',
            funds: 15,
            aum: 75000,
            peRatio: 25.8,
            marketCap: 1200000,
            trend: 'up'
        },
        {
            id: 'sector_004',
            name: 'Automobile',
            icon: 'fas fa-car',
            color: '#f59e0b',
            description: 'Auto Manufacturers, Components',
            performance: 4.5,
            change: -0.5,
            risk: 'medium',
            funds: 12,
            aum: 45000,
            peRatio: 22.3,
            marketCap: 950000,
            trend: 'neutral'
        },
        {
            id: 'sector_005',
            name: 'Energy',
            icon: 'fas fa-bolt',
            color: '#ef4444',
            description: 'Oil & Gas, Renewable Energy',
            performance: 9.2,
            change: 1.8,
            risk: 'high',
            funds: 18,
            aum: 92000,
            peRatio: 28.5,
            marketCap: 2100000,
            trend: 'up'
        },
        {
            id: 'sector_006',
            name: 'FMCG',
            icon: 'fas fa-shopping-cart',
            color: '#ec4899',
            description: 'Consumer Goods, Retail',
            performance: 5.2,
            change: 0.3,
            risk: 'low',
            funds: 14,
            aum: 68000,
            peRatio: 45.2,
            marketCap: 850000,
            trend: 'up'
        },
        {
            id: 'sector_007',
            name: 'Infrastructure',
            icon: 'fas fa-hard-hat',
            color: '#14b8a6',
            description: 'Construction, Cement, Engineering',
            performance: 7.8,
            change: 1.5,
            risk: 'high',
            funds: 16,
            aum: 52000,
            peRatio: 19.8,
            marketCap: 780000,
            trend: 'up'
        },
        {
            id: 'sector_008',
            name: 'Real Estate',
            icon: 'fas fa-building',
            color: '#f97316',
            description: 'Housing, Commercial Real Estate',
            performance: -3.2,
            change: -1.2,
            risk: 'high',
            funds: 10,
            aum: 38000,
            peRatio: 15.2,
            marketCap: 650000,
            trend: 'down'
        },
        {
            id: 'sector_009',
            name: 'Telecom',
            icon: 'fas fa-satellite-dish',
            color: '#06b6d4',
            description: 'Telecommunications Services',
            performance: 3.8,
            change: 0.2,
            risk: 'medium',
            funds: 8,
            aum: 42000,
            peRatio: 20.5,
            marketCap: 720000,
            trend: 'neutral'
        },
        {
            id: 'sector_010',
            name: 'Metals & Mining',
            icon: 'fas fa-mountain',
            color: '#84cc16',
            description: 'Steel, Aluminum, Mining',
            performance: 6.5,
            change: 0.9,
            risk: 'high',
            funds: 11,
            aum: 35000,
            peRatio: 12.8,
            marketCap: 580000,
            trend: 'up'
        }
    ];

    // Sample sectoral funds data
    const sectoralFunds = [
        {
            id: 'sf_001',
            name: 'ICICI Prudential Technology Fund',
            sector: 'technology',
            returns1Y: 25.4,
            returns3Y: 22.1,
            risk: 'high',
            aum: 8500,
            rating: 4.7
        },
        {
            id: 'sf_002',
            name: 'SBI Banking & Financial Services Fund',
            sector: 'banking',
            returns1Y: 18.2,
            returns3Y: 16.5,
            risk: 'medium',
            aum: 12500,
            rating: 4.5
        },
        {
            id: 'sf_003',
            name: 'Nippon India Pharma Fund',
            sector: 'pharma',
            returns1Y: 15.8,
            returns3Y: 14.2,
            risk: 'medium',
            aum: 6800,
            rating: 4.3
        },
        {
            id: 'sf_004',
            name: 'Tata Digital India Fund',
            sector: 'technology',
            returns1Y: 28.5,
            returns3Y: 24.8,
            risk: 'high',
            aum: 5200,
            rating: 4.8
        },
        {
            id: 'sf_005',
            name: 'Aditya Birla Sun Life Banking & Financial Services Fund',
            sector: 'banking',
            returns1Y: 16.8,
            returns3Y: 15.2,
            risk: 'medium',
            aum: 9200,
            rating: 4.4
        },
        {
            id: 'sf_006',
            name: 'Kotak Healthcare Fund',
            sector: 'pharma',
            returns1Y: 14.2,
            returns3Y: 13.5,
            risk: 'medium',
            aum: 4500,
            rating: 4.2
        },
        {
            id: 'sf_007',
            name: 'HDFC Manufacturing Fund',
            sector: 'infrastructure',
            returns1Y: 12.8,
            returns3Y: 11.9,
            risk: 'high',
            aum: 3800,
            rating: 4.1
        },
        {
            id: 'sf_008',
            name: 'Axis Energy Fund',
            sector: 'energy',
            returns1Y: 21.5,
            returns3Y: 19.8,
            risk: 'high',
            aum: 2900,
            rating: 4.6
        }
    ];

    // DOM Elements
    const sectorsGrid = document.getElementById('sectorsGrid');
    const fundsTableBody = document.getElementById('fundsTableBody');
    const sectorFundFilter = document.getElementById('sectorFundFilter');
    const timeFilterBtns = document.querySelectorAll('.time-btn');
    const logoutBtns = document.querySelectorAll('.logout-btn');

    // State
    let currentPeriod = '1M';
    let selectedSectorFilter = 'all';

    // Initialize
    function init() {
        renderSectors();
        renderSectoralFunds();
        setupChart();
        setupEventListeners();
    }

    // Render sectors to grid
    function renderSectors() {
        sectorsGrid.innerHTML = '';

        sectorsData.forEach(sector => {
            const sectorCard = createSectorCard(sector);
            sectorsGrid.appendChild(sectorCard);
        });
    }

    // Create sector card element
    function createSectorCard(sector) {
        const card = document.createElement('div');
        card.className = 'sector-card';
        card.dataset.id = sector.id;

        const riskLabels = {
            low: 'Low Risk',
            medium: 'Medium Risk',
            high: 'High Risk'
        };

        const riskClasses = {
            low: 'risk-low',
            medium: 'risk-medium',
            high: 'risk-high'
        };

        card.innerHTML = `
            <div class="sector-header">
                <div class="sector-info">
                    <div class="sector-icon" style="background: ${sector.color}20; color: ${sector.color}">
                        <i class="${sector.icon}"></i>
                    </div>
                    <div class="sector-details">
                        <h3>${sector.name}</h3>
                        <p>${sector.description}</p>
                    </div>
                </div>
                <div class="sector-performance">
                    <div class="performance-value ${sector.performance >= 0 ? 'positive' : 'negative'}">
                        ${sector.performance >= 0 ? '+' : ''}${sector.performance.toFixed(1)}%
                    </div>
                    <div class="performance-change ${sector.change >= 0 ? 'positive' : 'negative'}">
                        ${sector.change >= 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'}
                        ${Math.abs(sector.change).toFixed(1)}%
                    </div>
                </div>
            </div>
            <div class="sector-body">
                <div class="sector-stats">
                    <div class="stat-item">
                        <label>Funds</label>
                        <div class="stat-value">${sector.funds}</div>
                    </div>
                    <div class="stat-item">
                        <label>AUM</label>
                        <div class="stat-value">₹${(sector.aum / 1000).toFixed(0)}K Cr</div>
                    </div>
                    <div class="stat-item">
                        <label>P/E Ratio</label>
                        <div class="stat-value">${sector.peRatio}</div>
                    </div>
                    <div class="stat-item">
                        <label>Risk</label>
                        <div class="stat-value">
                            <span class="risk-badge ${riskClasses[sector.risk]}">${riskLabels[sector.risk]}</span>
                        </div>
                    </div>
                </div>
                <div class="sector-actions">
                    <button class="btn-sm btn-outline view-funds" data-sector="${sector.name.toLowerCase()}">
                        <i class="fas fa-eye"></i> View Funds
                    </button>
                    <button class="btn-sm btn-primary analyze-sector" data-sector="${sector.id}">
                        <i class="fas fa-chart-line"></i> Analyze
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        card.querySelector('.view-funds').addEventListener('click', () => {
            viewSectorFunds(sector.name);
        });

        card.querySelector('.analyze-sector').addEventListener('click', () => {
            analyzeSector(sector);
        });

        return card;
    }

    // Render sectoral funds table
    function renderSectoralFunds() {
        fundsTableBody.innerHTML = '';

        const filteredFunds = selectedSectorFilter === 'all' 
            ? sectoralFunds 
            : sectoralFunds.filter(fund => fund.sector === selectedSectorFilter);

        filteredFunds.forEach(fund => {
            const row = createFundTableRow(fund);
            fundsTableBody.appendChild(row);
        });
    }

    // Create fund table row
    function createFundTableRow(fund) {
        const row = document.createElement('tr');
        
        const riskClasses = {
            low: 'risk-low',
            medium: 'risk-medium',
            high: 'risk-high'
        };

        const riskLabels = {
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        };

        // Generate star rating
        const fullStars = Math.floor(fund.rating);
        const emptyStars = 5 - fullStars;
        const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

        row.innerHTML = `
            <td>
                <strong>${fund.name}</strong>
            </td>
            <td>
                <span class="sector-tag">${fund.sector.charAt(0).toUpperCase() + fund.sector.slice(1)}</span>
            </td>
            <td class="return-cell ${fund.returns1Y >= 0 ? 'positive' : 'negative'}">
                ${fund.returns1Y >= 0 ? '+' : ''}${fund.returns1Y.toFixed(1)}%
            </td>
            <td class="return-cell ${fund.returns3Y >= 0 ? 'positive' : 'negative'}">
                ${fund.returns3Y >= 0 ? '+' : ''}${fund.returns3Y.toFixed(1)}%
            </td>
            <td>
                <span class="risk-badge ${riskClasses[fund.risk]}">${riskLabels[fund.risk]}</span>
            </td>
            <td>₹${(fund.aum / 1000).toFixed(1)}K</td>
            <td>
                <span class="rating-stars">${stars}</span>
                <span style="margin-left: 5px; font-weight: 600;">${fund.rating.toFixed(1)}</span>
            </td>
            <td>
                <button class="action-btn invest-btn" data-id="${fund.id}">
                    <i class="fas fa-rupee-sign"></i> Invest
                </button>
            </td>
        `;

        // Add event listener to invest button
        row.querySelector('.invest-btn').addEventListener('click', () => {
            startInvestment(fund);
        });

        return row;
    }

    // Setup comparison chart
    function setupChart() {
        const ctx = document.getElementById('sectorComparisonChart').getContext('2d');
        
        const sectors = sectorsData.map(s => s.name);
        const performances = sectorsData.map(s => s.performance);

        // Generate colors based on performance
        const backgroundColors = performances.map(p => 
            p > 8 ? 'rgba(16, 185, 129, 0.7)' : 
            p > 0 ? 'rgba(245, 158, 11, 0.7)' : 
            'rgba(239, 68, 68, 0.7)'
        );

        const borderColors = performances.map(p => 
            p > 8 ? '#10b981' : 
            p > 0 ? '#f59e0b' : 
            '#ef4444'
        );

        window.sectorChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectors,
                datasets: [{
                    label: '1Y Performance (%)',
                    data: performances,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw >= 0 ? '+' : ''}${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Returns (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value >= 0 ? '+' + value + '%' : value + '%';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    // View funds for a specific sector
    function viewSectorFunds(sectorName) {
        selectedSectorFilter = sectorName.toLowerCase().split(' ')[0];
        sectorFundFilter.value = selectedSectorFilter;
        renderSectoralFunds();
        
        // Scroll to funds section
        document.querySelector('.funds-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Analyze sector (detailed view)
    function analyzeSector(sector) {
        alert(`Analyzing ${sector.name} sector...\nPerformance: ${sector.performance}%\nRisk Level: ${sector.risk}\nNumber of Funds: ${sector.funds}`);
        
        // In a real app, this would open a detailed analysis modal
        // showSectorAnalysisModal(sector);
    }

    // Start investment process
    function startInvestment(fund) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            alert('Please login to invest');
            return;
        }

        const confirmInvest = confirm(`Invest in ${fund.name}?\nSector: ${fund.sector}\n1Y Returns: ${fund.returns1Y}%\nRisk: ${fund.risk}`);
        
        if (confirmInvest) {
            // Show success message
            showNotification(`Investment initiated for ${fund.name}`, 'success');
            
            // In a real app, redirect to investment page
            // window.location.href = `invest.html?fund=${fund.id}`;
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Add keyframes for animation
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Time period filter
        timeFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                timeFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.dataset.period;
                
                // Update data based on period (in real app, fetch new data)
                console.log(`Period changed to: ${currentPeriod}`);
            });
        });

        // Sector fund filter
        sectorFundFilter.addEventListener('change', function() {
            selectedSectorFilter = this.value;
            renderSectoralFunds();
        });

        // Strategy buttons
        document.querySelectorAll('.strategy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const strategy = this.closest('.strategy-card').querySelector('h3').textContent;
                showNotification(`Exploring ${strategy} investment strategy`, 'info');
            });
        });

        // Logout
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                Auth.logout();
                localStorage.removeItem('infinity_auth');
                localStorage.removeItem('infinity_user');
                window.location.href = 'index.html';
            });
        });
    }

    // Initialize the page
    init();
});