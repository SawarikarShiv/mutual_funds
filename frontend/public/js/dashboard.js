/**
 * Dashboard Functions for Infinity Mutual Funds
 */

class Dashboard {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        this.init();
    }
    
    async init() {
        await this.loadDashboardData();
        this.setupEventListeners();
        this.updateGreeting();
    }
    
    async loadDashboardData() {
        try {
            // Load multiple data sources in parallel
            const [portfolio, transactions, market] = await Promise.all([
                this.fetchPortfolioSummary(),
                this.fetchRecentTransactions(),
                this.fetchMarketUpdates()
            ]);
            
            this.renderPortfolioSummary(portfolio);
            this.renderRecentTransactions(transactions);
            this.renderMarketUpdates(market);
            this.updateCharts();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            InfinityMF.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    async fetchPortfolioSummary() {
        const response = await InfinityMF.makeRequest('portfolio/summary');
        return response?.data || {};
    }
    
    async fetchRecentTransactions() {
        const response = await InfinityMF.makeRequest('transactions/recent?limit=5');
        return response?.data || [];
    }
    
    async fetchMarketUpdates() {
        const response = await InfinityMF.makeRequest('market/updates');
        return response?.data || [];
    }
    
    renderPortfolioSummary(data) {
        const container = document.getElementById('portfolio-summary');
        if (!container) return;
        
        container.innerHTML = `
            <div class="summary-card">
                <h3>Total Investment</h3>
                <div class="amount">${InfinityMF.formatCurrency(data.total_investment || 0)}</div>
                <div class="change ${data.daily_change >= 0 ? 'positive' : 'negative'}">
                    ${data.daily_change >= 0 ? '↗' : '↘'} ${Math.abs(data.daily_change || 0)}% today
                </div>
            </div>
            <div class="summary-card">
                <h3>Current Value</h3>
                <div class="amount">${InfinityMF.formatCurrency(data.current_value || 0)}</div>
                <div class="change ${data.total_return >= 0 ? 'positive' : 'negative'}">
                    ${data.total_return >= 0 ? '+' : ''}${InfinityMF.formatCurrency(data.total_return || 0)}
                </div>
            </div>
            <div class="summary-card">
                <h3>Number of Funds</h3>
                <div class="amount">${data.fund_count || 0}</div>
                <div class="subtitle">Active Investments</div>
            </div>
            <div class="summary-card">
                <h3>Avg. Returns</h3>
                <div class="amount ${data.avg_returns >= 0 ? 'positive' : 'negative'}">
                    ${data.avg_returns >= 0 ? '+' : ''}${data.avg_returns || 0}%
                </div>
                <div class="subtitle">Annualized</div>
            </div>
        `;
    }
    
    renderRecentTransactions(transactions) {
        const container = document.getElementById('recent-transactions');
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = '<p class="no-data">No recent transactions</p>';
            return;
        }
        
        const html = transactions.map(txn => `
            <div class="transaction-item">
                <div class="txn-info">
                    <div class="txn-type ${txn.type}">${txn.type.toUpperCase()}</div>
                    <div class="txn-details">
                        <strong>${txn.fund_name}</strong>
                        <small>${InfinityMF.formatDate(txn.date)} • ${txn.status}</small>
                    </div>
                </div>
                <div class="txn-amount ${txn.type === 'redemption' ? 'negative' : 'positive'}">
                    ${txn.type === 'redemption' ? '-' : '+'}${InfinityMF.formatCurrency(txn.amount)}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    renderMarketUpdates(updates) {
        const container = document.getElementById('market-updates');
        if (!container) return;
        
        const html = updates.map(update => `
            <div class="market-update">
                <div class="update-header">
                    <span class="index-name">${update.index}</span>
                    <span class="index-value ${update.change >= 0 ? 'positive' : 'negative'}">
                        ${update.value.toFixed(2)} (${update.change >= 0 ? '+' : ''}${update.change}%)
                    </span>
                </div>
                <div class="update-time">Updated: ${update.time}</div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    updateGreeting() {
        const greetingEl = document.getElementById('user-greeting');
        if (greetingEl) {
            const hour = new Date().getHours();
            let greeting = 'Good ';
            
            if (hour < 12) greeting += 'Morning';
            else if (hour < 17) greeting += 'Afternoon';
            else greeting += 'Evening';
            
            greetingEl.textContent = `${greeting}, ${this.userData.full_name || 'Investor'}!`;
        }
    }
    
    updateCharts() {
        // Initialize charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.renderPortfolioChart();
            this.renderAllocationChart();
        }
    }
    
    renderPortfolioChart() {
        const ctx = document.getElementById('portfolio-chart');
        if (!ctx) return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [100000, 105000, 110000, 108000, 115000, 120000],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    renderAllocationChart() {
        const ctx = document.getElementById('allocation-chart');
        if (!ctx) return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Equity', 'Debt', 'Hybrid', 'Gold', 'International'],
                datasets: [{
                    data: [40, 30, 15, 10, 5],
                    backgroundColor: [
                        '#3498db', '#2ecc71', '#9b59b6', 
                        '#f1c40f', '#e74c3c'
                    ]
                }]
            },
            options: {
                responsive: true,
                cutout: '70%'
            }
        });
    }
    
    setupEventListeners() {
        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }
        
        // Search transactions
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchTransactions(e.target.value);
            }, 300));
        }
    }
    
    handleQuickAction(action) {
        const actions = {
            'invest': () => window.location.href = 'invest.html',
            'redeem': () => window.location.href = 'redeem.html',
            'sip': () => window.location.href = 'sip.html',
            'switch': () => window.location.href = 'switch.html'
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    async searchTransactions(query) {
        if (!query.trim()) {
            await this.loadDashboardData();
            return;
        }
        
        const response = await InfinityMF.makeRequest(`transactions/search?q=${encodeURIComponent(query)}`);
        if (response?.data) {
            this.renderRecentTransactions(response.data);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboard-container')) {
        new Dashboard();
    }
});