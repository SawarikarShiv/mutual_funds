/**
 * Infinity Mutual Funds - Portfolio Management JavaScript
 */

class PortfolioManager {
    constructor() {
        this.portfolioData = [];
        this.filteredData = [];
        this.currentSort = { column: 'name', direction: 'asc' };
        this.currentPage = 1;
        this.pageSize = 10;
        this.selectedFunds = new Set();
        this.filters = {};
        this.currentUser = null;
        this.performanceChart = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadPortfolioData();
        this.initializeComponents();
        this.bindEvents();
        this.renderPortfolio();
    }

    checkAuth() {
        const user = localStorage.getItem('infinity_user');
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        this.currentUser = JSON.parse(user);
        this.updateUserInfo();
    }

    updateUserInfo() {
        // Update user info in header
        const userName = document.getElementById('userFullName');
        const userEmail = document.getElementById('userEmail');
        const userInitials = document.getElementById('userInitials');
        
        if (userName) userName.textContent = this.currentUser.name || 'Demo User';
        if (userEmail) userEmail.textContent = this.currentUser.email || 'demo@infinityfunds.com';
        
        if (userInitials && this.currentUser.name) {
            const initials = this.currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            userInitials.textContent = initials;
        }
    }

    loadPortfolioData() {
        // Try to load from localStorage first
        const savedPortfolio = localStorage.getItem('infinity_portfolio');
        if (savedPortfolio) {
            this.portfolioData = JSON.parse(savedPortfolio);
        } else {
            // Load sample data
            this.loadSampleData();
            this.savePortfolioData();
        }

        this.filteredData = [...this.portfolioData];
        this.calculatePortfolioSummary();
    }

    loadSampleData() {
        this.portfolioData = [
            {
                id: 1,
                name: "SBI Bluechip Fund - Direct Growth",
                amc: "SBI Mutual Fund",
                category: "Equity",
                subCategory: "Large Cap",
                risk: "High",
                units: 150.25,
                avgCost: 45.50,
                currentNav: 52.75,
                investment: 6836.38,
                currentValue: 7925.69,
                returns: 15.93,
                returnsType: "positive",
                status: "active",
                folioNumber: "F123456789",
                purchaseDate: "2022-01-15",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 5000,
                goal: "Retirement",
                color: "#667eea"
            },
            {
                id: 2,
                name: "HDFC Balanced Advantage Fund - Direct Growth",
                amc: "HDFC Mutual Fund",
                category: "Hybrid",
                subCategory: "Balanced Advantage",
                risk: "Medium",
                units: 225.75,
                avgCost: 32.40,
                currentNav: 35.20,
                investment: 7314.30,
                currentValue: 7946.40,
                returns: 8.64,
                returnsType: "positive",
                status: "active",
                folioNumber: "F987654321",
                purchaseDate: "2022-03-10",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 3000,
                goal: "Wealth Creation",
                color: "#10b981"
            },
            {
                id: 3,
                name: "ICICI Prudential Corporate Bond Fund - Direct Growth",
                amc: "ICICI Prudential",
                category: "Debt",
                subCategory: "Corporate Bond",
                risk: "Low",
                units: 500.00,
                avgCost: 12.50,
                currentNav: 13.10,
                investment: 6250.00,
                currentValue: 6550.00,
                returns: 4.80,
                returnsType: "positive",
                status: "active",
                folioNumber: "F456789123",
                purchaseDate: "2022-06-20",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: false,
                goal: "Emergency Fund",
                color: "#f59e0b"
            },
            {
                id: 4,
                name: "Axis Small Cap Fund - Direct Growth",
                amc: "Axis Mutual Fund",
                category: "Equity",
                subCategory: "Small Cap",
                risk: "Very High",
                units: 85.50,
                avgCost: 58.75,
                currentNav: 52.30,
                investment: 5023.13,
                currentValue: 4471.65,
                returns: -10.98,
                returnsType: "negative",
                status: "active",
                folioNumber: "F789123456",
                purchaseDate: "2023-01-05",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 2000,
                goal: "High Growth",
                color: "#ef4444"
            },
            {
                id: 5,
                name: "Nippon India Liquid Fund - Direct Growth",
                amc: "Nippon India",
                category: "Money Market",
                subCategory: "Liquid",
                risk: "Low",
                units: 1000.00,
                avgCost: 10.00,
                currentNav: 10.02,
                investment: 10000.00,
                currentValue: 10020.00,
                returns: 0.20,
                returnsType: "positive",
                status: "active",
                folioNumber: "F321654987",
                purchaseDate: "2022-12-01",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: false,
                goal: "Liquidity",
                color: "#8b5cf6"
            },
            {
                id: 6,
                name: "Kotak Flexicap Fund - Direct Growth",
                amc: "Kotak Mahindra",
                category: "Equity",
                subCategory: "Flexi Cap",
                risk: "High",
                units: 120.75,
                avgCost: 42.30,
                currentNav: 48.90,
                investment: 5107.73,
                currentValue: 5904.68,
                returns: 15.60,
                returnsType: "positive",
                status: "active",
                folioNumber: "F654987321",
                purchaseDate: "2022-08-15",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 4000,
                goal: "Children Education",
                color: "#ec4899"
            },
            {
                id: 7,
                name: "Aditya Birla Sun Life Tax Relief 96 - Direct Growth",
                amc: "Aditya Birla",
                category: "Equity",
                subCategory: "ELSS",
                risk: "High",
                units: 65.25,
                avgCost: 85.40,
                currentNav: 92.75,
                investment: 5572.35,
                currentValue: 6051.94,
                returns: 8.60,
                returnsType: "positive",
                status: "active",
                folioNumber: "F147258369",
                purchaseDate: "2023-01-20",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 1500,
                goal: "Tax Saving",
                color: "#0ea5e9"
            },
            {
                id: 8,
                name: "UTI Nifty Index Fund - Direct Growth",
                amc: "UTI Mutual Fund",
                category: "Equity",
                subCategory: "Index",
                risk: "Medium",
                units: 200.50,
                avgCost: 18.75,
                currentNav: 20.10,
                investment: 3759.38,
                currentValue: 4030.05,
                returns: 7.20,
                returnsType: "positive",
                status: "active",
                folioNumber: "F258369147",
                purchaseDate: "2022-09-10",
                lastUpdated: new Date().toISOString().split('T')[0],
                sip: true,
                sipAmount: 2500,
                goal: "Index Investing",
                color: "#84cc16"
            }
        ];
    }

    savePortfolioData() {
        localStorage.setItem('infinity_portfolio', JSON.stringify(this.portfolioData));
    }

    initializeComponents() {
        this.initializeCharts();
        this.initializeModals();
        this.initializeFilters();
    }

    initializeCharts() {
        // Performance Chart
        const ctx = document.getElementById('performanceChart');
        if (ctx) {
            this.performanceChart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Portfolio Value (₹)',
                        data: [1850000, 1920000, 2010000, 2150000, 2230000, 2380000, 2410000, 2550000, 2620000, 2480000, 2530000, 2478456],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#cbd5e1',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            titleColor: '#ffffff',
                            bodyColor: '#cbd5e1',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: (context) => {
                                    return `Portfolio Value: ₹${context.raw.toLocaleString('en-IN')}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#94a3b8',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#94a3b8',
                                font: {
                                    size: 11
                                },
                                callback: (value) => `₹${(value/100000).toFixed(1)}L`
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    animation: {
                        duration: 750,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }

    initializeModals() {
        // Add Fund Modal
        this.initializeAddFundModal();
        
        // Edit Fund Modal
        this.initializeEditFundModal();
    }

    initializeAddFundModal() {
        const modal = document.getElementById('addFundModal');
        if (!modal) return;

        // Tab switching
        const tabs = modal.querySelectorAll('.modal-tab');
        const tabContents = modal.querySelectorAll('.modal-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Initialize search tab content
        this.initializeFundSearch();
    }

    initializeFundSearch() {
        const searchTab = document.getElementById('tabSearch');
        if (!searchTab) return;

        searchTab.innerHTML = `
            <div class="form-group">
                <label for="fundSearchInput">Search Mutual Fund</label>
                <div style="position: relative;">
                    <input type="text" id="fundSearchInput" placeholder="Type to search 2000+ funds..." autocomplete="off">
                    <div id="fundSearchResults" class="search-results"></div>
                </div>
            </div>
            
            <div id="fundDetails" style="display: none;">
                <div class="form-row">
                    <div class="form-group">
                        <label for="investmentAmount">Investment Amount (₹)</label>
                        <input type="number" id="investmentAmount" placeholder="e.g., 10000" required min="100">
                    </div>
                    
                    <div class="form-group">
                        <label for="investmentDate">Investment Date</label>
                        <input type="date" id="investmentDate" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="units">Units</label>
                        <input type="number" id="units" placeholder="e.g., 100.50" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label for="nav">NAV at Purchase</label>
                        <input type="number" id="nav" placeholder="e.g., 52.75" step="0.01">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="investmentType">Investment Type</label>
                        <select id="investmentType" required>
                            <option value="">Select type</option>
                            <option value="lumpsum">Lumpsum</option>
                            <option value="sip">SIP (Monthly)</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="sipDetails" style="display: none;">
                        <label for="sipAmount">SIP Amount (₹)</label>
                        <input type="number" id="sipAmount" placeholder="e.g., 5000" min="500">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="folioNumber">Folio Number (Optional)</label>
                    <input type="text" id="folioNumber" placeholder="e.g., F123456789">
                </div>
                
                <div class="form-group">
                    <label for="investmentGoal">Investment Goal</label>
                    <select id="investmentGoal">
                        <option value="">Select Goal</option>
                        <option value="Retirement">Retirement</option>
                        <option value="Wealth Creation">Wealth Creation</option>
                        <option value="Children Education">Children Education</option>
                        <option value="House Purchase">House Purchase</option>
                        <option value="Tax Saving">Tax Saving</option>
                        <option value="Emergency Fund">Emergency Fund</option>
                    </select>
                </div>
                
                <div class="modal-form-actions">
                    <button type="button" class="btn btn-glass" id="cancelAddFund">Cancel</button>
                    <button type="submit" class="btn btn-primary-gradient" id="submitAddFund">Add Investment</button>
                </div>
            </div>
        `;

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        const dateInput = searchTab.querySelector('#investmentDate');
        if (dateInput) dateInput.value = today;

        // Fund search functionality
        const fundSearchInput = searchTab.querySelector('#fundSearchInput');
        const fundSearchResults = searchTab.querySelector('#fundSearchResults');
        const fundDetails = searchTab.querySelector('#fundDetails');

        if (fundSearchInput && fundSearchResults) {
            fundSearchInput.addEventListener('input', (e) => {
                this.handleFundSearch(e.target.value, fundSearchResults, fundDetails);
            });

            // Hide results when clicking outside
            document.addEventListener('click', (e) => {
                if (!fundSearchResults.contains(e.target) && e.target !== fundSearchInput) {
                    fundSearchResults.style.display = 'none';
                }
            });
        }

        // Show/hide SIP details
        const investmentType = searchTab.querySelector('#investmentType');
        const sipDetails = searchTab.querySelector('#sipDetails');
        
        if (investmentType && sipDetails) {
            investmentType.addEventListener('change', () => {
                sipDetails.style.display = investmentType.value === 'sip' ? 'block' : 'none';
            });
        }

        // Cancel button
        const cancelBtn = searchTab.querySelector('#cancelAddFund');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('addFundModal').classList.remove('show');
            });
        }

        // Submit button
        const submitBtn = searchTab.querySelector('#submitAddFund');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.addNewInvestment();
            });
        }
    }

    handleFundSearch(query, resultsContainer, detailsContainer) {
        if (!query || query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Sample fund database
        const fundDatabase = [
            { id: 101, name: "SBI Bluechip Fund - Direct Growth", amc: "SBI Mutual Fund", category: "Equity", subCategory: "Large Cap", risk: "High" },
            { id: 102, name: "HDFC Balanced Advantage Fund - Direct Growth", amc: "HDFC Mutual Fund", category: "Hybrid", subCategory: "Balanced Advantage", risk: "Medium" },
            { id: 103, name: "ICICI Prudential Bluechip Fund - Direct Growth", amc: "ICICI Prudential", category: "Equity", subCategory: "Large Cap", risk: "High" },
            { id: 104, name: "Axis Bluechip Fund - Direct Growth", amc: "Axis Mutual Fund", category: "Equity", subCategory: "Large Cap", risk: "High" },
            { id: 105, name: "Kotak Standard Multicap Fund - Direct Growth", amc: "Kotak Mahindra", category: "Equity", subCategory: "Multi Cap", risk: "High" },
            { id: 106, name: "Nippon India Small Cap Fund - Direct Growth", amc: "Nippon India", category: "Equity", subCategory: "Small Cap", risk: "Very High" },
            { id: 107, name: "Aditya Birla Sun Life Liquid Fund - Direct Growth", amc: "Aditya Birla", category: "Money Market", subCategory: "Liquid", risk: "Low" },
            { id: 108, name: "UTI Nifty Index Fund - Direct Growth", amc: "UTI Mutual Fund", category: "Equity", subCategory: "Index", risk: "Medium" },
            { id: 109, name: "Mirae Asset Emerging Bluechip Fund - Direct Growth", amc: "Mirae Asset", category: "Equity", subCategory: "Large & Mid Cap", risk: "High" },
            { id: 110, name: "DSP Tax Saver Fund - Direct Growth", amc: "DSP Mutual Fund", category: "Equity", subCategory: "ELSS", risk: "High" }
        ];

        // Filter funds based on query
        const filteredFunds = fundDatabase.filter(fund =>
            fund.name.toLowerCase().includes(query.toLowerCase()) ||
            fund.amc.toLowerCase().includes(query.toLowerCase()) ||
            fund.subCategory.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredFunds.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No funds found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Display results
        resultsContainer.innerHTML = filteredFunds.map(fund => `
            <div class="search-result-item" data-fund='${JSON.stringify(fund)}'>
                <div class="fund-name">${fund.name}</div>
                <div class="fund-details">
                    ${fund.amc} • ${fund.subCategory} • ${fund.risk} Risk
                </div>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';

        // Add click handlers
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const fund = JSON.parse(item.getAttribute('data-fund'));
                this.selectFundForAddition(fund, resultsContainer, detailsContainer);
            });
        });
    }

    selectFundForAddition(fund, resultsContainer, detailsContainer) {
        const searchInput = document.getElementById('fundSearchInput');
        if (searchInput) searchInput.value = fund.name;
        
        resultsContainer.style.display = 'none';
        
        if (detailsContainer) {
            detailsContainer.style.display = 'block';
            // Store selected fund data
            detailsContainer.setAttribute('data-selected-fund', JSON.stringify(fund));
        }
    }

    initializeEditFundModal() {
        const modal = document.getElementById('editFundModal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    initializeFilters() {
        // Initialize filter dropdowns
        const filterSelects = ['filterCategory', 'filterRisk', 'filterReturns', 'filterAMC'];
        
        filterSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        // Search input
        const searchInput = document.getElementById('searchFunds');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.applyFilters();
            });
        }
    }

    bindEvents() {
        // Sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

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

        // Logout
        const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutDropdownBtn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Portfolio actions
        this.bindPortfolioActions();
        
        // Chart controls
        this.bindChartControls();
        
        // Table sorting
        this.bindTableSorting();
        
        // Batch actions
        this.bindBatchActions();
        
        // Add fund button
        const addFundBtn = document.getElementById('addFundBtn');
        if (addFundBtn) {
            addFundBtn.addEventListener('click', () => {
                this.showAddFundModal();
            });
        }

        // Import portfolio
        const importBtn = document.getElementById('importPortfolioBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importPortfolio();
            });
        }

        // Export portfolio
        const exportBtn = document.getElementById('exportPortfolioBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportPortfolio();
            });
        }

        // Reset filters
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.globalSearch(e.target.value);
                }
            });
        }

        // Add first investment button
        const addFirstBtn = document.getElementById('addFirstInvestment');
        if (addFirstBtn) {
            addFirstBtn.addEventListener('click', () => {
                this.showAddFundModal();
            });
        }

        // View all performance
        const viewAllBtn = document.getElementById('viewAllPerformance');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.showAllPerformance();
            });
        }

        // Refresh insights
        const refreshInsights = document.getElementById('refreshInsights');
        if (refreshInsights) {
            refreshInsights.addEventListener('click', () => {
                this.loadInsights();
            });
        }
    }

    bindPortfolioActions() {
        // Additional portfolio actions can be added here
    }

    bindChartControls() {
        const chartControls = document.querySelectorAll('.chart-control');
        chartControls.forEach(control => {
            control.addEventListener('click', () => {
                const period = control.getAttribute('data-period');
                
                // Update active control
                chartControls.forEach(c => c.classList.remove('active'));
                control.classList.add('active');
                
                // Update chart
                this.updatePerformanceChart(period);
            });
        });
    }

    bindTableSorting() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort');
                this.sortTable(column);
                
                // Update sort indicators
                sortableHeaders.forEach(h => {
                    const icon = h.querySelector('i');
                    if (h === header) {
                        icon.className = this.currentSort.direction === 'asc' ? 
                            'fas fa-sort-up' : 'fas fa-sort-down';
                    } else {
                        icon.className = 'fas fa-sort';
                    }
                });
            });
        });
    }

    bindBatchActions() {
        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Batch action buttons
        const batchButtons = ['batchEdit', 'batchDelete', 'batchExport', 'clearSelection'];
        batchButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.handleBatchAction(btnId);
                });
            }
        });
    }

    renderPortfolio() {
        this.renderPortfolioSummary();
        this.renderTopPerformers();
        this.renderPortfolioTable();
        this.renderActiveFilters();
        this.loadInsights();
        this.updateBatchActions();
    }

    renderPortfolioSummary() {
        // Calculate totals
        const totalInvestment = this.portfolioData.reduce((sum, fund) => sum + fund.investment, 0);
        const totalValue = this.portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
        const totalReturns = totalValue - totalInvestment;
        const totalReturnsPercent = totalInvestment > 0 ? (totalReturns / totalInvestment * 100) : 0;

        // Update UI
        const updateElement = (id, value) => {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = value;
        };

        updateElement('totalPortfolioValue', `₹${this.formatNumber(totalValue, 0)}`);
        updateElement('totalReturnsValue', `₹${this.formatNumber(totalReturns, 0)}`);
        
        // Calculate equity allocation
        const equityValue = this.portfolioData
            .filter(f => f.category === 'Equity')
            .reduce((sum, f) => sum + f.currentValue, 0);
        const equityPercent = totalValue > 0 ? (equityValue / totalValue * 100) : 0;
        updateElement('equityAllocation', `${equityPercent.toFixed(1)}%`);
        
        updateElement('totalHoldings', `${this.portfolioData.length} funds`);
        updateElement('totalInvestment', `Total Investment: ₹${this.formatNumber(totalInvestment, 0)}`);
        updateElement('currentValue', `Current Value: ₹${this.formatNumber(totalValue, 0)}`);

        // Update portfolio count in sidebar
        updateElement('portfolioCount', this.portfolioData.length);

        // Update total returns change indicator
        const returnsChange = document.querySelector('.summary-change.positive');
        if (returnsChange) {
            const changeElem = returnsChange.querySelector('span');
            if (changeElem) {
                changeElem.textContent = totalReturnsPercent >= 0 ? 
                    `+${totalReturnsPercent.toFixed(1)}%` : 
                    `${totalReturnsPercent.toFixed(1)}%`;
            }
        }
    }

    renderTopPerformers() {
        const topPerformersList = document.getElementById('topPerformersList');
        if (!topPerformersList) return;

        // Sort by returns (descending) and take top 3
        const topPerformers = [...this.portfolioData]
            .sort((a, b) => b.returns - a.returns)
            .slice(0, 3);

        topPerformersList.innerHTML = topPerformers.map(fund => `
            <div class="detail-item">
                <span class="detail-label">
                    ${this.truncateText(fund.name.split(' - ')[0], 20)}
                    <span class="fund-type">${fund.subCategory}</span>
                </span>
                <span class="detail-value ${fund.returns >= 0 ? 'positive' : 'negative'}">
                    ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                </span>
            </div>
        `).join('');
    }

    renderPortfolioTable() {
        const tableBody = document.getElementById('portfolioTableBody');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        const pagination = document.getElementById('pagination');

        if (!tableBody) return;

        // Show loading state
        if (loadingState) loadingState.style.display = 'block';
        if (tableBody) tableBody.innerHTML = '';

        // Simulate loading delay
        setTimeout(() => {
            // Hide loading state
            if (loadingState) loadingState.style.display = 'none';

            // Check if we have data
            if (this.filteredData.length === 0) {
                if (emptyState) emptyState.style.display = 'block';
                if (pagination) pagination.style.display = 'none';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';
            if (pagination) pagination.style.display = 'flex';

            // Calculate pagination
            const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = Math.min(startIndex + this.pageSize, this.filteredData.length);
            const pageData = this.filteredData.slice(startIndex, endIndex);

            // Render table rows
            tableBody.innerHTML = pageData.map(fund => this.getFundRowHTML(fund)).join('');

            // Update pagination
            this.updatePagination(totalPages);

            // Add event listeners
            this.addRowEventListeners();
        }, 500);
    }

    getFundRowHTML(fund) {
        const isSelected = this.selectedFunds.has(fund.id);
        const fundColor = fund.color || this.getFundColor(fund.amc);
        
        return `
            <tr data-id="${fund.id}" class="${isSelected ? 'selected' : ''}">
                <td>
                    <input type="checkbox" class="fund-select" data-id="${fund.id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="fund-info">
                        <div class="fund-logo" style="background: ${fundColor}">
                            ${fund.amc.substring(0, 2)}
                        </div>
                        <div class="fund-details">
                            <div class="fund-name" title="${fund.name}">
                                ${this.truncateText(fund.name, 30)}
                            </div>
                            <div class="fund-meta">
                                <span class="fund-category">${fund.amc}</span>
                                <span class="fund-type ${fund.category.toLowerCase()}">${fund.subCategory}</span>
                                ${fund.sip ? '<span class="status-badge status-active"><i class="fas fa-calendar-check"></i> SIP</span>' : ''}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="fund-type ${fund.category.toLowerCase()}">${fund.category}</span>
                </td>
                <td>${fund.units.toFixed(2)}</td>
                <td>₹${fund.avgCost.toFixed(2)}</td>
                <td>₹${this.formatNumber(fund.currentValue, 2)}</td>
                <td>
                    <span class="performance-indicator ${fund.returns >= 0 ? 'performance-positive' : 'performance-negative'}">
                        <i class="fas fa-${fund.returns >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                    </span>
                </td>
                <td>
                    <span class="status-badge status-active">
                        <i class="fas fa-check-circle"></i> Active
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" data-id="${fund.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn chart" data-id="${fund.id}" title="View Chart">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="action-btn delete" data-id="${fund.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getFundColor(amc) {
        const colorMap = {
            'SBI': '#667eea',
            'HDFC': '#10b981',
            'ICICI': '#f59e0b',
            'Axis': '#ef4444',
            'Kotak': '#8b5cf6',
            'Nippon': '#ec4899',
            'Aditya Birla': '#0ea5e9',
            'UTI': '#84cc16',
            'Mirae': '#f97316',
            'DSP': '#06b6d4'
        };

        for (const [key, color] of Object.entries(colorMap)) {
            if (amc.includes(key)) {
                return color;
            }
        }

        // Default color
        return '#667eea';
    }

    addRowEventListeners() {
        // Checkbox listeners
        const checkboxes = document.querySelectorAll('.fund-select:not(#selectAll)');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const fundId = parseInt(checkbox.getAttribute('data-id'));
                if (checkbox.checked) {
                    this.selectedFunds.add(fundId);
                } else {
                    this.selectedFunds.delete(fundId);
                }
                this.updateBatchActions();
                this.updateSelectAllCheckbox();
                
                // Update row selection style
                const row = checkbox.closest('tr');
                if (row) {
                    row.classList.toggle('selected', checkbox.checked);
                }
            });
        });

        // Action button listeners
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.getAttribute('data-id'));
                this.editFund(fundId);
            });
        });

        document.querySelectorAll('.action-btn.chart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.getAttribute('data-id'));
                this.viewFundChart(fundId);
            });
        });

        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.getAttribute('data-id'));
                this.deleteFund(fundId);
            });
        });
    }

    updatePagination(totalPages) {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        if (!prevBtn || !nextBtn || !pageInfo) return;

        // Update button states
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Update page info
        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;

        // Add event listeners
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderPortfolioTable();
            }
        };

        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderPortfolioTable();
            }
        };
    }

    updateSelectAllCheckbox() {
        const selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        const totalFunds = this.filteredData.length;
        const selectedCount = this.selectedFunds.size;

        selectAll.checked = selectedCount === totalFunds && totalFunds > 0;
        selectAll.indeterminate = selectedCount > 0 && selectedCount < totalFunds;
    }

    updateBatchActions() {
        const batchActions = document.getElementById('batchActions');
        const selectedCountElem = document.getElementById('selectedFundsCount');

        if (!batchActions || !selectedCountElem) return;

        const selectedCount = this.selectedFunds.size;

        if (selectedCount > 0) {
            batchActions.classList.add('show');
            selectedCountElem.textContent = selectedCount;
        } else {
            batchActions.classList.remove('show');
        }
    }

    applyFilters() {
        this.filters = {};
        this.currentPage = 1;

        // Get filter values
        const categoryFilter = document.getElementById('filterCategory')?.value || '';
        const riskFilter = document.getElementById('filterRisk')?.value || '';
        const returnsFilter = document.getElementById('filterReturns')?.value || '';
        const amcFilter = document.getElementById('filterAMC')?.value || '';
        const searchFilter = document.getElementById('searchFunds')?.value.toLowerCase() || '';

        // Store filters
        if (categoryFilter) this.filters.category = categoryFilter;
        if (riskFilter) this.filters.risk = riskFilter;
        if (returnsFilter) this.filters.returns = returnsFilter;
        if (amcFilter) this.filters.amc = amcFilter;
        if (searchFilter) this.filters.search = searchFilter;

        // Apply filters
        this.filteredData = this.portfolioData.filter(fund => {
            // Category filter
            if (categoryFilter && fund.category.toLowerCase() !== categoryFilter) {
                return false;
            }

            // Risk filter
            if (riskFilter) {
                const riskMap = {
                    'low': ['Low'],
                    'medium': ['Medium'],
                    'high': ['High'],
                    'very_high': ['Very High']
                };
                if (!riskMap[riskFilter]?.includes(fund.risk)) {
                    return false;
                }
            }

            // Returns filter
            if (returnsFilter) {
                switch (returnsFilter) {
                    case 'positive':
                        if (fund.returns < 0) return false;
                        break;
                    case 'negative':
                        if (fund.returns >= 0) return false;
                        break;
                    case 'high_performers':
                        if (fund.returns < 15) return false;
                        break;
                    case 'underperformers':
                        if (fund.returns >= 5) return false;
                        break;
                }
            }

            // AMC filter
            if (amcFilter) {
                const amcMap = {
                    'sbi': 'SBI',
                    'hdfc': 'HDFC',
                    'icici': 'ICICI',
                    'axis': 'Axis',
                    'kotak': 'Kotak'
                };
                if (!fund.amc.includes(amcMap[amcFilter])) {
                    return false;
                }
            }

            // Search filter
            if (searchFilter) {
                const searchableText = `${fund.name} ${fund.amc} ${fund.category} ${fund.subCategory} ${fund.folioNumber}`.toLowerCase();
                if (!searchableText.includes(searchFilter)) {
                    return false;
                }
            }

            return true;
        });

        // Apply current sort
        this.sortTable(this.currentSort.column, this.currentSort.direction, false);

        // Render updated table
        this.renderPortfolioTable();
        this.renderActiveFilters();
    }

    renderActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        // Add filter tags for active filters
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value) {
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag active';
                filterTag.innerHTML = `
                    ${this.getFilterLabel(key)}: ${this.getFilterValueLabel(key, value)}
                    <span class="remove" data-filter="${key}">&times;</span>
                `;
                activeFiltersContainer.appendChild(filterTag);
            }
        });

        // Add remove event listeners
        activeFiltersContainer.querySelectorAll('.remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const filterKey = removeBtn.getAttribute('data-filter');
                this.removeFilter(filterKey);
            });
        });
    }

    getFilterLabel(filterKey) {
        const labels = {
            'category': 'Category',
            'risk': 'Risk',
            'returns': 'Returns',
            'amc': 'Fund House',
            'search': 'Search'
        };
        return labels[filterKey] || filterKey;
    }

    getFilterValueLabel(filterKey, value) {
        if (filterKey === 'category') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (filterKey === 'risk') {
            const riskLabels = {
                'low': 'Low Risk',
                'medium': 'Medium Risk',
                'high': 'High Risk',
                'very_high': 'Very High Risk'
            };
            return riskLabels[value] || value;
        }
        if (filterKey === 'returns') {
            const returnLabels = {
                'positive': 'Positive',
                'negative': 'Negative',
                'high_performers': 'High Performers',
                'underperformers': 'Underperformers'
            };
            return returnLabels[value] || value;
        }
        if (filterKey === 'amc') {
            const amcLabels = {
                'sbi': 'SBI',
                'hdfc': 'HDFC',
                'icici': 'ICICI',
                'axis': 'Axis',
                'kotak': 'Kotak'
            };
            return amcLabels[value] || value;
        }
        return value;
    }

    removeFilter(filterKey) {
        // Clear the specific filter
        switch (filterKey) {
            case 'category':
                document.getElementById('filterCategory').value = '';
                break;
            case 'risk':
                document.getElementById('filterRisk').value = '';
                break;
            case 'returns':
                document.getElementById('filterReturns').value = '';
                break;
            case 'amc':
                document.getElementById('filterAMC').value = '';
                break;
            case 'search':
                document.getElementById('searchFunds').value = '';
                break;
        }

        // Reapply filters
        this.applyFilters();
    }

    resetFilters() {
        // Clear all filter inputs
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterRisk').value = '';
        document.getElementById('filterReturns').value = '';
        document.getElementById('filterAMC').value = '';
        document.getElementById('searchFunds').value = '';

        // Clear filters object
        this.filters = {};
        this.filteredData = [...this.portfolioData];
        this.currentPage = 1;

        // Render updated table
        this.renderPortfolioTable();
        this.renderActiveFilters();
    }

    sortTable(column, direction = null, updateTable = true) {
        // Toggle direction if same column clicked
        if (column === this.currentSort.column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort = { column, direction: 'asc' };
        }

        if (direction) {
            this.currentSort.direction = direction;
        }

        // Sort the data
        this.filteredData.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];

            // Handle special cases
            if (column === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            } else if (column === 'category') {
                aValue = `${a.category} ${a.subCategory}`.toLowerCase();
                bValue = `${b.category} ${b.subCategory}`.toLowerCase();
            }

            if (aValue < bValue) return this.currentSort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        if (updateTable) {
            this.renderPortfolioTable();
        }
    }

    toggleSelectAll(selectAll) {
        const currentPageIds = this.filteredData
            .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            .map(fund => fund.id);

        if (selectAll) {
            currentPageIds.forEach(id => this.selectedFunds.add(id));
        } else {
            currentPageIds.forEach(id => this.selectedFunds.delete(id));
        }

        this.renderPortfolioTable();
        this.updateBatchActions();
    }

    handleBatchAction(action) {
        switch (action) {
            case 'batchEdit':
                this.batchEdit();
                break;
            case 'batchDelete':
                this.batchDelete();
                break;
            case 'batchExport':
                this.batchExport();
                break;
            case 'clearSelection':
                this.clearSelection();
                break;
        }
    }

    batchEdit() {
        if (this.selectedFunds.size === 0) return;
        
        this.showNotification(`Opening bulk edit for ${this.selectedFunds.size} selected funds`, 'info');
        // In a real app, this would open a bulk edit modal
    }

    batchDelete() {
        if (this.selectedFunds.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedFunds.size} selected funds? This action cannot be undone.`)) {
            // Remove selected funds from portfolio data
            this.portfolioData = this.portfolioData.filter(fund => !this.selectedFunds.has(fund.id));
            
            // Clear selection
            this.selectedFunds.clear();
            
            // Save to localStorage
            this.savePortfolioData();
            
            // Update UI
            this.applyFilters();
            this.showNotification('Selected funds deleted successfully', 'success');
        }
    }

    batchExport() {
        if (this.selectedFunds.size === 0) return;

        const selectedFunds = this.portfolioData.filter(fund => this.selectedFunds.has(fund.id));
        this.exportToCSV(selectedFunds, 'selected-portfolio.csv');
        this.showNotification(`Exported ${selectedFunds.length} funds to CSV`, 'success');
    }

    clearSelection() {
        this.selectedFunds.clear();
        this.updateBatchActions();
        this.renderPortfolioTable();
    }

    showAddFundModal() {
        const modal = document.getElementById('addFundModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    addNewInvestment() {
        const fundDetails = document.getElementById('fundDetails');
        if (!fundDetails) return;

        const selectedFundData = fundDetails.getAttribute('data-selected-fund');
        if (!selectedFundData) {
            this.showNotification('Please select a fund first', 'error');
            return;
        }

        const fund = JSON.parse(selectedFundData);
        
        // Get form values
        const amount = parseFloat(document.getElementById('investmentAmount').value) || 0;
        const date = document.getElementById('investmentDate').value;
        const units = parseFloat(document.getElementById('units').value) || 0;
        const nav = parseFloat(document.getElementById('nav').value) || 0;
        const investmentType = document.getElementById('investmentType').value;
        const sipAmount = parseFloat(document.getElementById('sipAmount').value) || 0;
        const folioNumber = document.getElementById('folioNumber').value;
        const goal = document.getElementById('investmentGoal').value;

        // Validate required fields
        if (!amount || !date || !investmentType) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Calculate units if not provided
        const calculatedUnits = units || (amount / (nav || 10)).toFixed(2);
        const calculatedNav = nav || (amount / calculatedUnits).toFixed(2);

        // Create new fund object
        const newFund = {
            id: Date.now(), // Unique ID
            name: fund.name,
            amc: fund.amc,
            category: fund.category,
            subCategory: fund.subCategory,
            risk: fund.risk,
            units: parseFloat(calculatedUnits),
            avgCost: parseFloat(calculatedNav),
            currentNav: parseFloat(calculatedNav),
            investment: amount,
            currentValue: amount, // Initially same as investment
            returns: 0,
            returnsType: "neutral",
            status: "active",
            folioNumber: folioNumber || `F${Math.floor(Math.random() * 1000000000)}`,
            purchaseDate: date,
            lastUpdated: new Date().toISOString().split('T')[0],
            sip: investmentType === 'sip',
            sipAmount: investmentType === 'sip' ? sipAmount : 0,
            goal: goal,
            color: this.getFundColor(fund.amc)
        };

        // Add to portfolio
        this.portfolioData.push(newFund);
        this.savePortfolioData();

        // Close modal
        document.getElementById('addFundModal').classList.remove('show');

        // Update UI
        this.applyFilters();
        this.showNotification('Investment added successfully', 'success');
    }

    editFund(fundId) {
        const fund = this.portfolioData.find(f => f.id === fundId);
        if (!fund) return;

        const modal = document.getElementById('editFundModal');
        if (!modal) return;

        // Populate modal with fund data
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <form id="editFundForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editFundName">Fund Name</label>
                        <input type="text" id="editFundName" value="${fund.name}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="editFolioNumber">Folio Number</label>
                        <input type="text" id="editFolioNumber" value="${fund.folioNumber}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUnits">Units</label>
                        <input type="number" id="editUnits" value="${fund.units}" step="0.01" required min="0">
                    </div>
                    <div class="form-group">
                        <label for="editAvgCost">Average Cost (₹)</label>
                        <input type="number" id="editAvgCost" value="${fund.avgCost}" step="0.01" required min="0">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCurrentNav">Current NAV (₹)</label>
                        <input type="number" id="editCurrentNav" value="${fund.currentNav}" step="0.01" required min="0">
                    </div>
                    <div class="form-group">
                        <label for="editPurchaseDate">Purchase Date</label>
                        <input type="date" id="editPurchaseDate" value="${fund.purchaseDate}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editSIP">SIP</label>
                        <select id="editSIP">
                            <option value="false" ${!fund.sip ? 'selected' : ''}>No</option>
                            <option value="true" ${fund.sip ? 'selected' : ''}>Yes</option>
                        </select>
                    </div>
                    <div class="form-group" id="sipAmountGroup" style="${!fund.sip ? 'display: none;' : ''}">
                        <label for="editSIPAmount">SIP Amount (₹)</label>
                        <input type="number" id="editSIPAmount" value="${fund.sipAmount || ''}" step="1" min="0">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editGoal">Investment Goal</label>
                    <select id="editGoal">
                        <option value="">Select Goal</option>
                        <option value="Retirement" ${fund.goal === 'Retirement' ? 'selected' : ''}>Retirement</option>
                        <option value="Wealth Creation" ${fund.goal === 'Wealth Creation' ? 'selected' : ''}>Wealth Creation</option>
                        <option value="Children Education" ${fund.goal === 'Children Education' ? 'selected' : ''}>Children Education</option>
                        <option value="House Purchase" ${fund.goal === 'House Purchase' ? 'selected' : ''}>House Purchase</option>
                        <option value="Tax Saving" ${fund.goal === 'Tax Saving' ? 'selected' : ''}>Tax Saving</option>
                        <option value="Emergency Fund" ${fund.goal === 'Emergency Fund' ? 'selected' : ''}>Emergency Fund</option>
                    </select>
                </div>
                
                <div class="modal-form-actions">
                    <button type="button" class="btn btn-glass" id="cancelEditFund">Cancel</button>
                    <button type="submit" class="btn btn-primary-gradient">Save Changes</button>
                </div>
            </form>
        `;

        // Show/hide SIP amount based on SIP selection
        const sipSelect = modal.querySelector('#editSIP');
        const sipAmountGroup = modal.querySelector('#sipAmountGroup');
        
        if (sipSelect && sipAmountGroup) {
            sipSelect.addEventListener('change', () => {
                sipAmountGroup.style.display = sipSelect.value === 'true' ? 'block' : 'none';
            });
        }

        // Cancel button
        const cancelBtn = modal.querySelector('#cancelEditFund');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        // Form submission
        const form = modal.querySelector('#editFundForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateFund(fundId, new FormData(form));
                modal.classList.remove('show');
            });
        }

        modal.classList.add('show');
    }

    updateFund(fundId, formData) {
        const fundIndex = this.portfolioData.findIndex(f => f.id === fundId);
        if (fundIndex === -1) return;

        // Update fund data
        const fund = this.portfolioData[fundIndex];
        fund.units = parseFloat(formData.get('editUnits') || fund.units);
        fund.avgCost = parseFloat(formData.get('editAvgCost') || fund.avgCost);
        fund.currentNav = parseFloat(formData.get('editCurrentNav') || fund.currentNav);
        fund.folioNumber = formData.get('editFolioNumber') || fund.folioNumber;
        fund.purchaseDate = formData.get('editPurchaseDate') || fund.purchaseDate;
        fund.sip = formData.get('editSIP') === 'true';
        fund.sipAmount = fund.sip ? parseFloat(formData.get('editSIPAmount') || 0) : 0;
        fund.goal = formData.get('editGoal') || fund.goal;

        // Recalculate values
        fund.investment = fund.units * fund.avgCost;
        fund.currentValue = fund.units * fund.currentNav;
        fund.returns = ((fund.currentValue - fund.investment) / fund.investment) * 100;
        fund.returnsType = fund.returns >= 0 ? 'positive' : 'negative';

        // Save to localStorage
        this.savePortfolioData();

        // Update UI
        this.applyFilters();
        this.showNotification('Fund updated successfully', 'success');
    }

    deleteFund(fundId) {
        if (confirm('Are you sure you want to delete this fund from your portfolio?')) {
            this.portfolioData = this.portfolioData.filter(f => f.id !== fundId);
            this.selectedFunds.delete(fundId);
            
            // Save to localStorage
            this.savePortfolioData();
            
            // Update UI
            this.applyFilters();
            this.showNotification('Fund deleted successfully', 'success');
        }
    }

    viewFundChart(fundId) {
        const fund = this.portfolioData.find(f => f.id === fundId);
        if (!fund) return;

        this.showNotification(`Showing performance chart for ${fund.name}`, 'info');
        // In a real app, this would open a detailed chart modal
    }

    importPortfolio() {
        this.showNotification('Import portfolio feature coming soon!', 'info');
        // In a real app, this would open an import modal
    }

    exportPortfolio() {
        this.exportToCSV(this.portfolioData, 'infinity-portfolio.csv');
        this.showNotification('Portfolio exported successfully', 'success');
    }

    exportToCSV(data, filename) {
        // Convert data to CSV
        const headers = ['Name', 'AMC', 'Category', 'Sub Category', 'Units', 'Avg Cost', 'Current NAV', 'Investment', 'Current Value', 'Returns %', 'Risk', 'SIP', 'Goal', 'Purchase Date'];
        const csvData = data.map(fund => [
            `"${fund.name}"`,
            fund.amc,
            fund.category,
            fund.subCategory,
            fund.units,
            fund.avgCost,
            fund.currentNav,
            fund.investment,
            fund.currentValue,
            fund.returns,
            fund.risk,
            fund.sip ? 'Yes' : 'No',
            fund.goal || '-',
            fund.purchaseDate
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    updatePerformanceChart(period) {
        if (!this.performanceChart) return;

        // Sample data for different periods
        const dataSets = {
            '1m': [2400000, 2420000, 2450000, 2478456],
            '3m': [2300000, 2350000, 2400000, 2450000, 2478456],
            '6m': [2100000, 2150000, 2200000, 2250000, 2300000, 2350000, 2400000, 2450000, 2478456],
            '1y': [1850000, 1920000, 2010000, 2150000, 2230000, 2380000, 2410000, 2550000, 2620000, 2480000, 2530000, 2478456],
            'all': [1500000, 1600000, 1700000, 1800000, 1850000, 1920000, 2010000, 2150000, 2230000, 2380000, 2410000, 2550000, 2620000, 2480000, 2530000, 2478456]
        };

        const labels = {
            '1m': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            '3m': ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Now'],
            '6m': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan 1', 'Jan 2', 'Now'],
            '1y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'all': ['2022', 'Mar', 'Jun', 'Sep', 'Dec', 'Mar', 'Jun', 'Sep', 'Dec', 'Mar', 'Jun', 'Sep', 'Dec', 'Mar', 'Jun', 'Now']
        };

        const selectedData = dataSets[period] || dataSets['1y'];
        const selectedLabels = labels[period] || labels['1y'];

        this.performanceChart.data.labels = selectedLabels;
        this.performanceChart.data.datasets[0].data = selectedData;
        this.performanceChart.update();
    }

    loadInsights() {
        const insightsGrid = document.getElementById('insightsGrid');
        if (!insightsGrid) return;

        // Calculate insights
        const equityValue = this.portfolioData
            .filter(f => f.category === 'Equity')
            .reduce((sum, f) => sum + f.currentValue, 0);

        const debtValue = this.portfolioData
            .filter(f => f.category === 'Debt')
            .reduce((sum, f) => sum + f.currentValue, 0);

        const totalValue = this.portfolioData.reduce((sum, f) => sum + f.currentValue, 0);
        const equityPercent = totalValue > 0 ? (equityValue / totalValue * 100) : 0;
        const debtPercent = totalValue > 0 ? (debtValue / totalValue * 100) : 0;

        const topPerformer = [...this.portfolioData].sort((a, b) => b.returns - a.returns)[0];
        const worstPerformer = [...this.portfolioData].sort((a, b) => a.returns - b.returns)[0];

        const uniqueCategories = new Set(this.portfolioData.map(f => f.category)).size;
        const uniqueAMCs = new Set(this.portfolioData.map(f => f.amc)).size;

        insightsGrid.innerHTML = `
            <div class="summary-card">
                <div class="summary-header">
                    <h3>Asset Allocation</h3>
                    <span class="summary-change ${equityPercent > 60 ? 'positive' : 'neutral'}">
                        ${equityPercent > 60 ? 'High Equity' : 'Balanced'}
                    </span>
                </div>
                <div class="summary-value">${equityPercent.toFixed(1)}% Equity</div>
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="detail-label">Equity</span>
                        <span class="detail-value">${equityPercent.toFixed(1)}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Debt</span>
                        <span class="detail-value">${debtPercent.toFixed(1)}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Other</span>
                        <span class="detail-value">${(100 - equityPercent - debtPercent).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-header">
                    <h3>Top Performer</h3>
                    <span class="summary-change positive">
                        +${topPerformer?.returns.toFixed(1) || 0}%
                    </span>
                </div>
                <div class="summary-value">${this.truncateText(topPerformer?.name.split(' - ')[0] || 'N/A', 20)}</div>
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="detail-label">Category</span>
                        <span class="detail-value">${topPerformer?.subCategory || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Returns</span>
                        <span class="detail-value positive">+${topPerformer?.returns.toFixed(2) || 0}%</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-header">
                    <h3>Diversification</h3>
                    <span class="summary-change ${uniqueCategories >= 3 && uniqueAMCs >= 3 ? 'positive' : 'negative'}">
                        ${uniqueCategories >= 3 && uniqueAMCs >= 3 ? 'Good' : 'Needs Improvement'}
                    </span>
                </div>
                <div class="summary-value">${this.portfolioData.length} Funds</div>
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="detail-label">Categories</span>
                        <span class="detail-value">${uniqueCategories}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">AMCs</span>
                        <span class="detail-value">${uniqueAMCs}</span>
                    </div>
                    ${uniqueCategories < 3 ? `
                        <div class="detail-item">
                            <span class="detail-label" style="color: #f59e0b;">Suggestion</span>
                            <span class="detail-value" style="color: #f59e0b;">Add more categories for better diversification</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    calculatePortfolioSummary() {
        // This method is called during initialization
        // The actual calculation happens in renderPortfolioSummary()
    }

    showAllPerformance() {
        this.showNotification('Opening detailed performance analysis', 'info');
        // In a real app, this would navigate to a performance page
    }

    globalSearch(query) {
        if (!query.trim()) return;

        // Search across all portfolio data
        const results = this.portfolioData.filter(fund => {
            const searchableText = `${fund.name} ${fund.amc} ${fund.category} ${fund.subCategory} ${fund.folioNumber} ${fund.goal}`.toLowerCase();
            return searchableText.includes(query.toLowerCase());
        });

        if (results.length === 0) {
            this.showNotification(`No results found for "${query}"`, 'info');
            return;
        }

        // Apply search filter
        document.getElementById('searchFunds').value = query;
        this.applyFilters();
        this.showNotification(`Found ${results.length} results for "${query}"`, 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 25px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInUp 0.3s ease;
            max-width: 400px;
        `;

        const icon = this.getNotificationIcon(type);
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Add animation styles if not present
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .toast.success {
                    border-left: 4px solid #10b981;
                }
                
                .toast.error {
                    border-left: 4px solid #ef4444;
                }
                
                .toast.warning {
                    border-left: 4px solid #f59e0b;
                }
                
                .toast.info {
                    border-left: 4px solid #667eea;
                }
            `;
            document.head.appendChild(style);
        }

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

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('infinity_user');
            window.location.href = 'index.html';
        }
    }

    // Utility Methods
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatNumber(number, decimals = 2) {
        if (isNaN(number)) return '0';
        return number.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    calculatePortfolioMetrics() {
        const metrics = {
            totalInvestment: 0,
            totalValue: 0,
            totalReturns: 0,
            totalReturnsPercent: 0,
            equityAllocation: 0,
            debtAllocation: 0,
            hybridAllocation: 0,
            cashAllocation: 0
        };

        this.portfolioData.forEach(fund => {
            metrics.totalInvestment += fund.investment;
            metrics.totalValue += fund.currentValue;
            
            if (fund.category === 'Equity') {
                metrics.equityAllocation += fund.currentValue;
            } else if (fund.category === 'Debt') {
                metrics.debtAllocation += fund.currentValue;
            } else if (fund.category === 'Hybrid') {
                metrics.hybridAllocation += fund.currentValue;
            } else {
                metrics.cashAllocation += fund.currentValue;
            }
        });

        metrics.totalReturns = metrics.totalValue - metrics.totalInvestment;
        metrics.totalReturnsPercent = metrics.totalInvestment > 0 ? 
            (metrics.totalReturns / metrics.totalInvestment * 100) : 0;

        // Convert allocations to percentages
        const totalAllocation = metrics.equityAllocation + metrics.debtAllocation + 
                               metrics.hybridAllocation + metrics.cashAllocation;
        
        if (totalAllocation > 0) {
            metrics.equityAllocation = (metrics.equityAllocation / totalAllocation * 100);
            metrics.debtAllocation = (metrics.debtAllocation / totalAllocation * 100);
            metrics.hybridAllocation = (metrics.hybridAllocation / totalAllocation * 100);
            metrics.cashAllocation = (metrics.cashAllocation / totalAllocation * 100);
        }

        return metrics;
    }
}

// Export for use in HTML file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}