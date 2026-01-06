// ===== DASHBOARD FUNCTIONALITY =====
class Dashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadDashboardData();
        this.initCharts();
        this.initDashboardEvents();
    }

    async loadDashboardData() {
        try {
            // Load portfolio summary
            const portfolioData = await this.fetchPortfolioSummary();
            this.updatePortfolioSummary(portfolioData);
            
            // Load recent transactions
            const transactions = await this.fetchRecentTransactions();
            this.updateRecentTransactions(transactions);
            
            // Load performance data
            const performance = await this.fetchPerformanceData();
            this.updatePerformanceChart(performance);
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            window.app.showAlert('Failed to load dashboard data', 'error');
        }
    }

    async fetchPortfolioSummary() {
        // Simulate API call - replace with actual API endpoint
        return {
            totalInvestment: 1250000,
            currentValue: 1385000,
            totalReturn: 135000,
            returnPercentage: 10.8,
            totalFunds: 8,
            annualizedReturn: 12.3
        };
    }

    async fetchRecentTransactions() {
        // Simulate API call
        return [
            {
                id: 1,
                date: '2024-01-15',
                type: 'investment',
                fund: 'Infinity Equity Fund',
                amount: 50000,
                status: 'completed'
            },
            {
                id: 2,
                date: '2024-01-10',
                type: 'dividend',
                fund: 'Infinity Dividend Fund',
                amount: 2500,
                status: 'completed'
            },
            {
                id: 3,
                date: '2024-01-05',
                type: 'redemption',
                fund: 'Infinity Debt Fund',
                amount: 25000,
                status: 'completed'
            }
        ];
    }

    async fetchPerformanceData() {
        // Simulate API call for chart data
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Portfolio Value',
                data: [1000000, 1050000, 1080000, 1120000, 1150000, 1180000, 1200000, 1220000, 1250000, 1280000, 1320000, 1385000],
                borderColor: '#1e3a8a',
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                fill: true
            }]
        };
    }

    updatePortfolioSummary(data) {
        document.querySelectorAll('[data-stat="totalInvestment"]').forEach(el => {
            el.textContent = window.app.formatCurrency(data.totalInvestment);
        });
        
        document.querySelectorAll('[data-stat="currentValue"]').forEach(el => {
            el.textContent = window.app.formatCurrency(data.currentValue);
        });
        
        document.querySelectorAll('[data-stat="totalReturn"]').forEach(el => {
            el.textContent = window.app.formatCurrency(data.totalReturn);
        });
        
        document.querySelectorAll('[data-stat="returnPercentage"]').forEach(el => {
            el.textContent = `${data.returnPercentage}%`;
            el.style.color = data.returnPercentage >= 0 ? 'var(--accent-color)' : 'var(--danger-color)';
        });
        
        document.querySelectorAll('[data-stat="totalFunds"]').forEach(el => {
            el.textContent = data.totalFunds;
        });
        
        document.querySelectorAll('[data-stat="annualizedReturn"]').forEach(el => {
            el.textContent = `${data.annualizedReturn}%`;
        });
    }

    updateRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactions');
        if (!container) return;
        
        const html = transactions.map(transaction => `
            <tr>
                <td>${window.app.formatDate(transaction.date)}</td>
                <td>
                    <span class="badge badge-${transaction.type === 'investment' ? 'success' : 
                                            transaction.type === 'dividend' ? 'info' : 'warning'}">
                        ${transaction.type}
                    </span>
                </td>
                <td>${transaction.fund}</td>
                <td>${window.app.formatCurrency(transaction.amount)}</td>
                <td>
                    <span class="badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}">
                        ${transaction.status}
                    </span>
                </td>
            </tr>
        `).join('');
        
        const tbody = container.querySelector('tbody') || container;
        tbody.innerHTML = html;
    }

    initCharts() {
        // Initialize performance chart
        const performanceCanvas = document.getElementById('performanceChart');
        if (performanceCanvas && typeof Chart !== 'undefined') {
            // This would be populated with actual data
            this.performanceChart = new Chart(performanceCanvas, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
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
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + (value / 1000) + 'K';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Initialize asset allocation chart
        const allocationCanvas = document.getElementById('allocationChart');
        if (allocationCanvas && typeof Chart !== 'undefined') {
            this.allocationChart = new Chart(allocationCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Equity', 'Debt', 'Hybrid', 'Others'],
                    datasets: [{
                        data: [60, 25, 10, 5],
                        backgroundColor: [
                            '#1e3a8a',
                            '#0ea5e9',
                            '#10b981',
                            '#f59e0b'
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
    }

    updatePerformanceChart(data) {
        if (this.performanceChart && data) {
            this.performanceChart.data = data;
            this.performanceChart.update();
        }
    }

    initDashboardEvents() {
        // Refresh button
        document.getElementById('refreshDashboard')?.addEventListener('click', () => {
            this.loadDashboardData();
            window.app.showAlert('Dashboard refreshed', 'success');
        });

        // Quick action buttons
        document.querySelectorAll('[data-quick-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.quickAction;
                this.handleQuickAction(action);
            });
        });

        // Export dashboard data
        document.getElementById('exportDashboard')?.addEventListener('click', () => {
            this.exportDashboardData();
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'addInvestment':
                window.app.openModal('addInvestmentModal');
                break;
            case 'redeem':
                window.app.openModal('redeemModal');
                break;
            case 'downloadStatement':
                this.downloadStatement();
                break;
            case 'contactAdvisor':
                window.location.href = 'contact.html';
                break;
        }
    }

    async downloadStatement() {
        try {
            // Show loading
            const btn = document.querySelector('[data-quick-action="downloadStatement"]');
            const originalText = btn.innerHTML;
            showLoading(btn);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create and download PDF
            this.generatePDFStatement();
            
            window.app.showAlert('Statement downloaded successfully', 'success');
            
        } catch (error) {
            window.app.showAlert('Failed to download statement', 'error');
        } finally {
            const btn = document.querySelector('[data-quick-action="downloadStatement"]');
            hideLoading(btn, originalText);
        }
    }

    generatePDFStatement() {
        // This would generate an actual PDF
        // For now, we'll create a simple HTML download
        const content = `
            <h1>Portfolio Statement</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <!-- Add actual statement content here -->
        `;
        
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-statement-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportDashboardData() {
        const data = {
            exportedAt: new Date().toISOString(),
            portfolio: {},
            transactions: []
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ===== INITIALIZE DASHBOARD =====
if (document.querySelector('.dashboard-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new Dashboard();
    });
}

// ===== BADGE STYLES (for transactions) =====
const style = document.createElement('style');
style.textContent = `
    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .badge-success {
        background: #d1fae5;
        color: #065f46;
    }
    
    .badge-warning {
        background: #fef3c7;
        color: #92400e;
    }
    
    .badge-info {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .badge-error {
        background: #fee2e2;
        color: #991b1b;
    }
`;
document.head.appendChild(style);