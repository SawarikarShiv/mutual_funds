/**
 * Infinity Mutual Funds - Portfolio Management Module
 * Handles portfolio operations, filtering, sorting, and data management
 */

class PortfolioManager {
    constructor() {
        this.portfolioData = [];
        this.filteredData = [];
        this.categories = [];
        this.amcs = [];
        this.filters = {
            category: '',
            risk: '',
            returns: '',
            amc: '',
            search: '',
            sortBy: 'name',
            sortOrder: 'asc'
        };
        this.selectedFunds = new Set();
        this.currentPage = 1;
        this.pageSize = 10;
        this.init();
    }

    async init() {
        await this.loadData();
        this.initializeUI();
        this.bindEvents();
        this.renderPortfolio();
    }

    async loadData() {
        try {
            // Load portfolio data from localStorage or API
            const savedData = localStorage.getItem('infinity_portfolio');
            
            if (savedData) {
                this.portfolioData = JSON.parse(savedData);
            } else {
                // Load sample data if no saved data
                const response = await fetch('assets/data/portfolio.json');
                if (response.ok) {
                    const data = await response.json();
                    this.portfolioData = data.funds || [];
                    this.categories = data.categories || [];
                    this.amcs = data.amcs || [];
                    
                    // Save to localStorage for future use
                    localStorage.setItem('infinity_portfolio', JSON.stringify(this.portfolioData));
                } else {
                    // Fallback to default data
                    this.loadDefaultData();
                }
            }
            
            this.filteredData = [...this.portfolioData];
            this.applySorting();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            this.loadDefaultData();
        }
    }

    loadDefaultData() {
        // Default sample data
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 5000,
                goal: "Retirement"
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 3000,
                goal: "Wealth Creation"
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
                lastUpdated: new Date().toISOString(),
                sip: false,
                goal: "Emergency Fund"
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 2000,
                goal: "High Growth"
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
                lastUpdated: new Date().toISOString(),
                sip: false,
                goal: "Liquidity"
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 4000,
                goal: "Children Education"
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 1500,
                goal: "Tax Saving"
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
                lastUpdated: new Date().toISOString(),
                sip: true,
                sipAmount: 2500,
                goal: "Index Investing"
            }
        ];
        
        this.filteredData = [...this.portfolioData];
        this.categories = ["Equity", "Debt", "Hybrid", "Money Market"];
        this.amcs = ["SBI Mutual Fund", "HDFC Mutual Fund", "ICICI Prudential", "Axis Mutual Fund", 
                    "Kotak Mahindra", "Nippon India", "Aditya Birla", "UTI Mutual Fund"];
    }

    initializeUI() {
        this.populateFilterOptions();
        this.updatePortfolioSummary();
        this.renderTopPerformers();
        this.setupCharts();
    }

    populateFilterOptions() {
        // Populate category filter
        const categorySelect = document.getElementById('filterCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">All Categories</option>' +
                this.categories.map(cat => `<option value="${cat.toLowerCase()}">${cat}</option>`).join('');
        }

        // Populate AMC filter
        const amcSelect = document.getElementById('filterAMC');
        if (amcSelect) {
            amcSelect.innerHTML = '<option value="">All Fund Houses</option>' +
                this.amcs.map(amc => {
                    const value = amc.toLowerCase().replace(/\s+/g, '_');
                    return `<option value="${value}">${amc}</option>`;
                }).join('');
        }
    }

    bindEvents() {
        // Filter events
        document.getElementById('filterCategory')?.addEventListener('change', (e) => this.applyFilters());
        document.getElementById('filterRisk')?.addEventListener('change', (e) => this.applyFilters());
        document.getElementById('filterReturns')?.addEventListener('change', (e) => this.applyFilters());
        document.getElementById('filterAMC')?.addEventListener('change', (e) => this.applyFilters());
        document.getElementById('searchFunds')?.addEventListener('input', (e) => this.applyFilters());

        // Reset filters
        document.getElementById('resetFilters')?.addEventListener('click', () => this.resetFilters());

        // Search events
        document.getElementById('globalSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.globalSearch(e.target.value);
            }
        });

        // Sort events
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                this.sortTable(column);
            });
        });

        // Pagination events
        document.getElementById('prevPage')?.addEventListener('click', () => this.prevPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());

        // Select all checkbox
        document.getElementById('selectAll')?.addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Batch actions
        document.getElementById('batchEdit')?.addEventListener('click', () => this.batchEdit());
        document.getElementById('batchDelete')?.addEventListener('click', () => this.batchDelete());
        document.getElementById('batchExport')?.addEventListener('click', () => this.batchExport());
        document.getElementById('clearSelection')?.addEventListener('click', () => this.clearSelection());

        // Add fund button
        document.getElementById('addFundBtn')?.addEventListener('click', () => this.showAddFundModal());
        document.getElementById('addFirstInvestment')?.addEventListener('click', () => this.showAddFundModal());

        // Import/Export buttons
        document.getElementById('importPortfolioBtn')?.addEventListener('click', () => this.importPortfolio());
        document.getElementById('exportPortfolioBtn')?.addEventListener('click', () => this.exportPortfolio());

        // Chart controls
        document.querySelectorAll('.chart-control').forEach(control => {
            control.addEventListener('click', () => {
                const period = control.dataset.period;
                this.updatePerformanceChart(period);
                
                // Update active control
                document.querySelectorAll('.chart-control').forEach(c => c.classList.remove('active'));
                control.classList.add('active');
            });
        });

        // View all performance
        document.getElementById('viewAllPerformance')?.addEventListener('click', () => this.showAllPerformance());

        // Refresh insights
        document.getElementById('refreshInsights')?.addEventListener('click', () => this.loadInsights());
    }

    applyFilters() {
        this.currentPage = 1;
        this.filters = {
            category: document.getElementById('filterCategory').value,
            risk: document.getElementById('filterRisk').value,
            returns: document.getElementById('filterReturns').value,
            amc: document.getElementById('filterAMC').value,
            search: document.getElementById('searchFunds').value.toLowerCase(),
            sortBy: this.filters.sortBy,
            sortOrder: this.filters.sortOrder
        };

        this.filteredData = this.portfolioData.filter(fund => {
            // Category filter
            if (this.filters.category && fund.category.toLowerCase() !== this.filters.category) {
                return false;
            }

            // Risk filter
            if (this.filters.risk) {
                const riskMap = {
                    'low': ['Low'],
                    'medium': ['Medium'],
                    'high': ['High'],
                    'very_high': ['Very High']
                };
                if (!riskMap[this.filters.risk]?.includes(fund.risk)) {
                    return false;
                }
            }

            // Returns filter
            if (this.filters.returns) {
                switch (this.filters.returns) {
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
            if (this.filters.amc) {
                const amcValue = this.filters.amc.replace(/_/g, ' ');
                if (!fund.amc.toLowerCase().includes(amcValue)) {
                    return false;
                }
            }

            // Search filter
            if (this.filters.search) {
                const searchableText = `${fund.name} ${fund.amc} ${fund.category} ${fund.subCategory}`.toLowerCase();
                if (!searchableText.includes(this.filters.search)) {
                    return false;
                }
            }

            return true;
        });

        this.applySorting();
        this.renderPortfolioTable();
        this.renderActiveFilters();
        this.updatePortfolioSummary();
    }

    applySorting() {
        const { sortBy, sortOrder } = this.filters;
        
        this.filteredData.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle special cases
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'category':
                    aValue = `${a.category} ${a.subCategory}`.toLowerCase();
                    bValue = `${b.category} ${b.subCategory}`.toLowerCase();
                    break;
                case 'returns':
                    aValue = a.returns;
                    bValue = b.returns;
                    break;
                case 'currentValue':
                    aValue = a.currentValue;
                    bValue = b.currentValue;
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    sortTable(column) {
        // Toggle sort order if same column
        if (column === this.filters.sortBy) {
            this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.filters.sortBy = column;
            this.filters.sortOrder = 'asc';
        }

        this.applySorting();
        this.renderPortfolioTable();
        
        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(header => {
            const icon = header.querySelector('i');
            if (header.dataset.sort === column) {
                icon.className = this.filters.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            } else {
                icon.className = 'fas fa-sort';
            }
        });
    }

    resetFilters() {
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterRisk').value = '';
        document.getElementById('filterReturns').value = '';
        document.getElementById('filterAMC').value = '';
        document.getElementById('searchFunds').value = '';

        this.filters = {
            category: '',
            risk: '',
            returns: '',
            amc: '',
            search: '',
            sortBy: 'name',
            sortOrder: 'asc'
        };

        this.filteredData = [...this.portfolioData];
        this.currentPage = 1;
        this.applySorting();
        this.renderPortfolioTable();
        this.renderActiveFilters();
        this.updatePortfolioSummary();
    }

    renderActiveFilters() {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(this.filters).forEach(([key, value]) => {
            if (value && key !== 'sortBy' && key !== 'sortOrder') {
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag active';
                filterTag.innerHTML = `
                    ${this.getFilterLabel(key)}: ${this.getFilterValue(key, value)}
                    <span class="remove" data-filter="${key}">&times;</span>
                `;
                container.appendChild(filterTag);
            }
        });

        // Add remove event listeners
        container.querySelectorAll('.remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const filterKey = removeBtn.dataset.filter;
                this.removeFilter(filterKey);
            });
        });
    }

    getFilterLabel(key) {
        const labels = {
            'category': 'Category',
            'risk': 'Risk',
            'returns': 'Returns',
            'amc': 'Fund House',
            'search': 'Search'
        };
        return labels[key] || key;
    }

    getFilterValue(key, value) {
        if (key === 'category') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (key === 'risk') {
            const riskLabels = {
                'low': 'Low Risk',
                'medium': 'Medium Risk',
                'high': 'High Risk',
                'very_high': 'Very High Risk'
            };
            return riskLabels[value] || value;
        }
        if (key === 'returns') {
            const returnLabels = {
                'positive': 'Positive Returns',
                'negative': 'Negative Returns',
                'high_performers': 'High Performers (>15%)',
                'underperformers': 'Underperformers (<5%)'
            };
            return returnLabels[value] || value;
        }
        return value;
    }

    removeFilter(filterKey) {
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
        this.applyFilters();
    }

    renderPortfolio() {
        this.renderPortfolioTable();
        this.updatePortfolioSummary();
        this.renderTopPerformers();
        this.loadInsights();
    }

    renderPortfolioTable() {
        const tableBody = document.getElementById('portfolioTableBody');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        const pagination = document.getElementById('pagination');

        if (!tableBody) return;

        // Show loading state
        if (loadingState) loadingState.style.display = 'block';
        tableBody.innerHTML = '';

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
        }, 300);
    }

    getFundRowHTML(fund) {
        const isSelected = this.selectedFunds.has(fund.id);
        
        return `
            <tr data-id="${fund.id}" class="${isSelected ? 'selected' : ''}">
                <td>
                    <input type="checkbox" class="fund-select" data-id="${fund.id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="fund-info">
                        <div class="fund-logo" style="background: ${this.getFundColor(fund.amc)}">
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
                <td>₹${fund.currentValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>
                    <span class="performance-indicator ${fund.returnsType}">
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
            'SBI': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'HDFC': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'ICICI': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'Axis': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            'Kotak': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            'Nippon': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            'Aditya': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
            'UTI': 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)'
        };

        for (const [key, gradient] of Object.entries(colorMap)) {
            if (amc.includes(key)) {
                return gradient;
            }
        }

        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    addRowEventListeners() {
        // Checkbox listeners
        document.querySelectorAll('.fund-select:not(#selectAll)').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const fundId = parseInt(checkbox.dataset.id);
                if (checkbox.checked) {
                    this.selectedFunds.add(fundId);
                } else {
                    this.selectedFunds.delete(fundId);
                }
                this.updateBatchActions();
                this.updateSelectAllCheckbox();
            });
        });

        // Action button listeners
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.dataset.id);
                this.editFund(fundId);
            });
        });

        document.querySelectorAll('.action-btn.chart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.dataset.id);
                this.viewFundChart(fundId);
            });
        });

        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fundId = parseInt(btn.dataset.id);
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

        // Update event listeners
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

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPortfolioTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
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

    batchEdit() {
        if (this.selectedFunds.size === 0) return;
        
        alert(`Editing ${this.selectedFunds.size} selected funds. In a real app, this would open a bulk edit form.`);
    }

    batchDelete() {
        if (this.selectedFunds.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedFunds.size} selected funds? This action cannot be undone.`)) {
            // Remove selected funds from portfolio data
            this.portfolioData = this.portfolioData.filter(fund => !this.selectedFunds.has(fund.id));
            
            // Clear selection
            this.selectedFunds.clear();
            
            // Save to localStorage
            localStorage.setItem('infinity_portfolio', JSON.stringify(this.portfolioData));
            
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

    updatePortfolioSummary() {
        // Calculate totals
        const totalInvestment = this.portfolioData.reduce((sum, fund) => sum + fund.investment, 0);
        const totalValue = this.portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
        const totalReturns = totalValue - totalInvestment;
        const totalReturnsPercent = totalInvestment > 0 ? (totalReturns / totalInvestment * 100) : 0;

        // Update UI elements
        this.updateElementText('totalPortfolioValue', `₹${totalValue.toLocaleString('en-IN', {minimumFractionDigits: 0})}`);
        this.updateElementText('totalReturnsValue', `₹${totalReturns.toLocaleString('en-IN', {minimumFractionDigits: 0})}`);
        this.updateElementText('totalHoldings', `${this.portfolioData.length} funds`);
        this.updateElementText('totalInvestment', `Total Investment: ₹${totalInvestment.toLocaleString('en-IN', {minimumFractionDigits: 0})}`);
        this.updateElementText('currentValue', `Current Value: ₹${totalValue.toLocaleString('en-IN', {minimumFractionDigits: 0})}`);

        // Update equity allocation
        const equityValue = this.portfolioData
            .filter(f => f.category === 'Equity')
            .reduce((sum, f) => sum + f.currentValue, 0);
        const equityPercent = totalValue > 0 ? (equityValue / totalValue * 100) : 0;
        this.updateElementText('equityAllocation', `${equityPercent.toFixed(1)}%`);

        // Update portfolio count in sidebar
        this.updateElementText('portfolioCount', this.portfolioData.length);
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    renderTopPerformers() {
        const container = document.getElementById('topPerformersList');
        if (!container) return;

        // Sort by returns (descending) and take top 3
        const topPerformers = [...this.portfolioData]
            .sort((a, b) => b.returns - a.returns)
            .slice(0, 3);

        container.innerHTML = topPerformers.map(fund => `
            <div class="detail-item">
                <span class="detail-label">
                    ${this.truncateText(fund.name.split(' - ')[0], 20)}
                    <span class="fund-type ${fund.category.toLowerCase()}">${fund.subCategory}</span>
                </span>
                <span class="detail-value ${fund.returnsType}">
                    ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                </span>
            </div>
        `).join('');
    }

    setupCharts() {
        this.setupPerformanceChart();
    }

    setupPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        // Sample performance data
        const data = {
            '1m': [2400000, 2420000, 2450000, 2478456],
            '3m': [2300000, 2350000, 2400000, 2450000, 2478456],
            '6m': [2100000, 2150000, 2200000, 2250000, 2300000, 2350000, 2400000, 2450000, 2478456],
            '1y': [1850000, 1920000, 2010000, 2150000, 2230000, 2380000, 2410000, 2550000, 2620000, 2480000, 2530000, 2478456],
            'all': [1500000, 1600000, 1700000, 1800000, 1850000, 1920000, 2010000, 2150000, 2230000, 2380000, 2410000, 2550000, 2620000, 2480000, 2530000, 2478456]
        };

        this.performanceChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: data['1m'],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
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
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `₹${context.raw.toLocaleString('en-IN')}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: (value) => `₹${(value/1000000).toFixed(1)}M`
                        }
                    }
                }
            }
        });
    }

    updatePerformanceChart(period) {
        if (!this.performanceChart) return;

        const data = {
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

        this.performanceChart.data.labels = labels[period] || labels['1m'];
        this.performanceChart.data.datasets[0].data = data[period] || data['1m'];
        this.performanceChart.update();
    }

    loadInsights() {
        const container = document.getElementById('insightsGrid');
        if (!container) return;

        // Calculate insights
        const totalValue = this.portfolioData.reduce((sum, fund) => sum + fund.currentValue, 0);
        const equityValue = this.portfolioData
            .filter(f => f.category === 'Equity')
            .reduce((sum, f) => sum + f.currentValue, 0);
        const equityPercent = totalValue > 0 ? (equityValue / totalValue * 100) : 0;

        const topPerformer = [...this.portfolioData].sort((a, b) => b.returns - a.returns)[0];
        const uniqueCategories = new Set(this.portfolioData.map(f => f.category)).size;
        const uniqueAMCs = new Set(this.portfolioData.map(f => f.amc)).size;

        container.innerHTML = `
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
                        <span class="detail-label">Recommended</span>
                        <span class="detail-value">60-70%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Your Allocation</span>
                        <span class="detail-value">${equityPercent.toFixed(1)}%</span>
                    </div>
                    ${equityPercent > 70 ? `
                        <div class="detail-item">
                            <span class="detail-label suggestion">Suggestion</span>
                            <span class="detail-value suggestion">Consider reducing equity exposure</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-header">
                    <h3>Top Performer</h3>
                    <span class="summary-change positive">
                        +${topPerformer?.returns.toFixed(1) || 0}%
                    </span>
                </div>
                <div class="summary-value">${this.truncateText(topPerformer?.name.split(' - ')[0] || 'N/A', 15)}</div>
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
                    <span class="summary-change ${this.portfolioData.length >= 6 ? 'positive' : 'negative'}">
                        ${this.portfolioData.length >= 6 ? 'Good' : 'Needs Improvement'}
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
                    ${this.portfolioData.length < 6 ? `
                        <div class="detail-item">
                            <span class="detail-label suggestion">Suggestion</span>
                            <span class="detail-value suggestion">Add more funds for better diversification</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showAddFundModal() {
        alert('Add fund modal would open here. In a real app, this would show a form to add new investments.');
    }

    editFund(fundId) {
        const fund = this.portfolioData.find(f => f.id === fundId);
        if (!fund) return;

        alert(`Editing fund: ${fund.name}. In a real app, this would open an edit form.`);
    }

    viewFundChart(fundId) {
        const fund = this.portfolioData.find(f => f.id === fundId);
        if (!fund) return;

        alert(`Showing chart for: ${fund.name}. In a real app, this would display a detailed performance chart.`);
    }

    deleteFund(fundId) {
        if (confirm('Are you sure you want to delete this fund from your portfolio?')) {
            this.portfolioData = this.portfolioData.filter(f => f.id !== fundId);
            this.selectedFunds.delete(fundId);
            
            // Save to localStorage
            localStorage.setItem('infinity_portfolio', JSON.stringify(this.portfolioData));
            
            // Update UI
            this.applyFilters();
            this.showNotification('Fund deleted successfully', 'success');
        }
    }

    importPortfolio() {
        alert('Import portfolio feature would open here. You can upload CAS file or connect with AMCs.');
    }

    exportPortfolio() {
        this.exportToCSV(this.portfolioData, 'infinity-portfolio.csv');
        this.showNotification('Portfolio exported successfully', 'success');
    }

    exportToCSV(data, filename) {
        const headers = ['Name', 'AMC', 'Category', 'Sub Category', 'Units', 'Avg Cost', 'Current NAV', 'Investment', 'Current Value', 'Returns %', 'Risk', 'SIP', 'Goal'];
        const csvData = data.map(fund => [
            fund.name,
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
            fund.goal || '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    globalSearch(query) {
        if (!query.trim()) return;

        // Apply search filter
        document.getElementById('searchFunds').value = query;
        this.applyFilters();
        
        if (this.filteredData.length === 0) {
            this.showNotification(`No results found for "${query}"`, 'info');
        } else {
            this.showNotification(`Found ${this.filteredData.length} results for "${query}"`, 'success');
        }
    }

    showAllPerformance() {
        alert('Showing all performance data. In a real app, this would navigate to a detailed performance analysis page.');
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add styles if not already added
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
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
                    z-index: 10000;
                    animation: slideInUp 0.3s ease;
                    max-width: 400px;
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
            `;
            document.head.appendChild(style);
        }

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

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the portfolio page
    if (document.querySelector('.portfolio-header')) {
        window.portfolioManager = new PortfolioManager();
    }
});