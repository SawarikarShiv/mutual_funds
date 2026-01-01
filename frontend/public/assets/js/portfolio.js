// Real-time Portfolio Manager
class PortfolioManager {
    constructor() {
        this.portfolioData = [];
        this.liveUpdateInterval = null;
        this.liveUpdatesEnabled = true;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.lastUpdateTime = new Date();
        this.init();
    }

    async init() {
        await this.loadPortfolioData();
        this.renderPortfolio();
        this.setupEventListeners();
        
        if (this.liveUpdatesEnabled) {
            this.startLiveUpdates();
        }
        
        this.updateMarketStatus();
        this.startMarketClock();
    }

    async loadPortfolioData() {
        // In a real app, this would be an API call
        // For demo, we'll use static data with simulated real-time updates
        this.portfolioData = [
            {
                id: 1,
                name: 'SBI Bluechip Fund',
                amc: 'SBI Mutual Fund',
                units: 1234.56,
                avgCost: 45.20,
                currentNav: 52.10,
                value: 64320,
                gain: 15.2,
                category: 'Equity',
                lastUpdated: new Date()
            },
            {
                id: 2,
                name: 'HDFC Balanced Fund',
                amc: 'HDFC Mutual Fund',
                units: 890.12,
                avgCost: 32.50,
                currentNav: 35.80,
                value: 31867,
                gain: 10.1,
                category: 'Hybrid',
                lastUpdated: new Date()
            },
            // Add more sample data...
            {
                id: 3,
                name: 'ICICI Prudential Technology Fund',
                amc: 'ICICI Prudential',
                units: 567.89,
                avgCost: 28.30,
                currentNav: 32.15,
                value: 18245,
                gain: 13.6,
                category: 'Sectoral',
                lastUpdated: new Date()
            }
        ];
    }

    simulateMarketMovement() {
        // Simulate NAV changes as in real market
        this.portfolioData.forEach(fund => {
            // Generate random small movement (-0.5% to +0.5%)
            const changePercent = (Math.random() - 0.5) * 1;
            const change = fund.currentNav * (changePercent / 100);
            
            fund.currentNav += change;
            fund.value = fund.units * fund.currentNav;
            fund.gain = ((fund.currentNav - fund.avgCost) / fund.avgCost) * 100;
            fund.lastUpdated = new Date();
        });

        // Update summary
        this.updateSummary();
        
        // Update table
        this.renderPortfolio();
        
        // Update timestamp
        this.lastUpdateTime = new Date();
        this.updateLastUpdatedTime();
        
        // Show toast notification
        this.showUpdateToast();
    }

    updateSummary() {
        let totalValue = 0;
        let totalGain = 0;
        let totalCost = 0;

        this.portfolioData.forEach(fund => {
            totalValue += fund.value;
            totalCost += fund.units * fund.avgCost;
        });

        totalGain = totalValue - totalCost;
        const overallGainPercent = (totalGain / totalCost) * 100;

        // Update DOM
        const totalValueElem = document.getElementById('totalValue');
        const totalGainElem = document.getElementById('totalGain');
        const todayChangeElem = document.getElementById('todayChange');
        const overallChangeElem = document.getElementById('overallChange');
        const fundsCountElem = document.getElementById('fundsCount');

        if (totalValueElem) {
            totalValueElem.textContent = `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        if (totalGainElem) {
            totalGainElem.textContent = `₹${totalGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        if (todayChangeElem) {
            // Simulate daily change
            const dailyChange = (Math.random() * 0.5) - 0.25;
            const changeClass = dailyChange >= 0 ? 'positive' : 'negative';
            todayChangeElem.textContent = `${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}% today`;
            todayChangeElem.className = `change ${changeClass}`;
        }
        
        if (overallChangeElem) {
            const changeClass = overallGainPercent >= 0 ? 'positive' : 'negative';
            overallChangeElem.textContent = `${overallGainPercent >= 0 ? '+' : ''}${overallGainPercent.toFixed(2)}% overall`;
            overallChangeElem.className = `change ${changeClass}`;
        }
        
        if (fundsCountElem) {
            fundsCountElem.textContent = this.portfolioData.length;
        }
    }

    renderPortfolio() {
        const tbody = document.getElementById('portfolioTbody');
        if (!tbody) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.portfolioData.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        pageData.forEach(fund => {
            const row = document.createElement('tr');
            
            // Format numbers
            const formattedUnits = fund.units.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedAvgCost = `₹${fund.avgCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const formattedNav = `₹${fund.currentNav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const formattedValue = `₹${fund.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const gainClass = fund.gain >= 0 ? 'positive' : 'negative';
            const gainText = `${fund.gain >= 0 ? '+' : ''}${fund.gain.toFixed(2)}%`;

            row.innerHTML = `
                <td>
                    <div class="fund-name">
                        <strong>${fund.name}</strong>
                        <span class="fund-category">${fund.category}</span>
                    </div>
                </td>
                <td>${fund.amc}</td>
                <td>${formattedUnits}</td>
                <td>${formattedAvgCost}</td>
                <td>
                    <div class="nav-container">
                        <span class="nav-value">${formattedNav}</span>
                        <span class="nav-change ${gainClass}">
                            <i class="fas fa-arrow-${fund.gain >= 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(fund.gain).toFixed(2)}%
                        </span>
                    </div>
                </td>
                <td>${formattedValue}</td>
                <td class="${gainClass}">${gainText}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${fund.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" data-id="${fund.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${fund.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Update pagination info
        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const totalPages = Math.ceil(this.portfolioData.length / this.itemsPerPage);
        const currentPageElem = document.getElementById('currentPage');
        const totalPagesElem = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (currentPageElem) currentPageElem.textContent = this.currentPage;
        if (totalPagesElem) totalPagesElem.textContent = totalPages;
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshPortfolio');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.manualRefresh();
            });
        }

        // Live update toggle
        const liveToggle = document.getElementById('liveUpdateToggle');
        if (liveToggle) {
            liveToggle.addEventListener('click', () => {
                this.toggleLiveUpdates();
                liveToggle.innerHTML = `
                    <i class="fas fa-bolt"></i>
                    <span>Live Updates: ${this.liveUpdatesEnabled ? 'ON' : 'OFF'}</span>
                `;
            });
        }

        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderPortfolio();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.portfolioData.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderPortfolio();
                }
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchFunds');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchFunds(e.target.value);
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortFunds');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortFunds(e.target.value);
            });
        }

        // Add action button listeners
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const fundId = e.target.closest('.view-btn').dataset.id;
                this.viewFundDetails(fundId);
            }
            
            if (e.target.closest('.edit-btn')) {
                const fundId = e.target.closest('.edit-btn').dataset.id;
                this.editFund(fundId);
            }
            
            if (e.target.closest('.delete-btn')) {
                const fundId = e.target.closest('.delete-btn').dataset.id;
                this.deleteFund(fundId);
            }
        });
    }

    startLiveUpdates() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
        }

        this.liveUpdateInterval = setInterval(() => {
            if (this.liveUpdatesEnabled) {
                this.simulateMarketMovement();
            }
        }, 30000); // Update every 30 seconds

        // Update market status indicator
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.classList.add('live');
            statusIndicator.classList.remove('closed');
        }
    }

    stopLiveUpdates() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
            this.liveUpdateInterval = null;
            
            // Update market status indicator
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.classList.remove('live');
                statusIndicator.classList.add('closed');
            }
        }
    }

    toggleLiveUpdates() {
        this.liveUpdatesEnabled = !this.liveUpdatesEnabled;
        
        if (this.liveUpdatesEnabled) {
            this.startLiveUpdates();
        } else {
            this.stopLiveUpdates();
        }
    }

    manualRefresh() {
        // Show loading state
        const refreshBtn = document.getElementById('refreshPortfolio');
        if (refreshBtn) {
            const originalHTML = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                this.simulateMarketMovement();
                refreshBtn.innerHTML = originalHTML;
                refreshBtn.disabled = false;
            }, 1000);
        }
    }

    updateLastUpdatedTime() {
        const timeElem = document.getElementById('lastUpdateTime');
        if (timeElem) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeElem.textContent = `Last updated: ${timeString}`;
        }
    }

    updateMarketStatus() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Check if market is open (9:15 AM to 3:30 PM)
        const isMarketOpen = (hours > 9 || (hours === 9 && minutes >= 15)) && 
                            (hours < 15 || (hours === 15 && minutes <= 30));
        
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            if (isMarketOpen) {
                statusIndicator.className = 'status-indicator live';
                statusIndicator.querySelector('span').textContent = 'Live Market Data';
            } else {
                statusIndicator.className = 'status-indicator closed';
                statusIndicator.querySelector('span').textContent = 'Market Closed';
            }
        }
    }

    startMarketClock() {
        setInterval(() => {
            this.updateMarketStatus();
            
            // Update market time display
            const marketTimeElem = document.getElementById('marketTime');
            if (marketTimeElem) {
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                marketTimeElem.textContent = `Market Time: ${timeString}`;
            }
        }, 1000);
    }

    showUpdateToast() {
        const toast = document.getElementById('updateToast');
        if (toast) {
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    searchFunds(query) {
        // Filter and re-render based on search query
        // Implementation depends on your data structure
        console.log('Searching for:', query);
    }

    sortFunds(criteria) {
        // Sort portfolio data based on criteria
        // Implementation depends on your data structure
        console.log('Sorting by:', criteria);
    }

    viewFundDetails(fundId) {
        console.log('View fund details:', fundId);
        // Implement fund details view
    }

    editFund(fundId) {
        console.log('Edit fund:', fundId);
        // Implement fund edit functionality
    }

    deleteFund(fundId) {
        if (confirm('Are you sure you want to delete this fund from your portfolio?')) {
            console.log('Delete fund:', fundId);
            // Implement fund deletion
        }
    }
}

// Initialize Portfolio Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
});