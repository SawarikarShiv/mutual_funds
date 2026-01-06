/**
 * Infinity Mutual Funds - Dashboard JavaScript
 */

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.portfolioData = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.initializeComponents();
        this.bindEvents();
        this.loadData();
    }

    checkAuth() {
        const user = localStorage.getItem('infinity_user');
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        this.currentUser = JSON.parse(user);
    }

    loadUserData() {
        // Update UI with user data
        const userElements = {
            'userName': this.currentUser.name?.split(' ')[0] || 'User',
            'userFullName': this.currentUser.name || 'Demo User',
            'userEmail': this.currentUser.email || 'demo@infinityfunds.com'
        };

        for (const [id, value] of Object.entries(userElements)) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }

        // Set user avatar initials
        const initialsElement = document.getElementById('userInitials');
        if (initialsElement && this.currentUser.name) {
            const initials = this.currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            initialsElement.textContent = initials;
        }
    }

    initializeComponents() {
        this.initializeSidebar();
        this.initializeCharts();
        this.initializeModals();
    }

    initializeSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Handle navigation clicks
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    initializeCharts() {
        // This will be initialized by charts.js
        // We'll store chart references here
        this.charts = {
            growth: null,
            allocation: null,
            returns: null,
            performance: null
        };
    }

    initializeModals() {
        // Modal handling
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('show');
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    bindEvents() {
        // User dropdown
        const userProfileBtn = document.getElementById('userProfileBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }

        // Notifications
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationsPanel = document.getElementById('notificationsPanel');
        
        if (notificationsBtn && notificationsPanel) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsPanel.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                notificationsPanel.classList.remove('show');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('i');
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            });

            // Load saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.querySelector('i').classList.remove('fa-moon');
                themeToggle.querySelector('i').classList.add('fa-sun');
            }
        }

        // Logout
        document.querySelectorAll('#logoutBtn, #logoutDropdownBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.id;
                this.handleQuickAction(action);
            });
        });

        // Add fund button
        const addFundBtn = document.getElementById('addFundBtn');
        if (addFundBtn) {
            addFundBtn.addEventListener('click', () => {
                this.showAddFundModal();
            });
        }

        // Search functionality
        const fundSearch = document.getElementById('fundSearch');
        if (fundSearch) {
            fundSearch.addEventListener('input', (e) => {
                this.filterPortfolio(e.target.value);
            });
        }

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchAll(e.target.value);
                }
            });
        }

        // Mark all notifications as read
        const markAllReadBtn = document.getElementById('markAllRead');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }
    }

    loadData() {
        this.loadPortfolio();
        this.loadTransactions();
        this.loadNotifications();
        this.loadStats();
    }

    async loadPortfolio() {
        try {
            // Simulate API call
            const response = await this.simulateApiCall('/api/portfolio');
            this.portfolioData = response.data;
            this.renderPortfolioTable();
            this.updatePortfolioStats();
        } catch (error) {
            console.error('Error loading portfolio:', error);
            this.showToast('Failed to load portfolio data', 'error');
        }
    }

    async loadTransactions() {
        try {
            const response = await this.simulateApiCall('/api/transactions');
            this.renderTransactions(response.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    async loadNotifications() {
        try {
            const response = await this.simulateApiCall('/api/notifications');
            this.renderNotifications(response.data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    async loadStats() {
        try {
            const response = await this.simulateApiCall('/api/stats');
            this.updateDashboardStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderPortfolioTable() {
        const tableBody = document.getElementById('portfolioTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.portfolioData.forEach((fund, index) => {
            const row = document.createElement('tr');
            row.innerHTML = this.getPortfolioRowHTML(fund, index);
            tableBody.appendChild(row);
        });

        // Update portfolio count
        const portfolioCountElement = document.getElementById('portfolioCount');
        if (portfolioCountElement) {
            portfolioCountElement.textContent = this.portfolioData.length;
        }

        // Add event listeners to action buttons
        this.addPortfolioActionListeners();
    }

    getPortfolioRowHTML(fund, index) {
        return `
            <td>
                <div class="fund-name">
                    <div class="fund-logo" style="background: ${this.getFundColor(index)}">
                        ${fund.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="fund-details">
                        <h4>${fund.name}</h4>
                        <p>NAV: ₹${fund.currentNav.toFixed(2)}</p>
                    </div>
                </div>
            </td>
            <td>
                <span class="fund-type">${fund.type}</span>
            </td>
            <td>${fund.units.toFixed(2)}</td>
            <td>₹${fund.avgCost.toFixed(2)}</td>
            <td>₹${fund.currentValue.toLocaleString('en-IN')}</td>
            <td>
                <span class="returns ${fund.returns >= 0 ? 'positive' : 'negative'}">
                    ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <div class="action-icon edit" data-id="${fund.id}">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-icon delete" data-id="${fund.id}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </td>
        `;
    }

    getFundColor(index) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        ];
        return colors[index % colors.length];
    }

    addPortfolioActionListeners() {
        // Edit buttons
        document.querySelectorAll('.action-icon.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = btn.getAttribute('data-id');
                this.editFund(fundId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.action-icon.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = btn.getAttribute('data-id');
                this.deleteFund(fundId);
            });
        });
    }

    renderTransactions(transactions) {
        const tableBody = document.getElementById('transactionsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                <td>
                    <span class="fund-type">${transaction.type}</span>
                </td>
                <td>${transaction.fund}</td>
                <td>₹${transaction.amount.toLocaleString('en-IN')}</td>
                <td>
                    <span class="status-indicator ${transaction.status}">
                        ${transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderNotifications(notifications) {
        const notificationsList = document.getElementById('notificationsList');
        if (!notificationsList) return;

        notificationsList.innerHTML = '';

        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge counts
        const notificationBadge = document.querySelector('.notification-badge');
        const alertsCount = document.getElementById('alertsCount');
        
        if (notificationBadge) notificationBadge.textContent = unreadCount;
        if (alertsCount) alertsCount.textContent = unreadCount;

        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            item.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-${notification.icon || 'bell'}"></i>
                </div>
                <div class="notification-content">
                    <h5>${notification.title}</h5>
                    <p>${notification.message}</p>
                    <small>${this.formatTimeAgo(notification.time)}</small>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            `;
            notificationsList.appendChild(item);
        });
    }

    updateDashboardStats(stats) {
        // Update total portfolio value
        const totalValueElement = document.getElementById('totalValue');
        if (totalValueElement) {
            totalValueElement.textContent = `₹${stats.totalValue.toLocaleString('en-IN')}`;
        }

        // Update total returns
        const totalReturnsElement = document.getElementById('totalReturns');
        if (totalReturnsElement) {
            totalReturnsElement.textContent = `₹${stats.totalReturns.toLocaleString('en-IN')}`;
        }

        // Update SIP value
        const sipValueElement = document.getElementById('sipValue');
        if (sipValueElement) {
            sipValueElement.textContent = `₹${stats.sipValue.toLocaleString('en-IN')}`;
        }

        // Update risk score
        const riskScoreElement = document.getElementById('riskScore');
        if (riskScoreElement) {
            riskScoreElement.textContent = stats.riskScore;
        }
    }

    updatePortfolioStats() {
        if (!this.portfolioData.length) return;

        const totalValue = this.portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
        const totalInvestment = this.portfolioData.reduce((sum, fund) => sum + (fund.units * fund.avgCost), 0);
        const totalReturns = totalValue - totalInvestment;
        const sipValue = this.portfolioData.reduce((sum, fund) => sum + (fund.sipAmount || 0), 0);

        const stats = {
            totalValue,
            totalReturns,
            sipValue,
            riskScore: this.calculateRiskScore()
        };

        this.updateDashboardStats(stats);
    }

    calculateRiskScore() {
        if (!this.portfolioData.length) return 'Low';

        const riskWeights = {
            'Equity': 0.8,
            'Hybrid': 0.5,
            'Debt': 0.3,
            'Money Market': 0.1
        };

        const totalValue = this.portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
        let riskScore = 0;

        this.portfolioData.forEach(fund => {
            const weight = riskWeights[fund.category] || 0.5;
            riskScore += (fund.currentValue / totalValue) * weight;
        });

        if (riskScore > 0.6) return 'High';
        if (riskScore > 0.3) return 'Medium';
        return 'Low';
    }

    filterPortfolio(searchTerm) {
        const rows = document.querySelectorAll('#portfolioTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    searchAll(term) {
        if (!term.trim()) return;

        // Search across different data sources
        const results = {
            portfolio: this.portfolioData.filter(fund => 
                fund.name.toLowerCase().includes(term.toLowerCase()) ||
                fund.type.toLowerCase().includes(term.toLowerCase())
            ),
            // In a real app, you would search transactions, funds database, etc.
        };

        this.showSearchResults(results, term);
    }

    showSearchResults(results, term) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Search Results for "${term}"</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.getSearchResultsHTML(results)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    getSearchResultsHTML(results) {
        let html = '';

        if (results.portfolio.length > 0) {
            html += `
                <h4 style="color: white; margin-top: 0;">Portfolio Holdings (${results.portfolio.length})</h4>
                <div style="max-height: 200px; overflow-y: auto;">
            `;
            
            results.portfolio.forEach(fund => {
                html += `
                    <div style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: white;">${fund.name}</strong>
                                <div style="color: #94a3b8; font-size: 12px;">${fund.type}</div>
                            </div>
                            <span style="color: ${fund.returns >= 0 ? '#10b981' : '#ef4444'};">
                                ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<p style="color: #94a3b8; text-align: center; padding: 20px;">No results found</p>';
        }

        return html;
    }

    navigateToPage(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });

        // Update page title
        const pageTitles = {
            'dashboard': 'Dashboard',
            'portfolio': 'Portfolio',
            'analytics': 'Analytics',
            'transactions': 'Transactions',
            'sip': 'SIP Manager',
            'goals': 'Goals',
            'reports': 'Tax Reports',
            'alerts': 'Alerts',
            'settings': 'Settings',
            'help': 'Help & Support'
        };

        const pageTitleElement = document.querySelector('.page-title h1');
        if (pageTitleElement) {
            pageTitleElement.innerHTML = `${pageTitles[page] || 'Page'} <span style="font-size: 14px; color: #94a3b8;">| Infinity Funds</span>`;
        }

        // Show loading state
        this.showLoading();

        // In a real app, you would load the page content via AJAX
        setTimeout(() => {
            this.hideLoading();
            this.showToast(`Navigated to ${pageTitles[page] || page}`, 'info');
        }, 500);
    }

    handleQuickAction(action) {
        const actions = {
            'addInvestment': () => this.showAddFundModal(),
            'startSIP': () => this.showSIPModal(),
            'withdrawFunds': () => this.showWithdrawalModal(),
            'generateReport': () => this.generateReport()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    showAddFundModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Investment</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="modal-form" id="addFundForm">
                        <div class="form-group">
                            <label for="fundSearchInput">Search Mutual Fund</label>
                            <div style="position: relative;">
                                <input type="text" id="fundSearchInput" placeholder="Type to search 2000+ funds..." autocomplete="off">
                                <div id="fundSearchResults" style="position: absolute; top: 100%; left: 0; right: 0; background: rgba(30,41,59,0.95); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; margin-top: 5px; max-height: 200px; overflow-y: auto; display: none; z-index: 1000;"></div>
                            </div>
                        </div>
                        
                        <div id="fundDetails" style="display: none;">
                            <div class="form-group">
                                <label for="investmentAmount">Investment Amount (₹)</label>
                                <input type="number" id="investmentAmount" placeholder="e.g., 10000" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="investmentDate">Investment Date</label>
                                <input type="date" id="investmentDate" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="investmentType">Investment Type</label>
                                <select id="investmentType" required>
                                    <option value="">Select type</option>
                                    <option value="lumpsum">Lumpsum</option>
                                    <option value="sip">SIP (Monthly)</option>
                                    <option value="stp">STP</option>
                                    <option value="swp">SWP</option>
                                </select>
                            </div>
                            
                            <div class="form-group" id="sipDetails" style="display: none;">
                                <label for="sipDate">SIP Date (Monthly)</label>
                                <input type="number" id="sipDate" min="1" max="31" placeholder="e.g., 5 for 5th of every month">
                            </div>
                            
                            <div class="form-group">
                                <label for="investmentGoal">Investment Goal (Optional)</label>
                                <select id="investmentGoal">
                                    <option value="">Select goal</option>
                                    <option value="retirement">Retirement</option>
                                    <option value="house">House Purchase</option>
                                    <option value="education">Children Education</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="emergency">Emergency Fund</option>
                                    <option value="wealth">Wealth Creation</option>
                                </select>
                            </div>
                            
                            <div class="modal-form-actions">
                                <button type="button" class="btn btn-glass" onclick="this.closest('.modal').classList.remove('show')">Cancel</button>
                                <button type="submit" class="btn btn-primary-gradient">Add Investment</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        modal.querySelector('#investmentDate').value = today;

        // Fund search functionality
        const fundSearchInput = modal.querySelector('#fundSearchInput');
        const fundSearchResults = modal.querySelector('#fundSearchResults');
        const fundDetails = modal.querySelector('#fundDetails');

        fundSearchInput.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                fundSearchResults.style.display = 'none';
                return;
            }

            // Simulate fund search
            const funds = await this.searchFunds(query);
            
            if (funds.length > 0) {
                fundSearchResults.innerHTML = funds.map(fund => `
                    <div style="padding: 10px 15px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1);" 
                         data-fund='${JSON.stringify(fund).replace(/'/g, "&#39;")}'>
                        <div style="font-weight: 500; color: white;">${fund.name}</div>
                        <div style="font-size: 12px; color: #94a3b8;">
                            ${fund.type} • ${fund.category} • Risk: ${fund.risk}
                        </div>
                    </div>
                `).join('');
                
                fundSearchResults.style.display = 'block';

                // Add click handlers
                fundSearchResults.querySelectorAll('div[data-fund]').forEach(item => {
                    item.addEventListener('click', () => {
                        const fund = JSON.parse(item.getAttribute('data-fund').replace(/&#39;/g, "'"));
                        fundSearchInput.value = fund.name;
                        fundSearchResults.style.display = 'none';
                        fundDetails.style.display = 'block';
                        
                        // Populate additional fields if needed
                        this.selectedFund = fund;
                    });
                });
            } else {
                fundSearchResults.innerHTML = '<div style="padding: 15px; color: #94a3b8; text-align: center;">No funds found</div>';
                fundSearchResults.style.display = 'block';
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!fundSearchResults.contains(e.target) && e.target !== fundSearchInput) {
                fundSearchResults.style.display = 'none';
            }
        });

        // Show/hide SIP details based on investment type
        const investmentType = modal.querySelector('#investmentType');
        const sipDetails = modal.querySelector('#sipDetails');
        
        investmentType.addEventListener('change', () => {
            sipDetails.style.display = investmentType.value === 'sip' ? 'block' : 'none';
        });

        // Form submission
        const form = modal.querySelector('#addFundForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addInvestment(form);
            modal.remove();
        });

        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async searchFunds(query) {
        // Simulated fund data
        const allFunds = [
            { id: 1, name: 'SBI Bluechip Fund', type: 'Large Cap', category: 'Equity', risk: 'High' },
            { id: 2, name: 'HDFC Balanced Advantage Fund', type: 'Balanced', category: 'Hybrid', risk: 'Medium' },
            { id: 3, name: 'ICICI Prudential Bluechip Fund', type: 'Large Cap', category: 'Equity', risk: 'High' },
            { id: 4, name: 'Axis Bluechip Fund', type: 'Large Cap', category: 'Equity', risk: 'High' },
            { id: 5, name: 'Kotak Standard Multicap Fund', type: 'Multi Cap', category: 'Equity', risk: 'High' },
            { id: 6, name: 'Nippon India Small Cap Fund', type: 'Small Cap', category: 'Equity', risk: 'Very High' },
            { id: 7, name: 'Aditya Birla Sun Life Liquid Fund', type: 'Liquid', category: 'Money Market', risk: 'Low' },
            { id: 8, name: 'UTI Nifty Index Fund', type: 'Index', category: 'Equity', risk: 'Medium' }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return allFunds.filter(fund =>
            fund.name.toLowerCase().includes(query.toLowerCase()) ||
            fund.type.toLowerCase().includes(query.toLowerCase())
        );
    }

    async addInvestment(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate data
        if (!data.investmentAmount || !data.investmentDate) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall('/api/investments', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            this.showToast('Investment added successfully', 'success');
            this.loadPortfolio(); // Refresh portfolio data
        } catch (error) {
            this.showToast('Failed to add investment', 'error');
        }
    }

    editFund(fundId) {
        const fund = this.portfolioData.find(f => f.id == fundId);
        if (!fund) return;

        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Investment</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="modal-form" id="editFundForm">
                        <div class="form-group">
                            <label>Fund Name</label>
                            <input type="text" value="${fund.name}" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        
                        <div class="form-group">
                            <label for="editUnits">Units</label>
                            <input type="number" id="editUnits" value="${fund.units}" step="0.01" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="editAvgCost">Average Cost (₹)</label>
                            <input type="number" id="editAvgCost" value="${fund.avgCost}" step="0.01" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="editCurrentNav">Current NAV (₹)</label>
                            <input type="number" id="editCurrentNav" value="${fund.currentNav}" step="0.01" required>
                        </div>
                        
                        <div class="modal-form-actions">
                            <button type="button" class="btn btn-glass" onclick="this.closest('.modal').classList.remove('show')">Cancel</button>
                            <button type="submit" class="btn btn-primary-gradient">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#editFundForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateFund(fundId, form);
            modal.remove();
        });

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async updateFund(fundId, form) {
        const formData = new FormData(form);
        const updates = Object.fromEntries(formData.entries());

        try {
            await this.simulateApiCall(`/api/investments/${fundId}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            this.showToast('Investment updated successfully', 'success');
            this.loadPortfolio(); // Refresh portfolio data
        } catch (error) {
            this.showToast('Failed to update investment', 'error');
        }
    }

    deleteFund(fundId) {
        if (!confirm('Are you sure you want to remove this fund from your portfolio?')) {
            return;
        }

        this.showLoading();
        
        setTimeout(async () => {
            try {
                await this.simulateApiCall(`/api/investments/${fundId}`, {
                    method: 'DELETE'
                });

                this.hideLoading();
                this.showToast('Fund removed from portfolio', 'success');
                this.loadPortfolio(); // Refresh portfolio data
            } catch (error) {
                this.hideLoading();
                this.showToast('Failed to remove fund', 'error');
            }
        }, 1000);
    }

    showSIPModal() {
        this.showToast('SIP setup feature coming soon!', 'info');
    }

    showWithdrawalModal() {
        this.showToast('Withdrawal feature coming soon!', 'info');
    }

    generateReport() {
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            
            const reportUrl = URL.createObjectURL(new Blob(
                [this.generateReportContent()],
                { type: 'application/pdf' }
            ));
            
            const link = document.createElement('a');
            link.href = reportUrl;
            link.download = `Infinity-Portfolio-Report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('Portfolio report downloaded', 'success');
        }, 2000);
    }

    generateReportContent() {
        // In a real app, this would generate an actual PDF
        // For now, we'll return a simple text representation
        return `
            Infinity Mutual Funds - Portfolio Report
            Generated on: ${new Date().toLocaleDateString()}
            
            Investor: ${this.currentUser?.name || 'Demo User'}
            Email: ${this.currentUser?.email || 'demo@infinityfunds.com'}
            
            PORTFOLIO SUMMARY
            Total Value: ₹${this.portfolioData.reduce((sum, f) => sum + f.currentValue, 0).toLocaleString('en-IN')}
            Total Returns: ₹${this.portfolioData.reduce((sum, f) => sum + (f.currentValue - (f.units * f.avgCost)), 0).toLocaleString('en-IN')}
            Number of Funds: ${this.portfolioData.length}
            
            HOLDINGS DETAILS
            ${this.portfolioData.map(fund => `
            ${fund.name}
            Type: ${fund.type}
            Units: ${fund.units.toFixed(2)}
            Avg Cost: ₹${fund.avgCost.toFixed(2)}
            Current Value: ₹${fund.currentValue.toLocaleString('en-IN')}
            Returns: ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
            ---
            `).join('')}
            
            DISCLAIMER
            This report is generated for informational purposes only.
            Past performance is not indicative of future returns.
            Mutual fund investments are subject to market risks.
            
            © ${new Date().getFullYear()} Infinity Financial Services Pvt. Ltd.
        `;
    }

    markAllNotificationsAsRead() {
        const notifications = document.querySelectorAll('.notification-item.unread');
        notifications.forEach(item => {
            item.classList.remove('unread');
            item.classList.add('read');
            const dot = item.querySelector('.notification-dot');
            if (dot) dot.remove();
        });

        // Update badge
        const notificationBadge = document.querySelector('.notification-badge');
        const alertsCount = document.getElementById('alertsCount');
        
        if (notificationBadge) notificationBadge.textContent = '0';
        if (alertsCount) alertsCount.textContent = '0';

        this.showToast('All notifications marked as read', 'success');
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('infinity_user');
            localStorage.removeItem('theme');
            window.location.href = 'index.html';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showLoading() {
        // Create loading overlay if it doesn't exist
        let loading = document.getElementById('loadingOverlay');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loadingOverlay';
            loading.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;
            loading.innerHTML = `
                <div style="text-align: center;">
                    <div class="loading" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <div style="color: white;">Loading...</div>
                </div>
            `;
            document.body.appendChild(loading);
        }
        loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return time.toLocaleDateString();
    }

    async simulateApiCall(url, options = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock data based on URL
        if (url === '/api/portfolio') {
            return {
                data: [
                    {
                        id: 1,
                        name: 'SBI Bluechip Fund',
                        type: 'Large Cap',
                        units: 150.25,
                        avgCost: 45.50,
                        currentNav: 52.75,
                        currentValue: 7925.69,
                        returns: 15.93,
                        category: 'Equity',
                        risk: 'High'
                    },
                    {
                        id: 2,
                        name: 'HDFC Balanced Fund',
                        type: 'Balanced',
                        units: 225.75,
                        avgCost: 32.40,
                        currentNav: 35.20,
                        currentValue: 7946.40,
                        returns: 8.64,
                        category: 'Hybrid',
                        risk: 'Medium'
                    },
                    {
                        id: 3,
                        name: 'ICICI Prudential Bond Fund',
                        type: 'Corporate Bond',
                        units: 500.00,
                        avgCost: 12.50,
                        currentNav: 13.10,
                        currentValue: 6550.00,
                        returns: 4.80,
                        category: 'Debt',
                        risk: 'Low'
                    },
                    {
                        id: 4,
                        name: 'Axis Small Cap Fund',
                        type: 'Small Cap',
                        units: 85.50,
                        avgCost: 58.75,
                        currentNav: 52.30,
                        currentValue: 4471.65,
                        returns: -10.98,
                        category: 'Equity',
                        risk: 'Very High'
                    },
                    {
                        id: 5,
                        name: 'Nippon India Liquid Fund',
                        type: 'Liquid',
                        units: 1000.00,
                        avgCost: 10.00,
                        currentNav: 10.02,
                        currentValue: 10020.00,
                        returns: 0.20,
                        category: 'Money Market',
                        risk: 'Low'
                    }
                ]
            };
        } else if (url === '/api/transactions') {
            return {
                data: [
                    {
                        date: '2024-01-15',
                        type: 'SIP',
                        fund: 'SBI Bluechip Fund',
                        amount: 5000,
                        status: 'completed'
                    },
                    {
                        date: '2024-01-10',
                        type: 'Lumpsum',
                        fund: 'HDFC Balanced Fund',
                        amount: 25000,
                        status: 'completed'
                    },
                    {
                        date: '2024-01-05',
                        type: 'Redemption',
                        fund: 'ICICI Prudential Bond Fund',
                        amount: 10000,
                        status: 'completed'
                    }
                ]
            };
        } else if (url === '/api/notifications') {
            return {
                data: [
                    {
                        id: 1,
                        title: 'SIP Due Tomorrow',
                        message: 'Your SIP for SBI Bluechip Fund is due tomorrow',
                        time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                        read: false,
                        icon: 'calendar-check'
                    },
                    {
                        id: 2,
                        title: 'Market Update',
                        message: 'Large cap funds gained 2.3% today',
                        time: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
                        read: false,
                        icon: 'chart-line'
                    },
                    {
                        id: 3,
                        title: 'Portfolio Rebalance Alert',
                        message: 'Your portfolio needs rebalancing',
                        time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                        read: true,
                        icon: 'balance-scale'
                    }
                ]
            };
        } else if (url === '/api/stats') {
            return {
                data: {
                    totalValue: 36893.74,
                    totalReturns: 3446.78,
                    sipValue: 45000,
                    riskScore: 'Medium'
                }
            };
        }

        // For other endpoints, return success
        return { success: true };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});