// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentModule = 'dashboard';
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeModuleCards();
        this.loadDataTables();
        this.setupEventListeners();
        this.updateLiveData();
        
        // Auto-refresh data every 30 seconds
        setInterval(() => this.updateLiveData(), 30000);
    }

    initializeNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const module = link.getAttribute('data-module');
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show module page
                this.showModule(module);
            });
        });

        // Default to dashboard
        this.showModule('dashboard');
    }

    initializeModuleCards() {
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                const module = card.getAttribute('data-module');
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelector(`.nav-link[data-module="${module}"]`)?.classList.add('active');
                
                // Show module page
                this.showModule(module);
            });
        });
    }

    showModule(module) {
        // Hide all module pages
        document.querySelectorAll('.module-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected module
        const modulePage = document.getElementById(module);
        if (modulePage) {
            modulePage.classList.add('active');
            this.currentModule = module;
            
            // Update page title
            this.updatePageTitle(module);
            
            // Load module-specific data
            this.loadModuleData(module);
        }
    }

    updatePageTitle(module) {
        const titles = {
            'dashboard': 'Dashboard Overview',
            'users': 'User Management',
            'funds': 'Fund Master Database',
            'transactions': 'Transaction Management',
            'portfolio': 'Portfolio Management',
            'performance': 'Performance Analytics',
            'research': 'Research & Screening',
            'reports': 'Reporting Module',
            'compliance': 'Compliance & Regulatory',
            'alerts': 'Alerts & Notifications',
            'taxation': 'Taxation Module',
            'settings': 'System Settings'
        };
        
        const descriptions = {
            'dashboard': 'Complete mutual fund portfolio management system',
            'users': 'Manage administrators, advisors, and investor accounts',
            'funds': 'Comprehensive mutual fund database with real-time NAV updates',
            'transactions': 'Process investments, redemptions, switches, and SIPs',
            'portfolio': 'Track and analyze investment portfolios in real-time',
            'performance': 'Advanced analytics and performance metrics',
            'research': 'Advanced fund screening and research tools',
            'reports': 'Generate comprehensive reports and statements',
            'compliance': 'Ensure regulatory compliance and KYC verification',
            'alerts': 'Real-time alerts and notification management',
            'taxation': 'Calculate taxes and optimize for tax efficiency',
            'settings': 'Configure system preferences and integrations'
        };
        
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');
        
        if (pageTitle) pageTitle.textContent = titles[module] || module;
        if (pageDescription) pageDescription.textContent = descriptions[module] || '';
    }

    loadDataTables() {
        // Sample fund data
        const funds = [
            { name: 'HDFC Top 100 Fund', amc: 'HDFC Mutual Fund', category: 'Equity Large Cap', nav: 615.20, change: 1.2, aum: 24500, return: 18.2, risk: 'Medium' },
            { name: 'ICICI Pru Bluechip Fund', amc: 'ICICI Prudential', category: 'Equity Large Cap', nav: 560.75, change: 0.8, aum: 18700, return: 16.8, risk: 'Low' },
            { name: 'SBI Small Cap Fund', amc: 'SBI Mutual Fund', category: 'Equity Small Cap', nav: 120.25, change: 2.5, aum: 8900, return: 40.8, risk: 'High' },
            { name: 'Axis Long Term Equity', amc: 'Axis Mutual Fund', category: 'ELSS', nav: 410.25, change: -0.5, aum: 12500, return: 20.5, risk: 'Medium' },
            { name: 'Mirae Asset Emerging', amc: 'Mirae Asset', category: 'Equity Large & Mid Cap', nav: 350.20, change: 1.8, aum: 9800, return: 24.8, risk: 'Medium' }
        ];

        // Load fund table
        const fundTableBody = document.getElementById('fundTableBody');
        if (fundTableBody) {
            fundTableBody.innerHTML = '';
            funds.forEach(fund => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${fund.name}</strong></td>
                    <td>${fund.amc}</td>
                    <td>${fund.category}</td>
                    <td>₹${fund.nav.toFixed(2)}</td>
                    <td class="${fund.change >= 0 ? 'positive' : 'negative'}">${fund.change >= 0 ? '+' : ''}${fund.change}%</td>
                    <td>₹${fund.aum.toLocaleString()} Cr</td>
                    <td class="${fund.return >= 0 ? 'positive' : 'negative'}">${fund.return}%</td>
                    <td>${fund.risk}</td>
                `;
                fundTableBody.appendChild(row);
            });
        }

        // Sample portfolio data
        const portfolio = [
            { fund: 'HDFC Top 100 Fund', units: 450.25, avgCost: 520.50, currentNav: 615.20, invested: 234500, current: 276834, gain: 42334, xirr: 15.8 },
            { fund: 'ICICI Pru Bluechip Fund', units: 320.50, avgCost: 480.25, currentNav: 560.75, invested: 154000, current: 179680, gain: 25680, xirr: 14.2 },
            { fund: 'SBI Small Cap Fund', units: 150.75, avgCost: 85.50, currentNav: 120.25, invested: 12889, current: 18128, gain: 5239, xirr: 32.5 }
        ];

        // Load portfolio table
        const portfolioTableBody = document.getElementById('portfolioTableBody');
        if (portfolioTableBody) {
            portfolioTableBody.innerHTML = '';
            portfolio.forEach(holding => {
                const gainPercentage = ((holding.gain / holding.invested) * 100).toFixed(2);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${holding.fund}</strong></td>
                    <td>${holding.units}</td>
                    <td>₹${holding.avgCost.toFixed(2)}</td>
                    <td>₹${holding.currentNav.toFixed(2)}</td>
                    <td>₹${holding.invested.toLocaleString()}</td>
                    <td>₹${holding.current.toLocaleString()}</td>
                    <td class="${holding.gain >= 0 ? 'positive' : 'negative'}">
                        ₹${holding.gain.toLocaleString()} (${gainPercentage}%)
                    </td>
                    <td class="positive">${holding.xirr}%</td>
                `;
                portfolioTableBody.appendChild(row);
            });
        }
    }

    loadModuleData(module) {
        switch(module) {
            case 'funds':
                this.updateFundPrices();
                break;
                
            case 'portfolio':
                this.updatePortfolioValuation();
                break;
                
            case 'transactions':
                this.updateTransactionStatus();
                break;
                
            case 'alerts':
                this.checkNewAlerts();
                break;
        }
    }

    updateLiveData() {
        this.updateFundPrices();
        this.updatePortfolioValuation();
        this.updateCurrentTime();
    }

    updateFundPrices() {
        // Simulate fund price updates
        const fundRows = document.querySelectorAll('#fundTableBody tr');
        fundRows.forEach(row => {
            const change = (Math.random() - 0.5) * 0.5;
            const navCell = row.querySelector('td:nth-child(4)');
            const changeCell = row.querySelector('td:nth-child(5)');
            
            if (navCell && changeCell) {
                const currentNav = parseFloat(navCell.textContent.replace('₹', ''));
                const newNav = currentNav + change;
                const currentChange = parseFloat(changeCell.textContent);
                const newChange = currentChange + (Math.random() - 0.5) * 0.2;
                
                navCell.textContent = `₹${newNav.toFixed(2)}`;
                changeCell.textContent = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%`;
                changeCell.className = newChange >= 0 ? 'positive' : 'negative';
            }
        });
    }

    updatePortfolioValuation() {
        // Calculate total portfolio value
        let totalInvested = 0;
        let totalCurrent = 0;
        
        const portfolioRows = document.querySelectorAll('#portfolioTableBody tr');
        portfolioRows.forEach(row => {
            const investedCell = row.querySelector('td:nth-child(5)');
            const currentCell = row.querySelector('td:nth-child(6)');
            
            if (investedCell && currentCell) {
                const invested = parseFloat(investedCell.textContent.replace(/[₹,]/g, ''));
                const current = parseFloat(currentCell.textContent.replace(/[₹,]/g, ''));
                
                totalInvested += invested;
                totalCurrent += current;
                
                // Update gain/loss
                const gain = current - invested;
                const gainPercentage = ((gain / invested) * 100).toFixed(2);
                const gainCell = row.querySelector('td:nth-child(7)');
                
                if (gainCell) {
                    gainCell.innerHTML = `
                        ₹${gain.toLocaleString()} (${gainPercentage}%)
                    `;
                    gainCell.className = gain >= 0 ? 'positive' : 'negative';
                }
            }
        });
        
        // Update dashboard stats
        const portfolioValue = document.querySelector('.stat-card .stat-value');
        if (portfolioValue && totalCurrent > 0) {
            const formattedValue = Utils.formatCurrency(totalCurrent, '₹');
            portfolioValue.textContent = formattedValue;
            
            // Update gain percentage
            const totalGain = ((totalCurrent - totalInvested) / totalInvested) * 100;
            const gainChange = document.querySelector('.stat-change.positive');
            if (gainChange) {
                gainChange.innerHTML = `
                    <i class="fas fa-arrow-up"></i>
                    ${totalGain.toFixed(1)}% today
                `;
            }
        }
    }

    updateTransactionStatus() {
        // In a real app, this would check backend for transaction updates
        console.log('Updating transaction status...');
    }

    checkNewAlerts() {
        // In a real app, this would check backend for new alerts
        console.log('Checking for new alerts...');
    }

    updateCurrentTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        // Update in header if needed
        const timeElement = document.querySelector('.live-indicator');
        if (timeElement) {
            timeElement.querySelector('span:last-child').textContent = `Live - ${timeStr}`;
        }
    }

    setupEventListeners() {
        // Form submissions
        const investmentForm = document.getElementById('investmentForm');
        if (investmentForm) {
            investmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('Investment processed successfully!', 'success');
            });
        }

        // Settings save
        const saveSettingsBtn = document.querySelector('#settings .btn-primary');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                Utils.showNotification('Settings saved successfully!', 'success');
            });
        }

        // Report generation buttons
        document.querySelectorAll('#reports .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                const reportType = btn.closest('.stat-card').querySelector('.module-title').textContent;
                Utils.showNotification(`Generating ${reportType}...`, 'info');
            });
        });

        // Responsive menu for mobile
        this.setupResponsiveMenu();
    }

    setupResponsiveMenu() {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--primary-color);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        `;
        
        document.body.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Check screen size for mobile
        const checkScreenSize = () => {
            if (window.innerWidth <= 992) {
                mobileMenuBtn.style.display = 'flex';
            } else {
                mobileMenuBtn.style.display = 'none';
                document.querySelector('.sidebar').classList.remove('active');
            }
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('infinity_user');
    if (!isLoggedIn && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    window.dashboard = new Dashboard();
});