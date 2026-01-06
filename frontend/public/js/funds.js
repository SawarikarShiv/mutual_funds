/**
 * Mutual Funds Management for Infinity Mutual Funds
 */

class FundsManager {
    constructor() {
        this.funds = [];
        this.filteredFunds = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.init();
    }
    
    async init() {
        await this.loadFunds();
        this.setupEventListeners();
        this.setupFilters();
        this.renderFunds();
    }
    
    async loadFunds() {
        try {
            const response = await InfinityMF.makeRequest('funds');
            if (response?.data) {
                this.funds = response.data;
                this.filteredFunds = [...this.funds];
                this.updateStats();
            }
        } catch (error) {
            console.error('Error loading funds:', error);
            InfinityMF.showNotification('Failed to load funds data', 'error');
        }
    }
    
    updateStats() {
        const totalFunds = this.funds.length;
        const equityFunds = this.funds.filter(f => f.category === 'Equity').length;
        const debtFunds = this.funds.filter(f => f.category === 'Debt').length;
        const totalAUM = this.funds.reduce((sum, fund) => sum + (fund.aum || 0), 0);
        
        // Update stats display
        const statsContainer = document.getElementById('funds-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <h4>Total Funds</h4>
                    <div class="stat-value">${totalFunds}</div>
                </div>
                <div class="stat-card">
                    <h4>Equity Funds</h4>
                    <div class="stat-value">${equityFunds}</div>
                </div>
                <div class="stat-card">
                    <h4>Debt Funds</h4>
                    <div class="stat-value">${debtFunds}</div>
                </div>
                <div class="stat-card">
                    <h4>Total AUM</h4>
                    <div class="stat-value">${InfinityMF.formatCurrency(totalAUM)}</div>
                </div>
            `;
        }
    }
    
    renderFunds() {
        const container = document.getElementById('funds-container');
        const pagination = document.getElementById('funds-pagination');
        
        if (!container) return;
        
        // Apply sorting
        this.sortFunds();
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageFunds = this.filteredFunds.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.filteredFunds.length / this.itemsPerPage);
        
        if (pageFunds.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="no-data">
                            <p>No funds found matching your criteria</p>
                            <button onclick="fundsManager.clearFilters()" class="btn-clear-filters">
                                Clear Filters
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            const html = pageFunds.map(fund => `
                <tr data-fund-id="${fund.id}">
                    <td>
                        <div class="fund-scheme">
                            <strong>${fund.scheme_name}</strong>
                            <small>${fund.amc || 'N/A'}</small>
                        </div>
                    </td>
                    <td>
                        <span class="fund-category category-${fund.category.toLowerCase()}">
                            ${fund.category}
                        </span>
                    </td>
                    <td>
                        <div class="nav-display">
                            <strong>${fund.nav?.toFixed(2) || 'N/A'}</strong>
                            <small class="nav-change ${fund.nav_change >= 0 ? 'positive' : 'negative'}">
                                ${fund.nav_change >= 0 ? '↗' : '↘'} ${Math.abs(fund.nav_change || 0).toFixed(2)}%
                            </small>
                        </div>
                    </td>
                    <td>${fund.rating ? '★'.repeat(fund.rating) + '☆'.repeat(5 - fund.rating) : 'N/R'}</td>
                    <td>${InfinityMF.formatCurrency(fund.min_sip || 0)}</td>
                    <td>${InfinityMF.formatCurrency(fund.min_lumpsum || 0)}</td>
                    <td>
                        <span class="risk-level risk-${fund.risk_level?.toLowerCase() || 'medium'}">
                            ${fund.risk_level || 'Medium'}
                        </span>
                    </td>
                    <td>
                        <div class="fund-actions">
                            <button class="btn-action btn-details" 
                                    onclick="fundsManager.viewFundDetails(${fund.id})"
                                    data-tooltip="View Details">
                                📊
                            </button>
                            <button class="btn-action btn-invest" 
                                    onclick="fundsManager.investInFund(${fund.id})"
                                    data-tooltip="Invest">
                                💰
                            </button>
                            <button class="btn-action btn-compare" 
                                    onclick="fundsManager.addToCompare(${fund.id})"
                                    data-tooltip="Add to Compare">
                                ⚖️
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            container.innerHTML = html;
            InfinityMF.initializeTooltips();
        }
        
        // Update pagination
        if (pagination) {
            this.updatePagination(pagination, totalPages);
        }
    }
    
    sortFunds() {
        this.filteredFunds.sort((a, b) => {
            let aVal, bVal;
            
            switch (this.sortBy) {
                case 'name':
                    aVal = a.scheme_name.toLowerCase();
                    bVal = b.scheme_name.toLowerCase();
                    break;
                case 'nav':
                    aVal = a.nav || 0;
                    bVal = b.nav || 0;
                    break;
                case 'returns_1y':
                    aVal = a.returns_1y || 0;
                    bVal = b.returns_1y || 0;
                    break;
                case 'aum':
                    aVal = a.aum || 0;
                    bVal = b.aum || 0;
                    break;
                default:
                    aVal = a[this.sortBy];
                    bVal = b[this.sortBy];
            }
            
            if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    updatePagination(container, totalPages) {
        let html = '';
        
        // Previous button
        html += `
            <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="fundsManager.changePage(${this.currentPage - 1})"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Previous
            </button>
        `;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="fundsManager.changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        html += `
            <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="fundsManager.changePage(${this.currentPage + 1})"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next →
            </button>
        `;
        
        container.innerHTML = html;
    }
    
    changePage(page) {
        if (page < 1 || page > Math.ceil(this.filteredFunds.length / this.itemsPerPage)) {
            return;
        }
        
        this.currentPage = page;
        this.renderFunds();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setupEventListeners() {
        // Sort buttons
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sortField = e.target.dataset.sort;
                this.setSort(sortField);
            });
        });
        
        // Items per page selector
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderFunds();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-funds');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportFunds());
        }
        
        // Compare button
        const compareBtn = document.getElementById('compare-funds');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.showCompareModal());
        }
    }
    
    setupFilters() {
        const categoryFilter = document.getElementById('filter-category');
        const riskFilter = document.getElementById('filter-risk');
        const amcFilter = document.getElementById('filter-amc');
        const searchInput = document.getElementById('fund-search');
        
        if (categoryFilter) {
            // Populate category options
            const categories = [...new Set(this.funds.map(f => f.category).filter(Boolean))];
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (riskFilter) {
            riskFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (amcFilter) {
            // Populate AMC options
            const amcs = [...new Set(this.funds.map(f => f.amc).filter(Boolean))];
            amcs.forEach(amc => {
                const option = document.createElement('option');
                option.value = amc;
                option.textContent = amc;
                amcFilter.appendChild(option);
            });
            
            amcFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchFunds(e.target.value);
            }, 300));
        }
    }
    
    applyFilters() {
        const category = document.getElementById('filter-category')?.value;
        const risk = document.getElementById('filter-risk')?.value;
        const amc = document.getElementById('filter-amc')?.value;
        const minReturns = document.getElementById('filter-min-returns')?.value;
        
        this.filteredFunds = this.funds.filter(fund => {
            // Category filter
            if (category && fund.category !== category) return false;
            
            // Risk filter
            if (risk && fund.risk_level?.toLowerCase() !== risk.toLowerCase()) return false;
            
            // AMC filter
            if (amc && fund.amc !== amc) return false;
            
            // Minimum returns filter
            if (minReturns && fund.returns_1y < parseFloat(minReturns)) return false;
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderFunds();
    }
    
    searchFunds(query) {
        if (!query.trim()) {
            this.filteredFunds = [...this.funds];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredFunds = this.funds.filter(fund => 
                fund.scheme_name.toLowerCase().includes(searchTerm) ||
                fund.amc?.toLowerCase().includes(searchTerm) ||
                fund.category?.toLowerCase().includes(searchTerm)
            );
        }
        
        this.currentPage = 1;
        this.renderFunds();
    }
    
    clearFilters() {
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-risk').value = '';
        document.getElementById('filter-amc').value = '';
        document.getElementById('filter-min-returns').value = '';
        document.getElementById('fund-search').value = '';
        
        this.filteredFunds = [...this.funds];
        this.currentPage = 1;
        this.renderFunds();
    }
    
    setSort(field) {
        if (this.sortBy === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortOrder = 'asc';
        }
        
        // Update sort indicators
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.classList.remove('sort-asc', 'sort-desc');
            if (btn.dataset.sort === field) {
                btn.classList.add(`sort-${this.sortOrder}`);
            }
        });
        
        this.renderFunds();
    }
    
    async viewFundDetails(fundId) {
        const response = await InfinityMF.makeRequest(`funds/${fundId}`);
        if (response?.data) {
            this.showFundDetailsModal(response.data);
        }
    }
    
    async investInFund(fundId) {
        const response = await InfinityMF.makeRequest(`funds/${fundId}`);
        if (response?.data) {
            // Store fund in session for investment page
            sessionStorage.setItem('selected_fund', JSON.stringify(response.data));
            window.location.href = 'invest.html';
        }
    }
    
    addToCompare(fundId) {
        const compareList = JSON.parse(localStorage.getItem('compare_funds') || '[]');
        
        if (compareList.includes(fundId)) {
            InfinityMF.showNotification('Fund already in comparison list', 'info');
            return;
        }
        
        if (compareList.length >= 4) {
            InfinityMF.showNotification('Maximum 4 funds can be compared at once', 'warning');
            return;
        }
        
        compareList.push(fundId);
        localStorage.setItem('compare_funds', JSON.stringify(compareList));
        InfinityMF.showNotification('Fund added to comparison list', 'success');
        
        // Update compare badge
        this.updateCompareBadge();
    }
    
    updateCompareBadge() {
        const compareList = JSON.parse(localStorage.getItem('compare_funds') || '[]');
        const badge = document.getElementById('compare-badge');
        if (badge) {
            badge.textContent = compareList.length;
            badge.style.display = compareList.length > 0 ? 'flex' : 'none';
        }
    }
    
    async showCompareModal() {
        const compareList = JSON.parse(localStorage.getItem('compare_funds') || '[]');
        
        if (compareList.length === 0) {
            InfinityMF.showNotification('No funds selected for comparison', 'info');
            return;
        }
        
        // Fetch all funds to compare
        const fundsToCompare = [];
        for (const fundId of compareList) {
            const response = await InfinityMF.makeRequest(`funds/${fundId}`);
            if (response?.data) {
                fundsToCompare.push(response.data);
            }
        }
        
        this.renderComparison(fundsToCompare);
    }
    
    renderComparison(funds) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content wide-modal">
                <div class="modal-header">
                    <h3>Compare Funds (${funds.length})</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="comparison-table-container">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    ${funds.map(fund => `<th>${fund.scheme_name}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AMC</td>
                                    ${funds.map(fund => `<td>${fund.amc}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    ${funds.map(fund => `<td>${fund.category}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>NAV</td>
                                    ${funds.map(fund => `<td>${fund.nav?.toFixed(2) || 'N/A'}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>1Y Returns</td>
                                    ${funds.map(fund => `<td class="${fund.returns_1y >= 0 ? 'positive' : 'negative'}">${fund.returns_1y ? fund.returns_1y.toFixed(2) + '%' : 'N/A'}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>3Y Returns</td>
                                    ${funds.map(fund => `<td class="${fund.returns_3y >= 0 ? 'positive' : 'negative'}">${fund.returns_3y ? fund.returns_3y.toFixed(2) + '%' : 'N/A'}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>Risk Level</td>
                                    ${funds.map(fund => `<td><span class="risk-level risk-${fund.risk_level?.toLowerCase() || 'medium'}">${fund.risk_level}</span></td>`).join('')}
                                </tr>
                                <tr>
                                    <td>Min SIP</td>
                                    ${funds.map(fund => `<td>${InfinityMF.formatCurrency(fund.min_sip)}</td>`).join('')}
                                </tr>
                                <tr>
                                    <td>Min Lumpsum</td>
                                    ${funds.map(fund => `<td>${InfinityMF.formatCurrency(fund.min_lumpsum)}</td>`).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="localStorage.removeItem('compare_funds'); location.reload();">
                        Clear Comparison
                    </button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    showFundDetailsModal(fund) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content wide-modal">
                <div class="modal-header">
                    <h3>${fund.scheme_name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="fund-details-grid">
                        <div class="fund-basic-info">
                            <div class="info-group">
                                <h4>Basic Information</h4>
                                <p><strong>AMC:</strong> ${fund.amc}</p>
                                <p><strong>Category:</strong> ${fund.category}</p>
                                <p><strong>Plan:</strong> ${fund.plan || 'N/A'}</p>
                                <p><strong>Fund Type:</strong> ${fund.fund_type || 'N/A'}</p>
                            </div>
                            
                            <div class="info-group">
                                <h4>NAV & Returns</h4>
                                <p><strong>Current NAV:</strong> ₹${fund.nav?.toFixed(2) || 'N/A'}</p>
                                <p><strong>1 Year Returns:</strong> 
                                    <span class="${fund.returns_1y >= 0 ? 'positive' : 'negative'}">
                                        ${fund.returns_1y ? fund.returns_1y.toFixed(2) + '%' : 'N/A'}
                                    </span>
                                </p>
                                <p><strong>3 Year Returns:</strong> 
                                    <span class="${fund.returns_3y >= 0 ? 'positive' : 'negative'}">
                                        ${fund.returns_3y ? fund.returns_3y.toFixed(2) + '%' : 'N/A'}
                                    </span>
                                </p>
                                <p><strong>5 Year Returns:</strong> 
                                    <span class="${fund.returns_5y >= 0 ? 'positive' : 'negative'}">
                                        ${fund.returns_5y ? fund.returns_5y.toFixed(2) + '%' : 'N/A'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="fund-investment-info">
                            <div class="info-group">
                                <h4>Investment Details</h4>
                                <p><strong>Minimum SIP:</strong> ${InfinityMF.formatCurrency(fund.min_sip)}</p>
                                <p><strong>Minimum Lumpsum:</strong> ${InfinityMF.formatCurrency(fund.min_lumpsum)}</p>
                                <p><strong>Exit Load:</strong> ${fund.exit_load || '0%'}</p>
                                <p><strong>Expense Ratio:</strong> ${fund.expense_ratio || 'N/A'}</p>
                            </div>
                            
                            <div class="info-group">
                                <h4>Risk & Rating</h4>
                                <p><strong>Risk Level:</strong> 
                                    <span class="risk-level risk-${fund.risk_level?.toLowerCase() || 'medium'}">
                                        ${fund.risk_level || 'Medium'}
                                    </span>
                                </p>
                                <p><strong>Rating:</strong> ${fund.rating ? '★'.repeat(fund.rating) + '☆'.repeat(5 - fund.rating) : 'N/R'}</p>
                                <p><strong>AUM:</strong> ${InfinityMF.formatCurrency(fund.aum)}</p>
                                <p><strong>Launch Date:</strong> ${fund.launch_date ? InfinityMF.formatDate(fund.launch_date) : 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div class="fund-description">
                            <h4>Fund Objective</h4>
                            <p>${fund.description || 'No description available.'}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="fundsManager.investInFund(${fund.id}); this.closest('.modal').remove()">
                        Invest Now
                    </button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    setupModalStyles() {
        if (!document.getElementById('fund-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'fund-modal-styles';
            style.textContent = `
                .wide-modal {
                    max-width: 800px !important;
                }
                .fund-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .fund-basic-info, .fund-investment-info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .fund-description {
                    grid-column: 1 / -1;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .info-group {
                    padding: 15px;
                    border: 1px solid #eee;
                    border-radius: 5px;
                }
                .info-group h4 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .risk-level {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .risk-low { background: #2ecc71; color: white; }
                .risk-medium { background: #f39c12; color: white; }
                .risk-high { background: #e74c3c; color: white; }
                .comparison-table-container {
                    overflow-x: auto;
                }
                .comparison-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .comparison-table th, .comparison-table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                .comparison-table th {
                    background: #f8f9fa;
                    font-weight: bold;
                }
                .comparison-table tbody tr:nth-child(even) {
                    background: #f9f9f9;
                }
                .positive { color: #27ae60; }
                .negative { color: #e74c3c; }
            `;
            document.head.appendChild(style);
        }
    }
    
    async exportFunds() {
        const response = await InfinityMF.makeRequest('funds/export');
        if (response?.data) {
            const csv = this.convertFundsToCSV(response.data);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinity-funds-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        }
    }
    
    convertFundsToCSV(funds) {
        const headers = ['Scheme Name', 'AMC', 'Category', 'NAV', '1Y Returns', '3Y Returns', 
                        'Risk Level', 'Min SIP', 'Min Lumpsum', 'AUM', 'Rating'];
        const rows = funds.map(fund => [
            `"${fund.scheme_name}"`,
            fund.amc,
            fund.category,
            fund.nav,
            fund.returns_1y,
            fund.returns_3y,
            fund.risk_level,
            fund.min_sip,
            fund.min_lumpsum,
            fund.aum,
            fund.rating
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Initialize funds manager
let fundsManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('funds-container')) {
        fundsManager = new FundsManager();
        window.fundsManager = fundsManager; // Make it globally accessible
    }
});