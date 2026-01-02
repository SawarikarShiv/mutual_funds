// Market Dashboard JavaScript

class MarketDashboard {
    constructor() {
        this.sectors = [];
        this.chart = null;
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.loadMarketData();
        this.setupEventListeners();
        this.startAutoRefresh();
        this.updateDateTime();
    }

    loadMarketData() {
        // This would typically fetch from an API
        // For now, we'll use sample data
        this.sectors = [
            {
                name: "Banking",
                performance: 1.25,
                stocks: [
                    { name: "HDFC Bank", symbol: "HDFCBANK", price: 1745.20, change: 2.4 },
                    { name: "ICICI Bank", symbol: "ICICIBANK", price: 1112.50, change: 1.8 },
                    { name: "SBI", symbol: "SBIN", price: 725.80, change: 1.2 }
                ]
            },
            // ... more sectors
        ];
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterSectors(e.target.dataset.filter));
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshMarket');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshMarketData());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.openThemeModal());
        }
    }

    filterSectors(filter) {
        const sectors = document.querySelectorAll('.sector-card');
        sectors.forEach(sector => {
            if (filter === 'all' || sector.dataset.sector === filter) {
                sector.style.display = 'block';
                sector.style.animation = 'fadeIn 0.5s ease';
            } else {
                sector.style.display = 'none';
            }
        });

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }

    refreshMarketData() {
        const btn = document.getElementById('refreshMarket');
        if (btn) {
            btn.classList.add('rotating');
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                this.updateMarketValues();
                this.showToast('Market data refreshed successfully!');
                btn.classList.remove('rotating');
                btn.disabled = false;
            }, 1000);
        }
    }

    updateMarketValues() {
        // Update main indices
        const indices = ['niftyValue', 'sensexValue', 'bankNifty'];
        indices.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const current = parseFloat(element.textContent.replace(/,/g, ''));
                const change = (Math.random() - 0.5) * 10;
                const newValue = current + change;
                element.textContent = newValue.toFixed(2);
                element.classList.add('price-updating');
                setTimeout(() => element.classList.remove('price-updating'), 500);
            }
        });

        // Update stock prices
        document.querySelectorAll('.current-price').forEach(priceElement => {
            const current = parseFloat(priceElement.textContent.replace(/[₹,]/g, ''));
            const change = (Math.random() - 0.5) * 5;
            const newPrice = current + change;
            priceElement.textContent = `₹${newPrice.toFixed(2)}`;

            // Update change percentage
            const changeElement = priceElement.nextElementSibling;
            if (changeElement && changeElement.classList.contains('price-change')) {
                const changePercent = (change / current * 100).toFixed(2);
                changeElement.textContent = `${parseFloat(changePercent) >= 0 ? '+' : ''}${changePercent}%`;
                changeElement.className = `price-change ${parseFloat(changePercent) >= 0 ? 'change-positive' : 'change-negative'}`;
            }
        });
    }

    updateDateTime() {
        const now = new Date();
        const dateElement = document.getElementById('currentDate');
        const timeElement = document.getElementById('currentDateTime');

        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }
    }

    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.updateMarketValues();
            this.showToast('Auto-refresh: Market data updated');
        }, 30000); // Every 30 seconds
    }

    showToast(message) {
        const toast = document.getElementById('updateToast');
        if (toast) {
            const content = toast.querySelector('.toast-content span');
            if (content) content.textContent = message;
            
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    }

    openThemeModal() {
        const modal = document.getElementById('themeModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marketDashboard = new MarketDashboard();
    
    // Update time every second
    setInterval(() => window.marketDashboard.updateDateTime(), 1000);
});