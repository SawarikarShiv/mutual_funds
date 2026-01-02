// Funds Management Module
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

    // Sample funds data
    const sampleFunds = [
        {
            id: 'fund_001',
            name: 'SBI Bluechip Fund',
            category: 'equity',
            subCategory: 'Large Cap',
            fundHouse: 'SBI Mutual Fund',
            rating: 4.8,
            risk: 'high',
            returns: {
                '1Y': 18.5,
                '3Y': 15.2,
                '5Y': 13.8
            },
            nav: 245.67,
            aum: 25400,
            expenseRatio: 0.65,
            minSIP: 500,
            launchDate: '2010-01-15',
            description: 'This fund primarily invests in large-cap stocks with a focus on long-term growth. Suitable for investors with high risk appetite and investment horizon of 5+ years.',
            tags: ['Large Cap', 'Growth', 'Bluechip']
        },
        {
            id: 'fund_002',
            name: 'HDFC Balanced Advantage Fund',
            category: 'hybrid',
            subCategory: 'Dynamic Asset Allocation',
            fundHouse: 'HDFC Mutual Fund',
            rating: 4.7,
            risk: 'moderate',
            returns: {
                '1Y': 16.2,
                '3Y': 14.5,
                '5Y': 12.8
            },
            nav: 187.34,
            aum: 45200,
            expenseRatio: 0.75,
            minSIP: 500,
            launchDate: '2008-03-20',
            description: 'A dynamic asset allocation fund that automatically adjusts equity exposure based on market valuation. Ideal for moderate risk investors.',
            tags: ['Balanced', 'Dynamic', 'Conservative']
        },
        {
            id: 'fund_003',
            name: 'ICICI Prudential Bond Fund',
            category: 'debt',
            subCategory: 'Corporate Bond',
            fundHouse: 'ICICI Prudential Mutual Fund',
            rating: 4.5,
            risk: 'low',
            returns: {
                '1Y': 8.2,
                '3Y': 7.8,
                '5Y': 7.5
            },
            nav: 345.21,
            aum: 15200,
            expenseRatio: 0.45,
            minSIP: 1000,
            launchDate: '2012-07-10',
            description: 'Invests primarily in high-quality corporate bonds offering stable returns with low risk. Suitable for conservative investors.',
            tags: ['Debt', 'Stable', 'Corporate Bonds']
        },
        {
            id: 'fund_004',
            name: 'Axis Nifty 100 Index Fund',
            category: 'index',
            subCategory: 'Index Fund',
            fundHouse: 'Axis Mutual Fund',
            rating: 4.3,
            risk: 'moderate',
            returns: {
                '1Y': 17.8,
                '3Y': 14.9,
                '5Y': 13.2
            },
            nav: 156.78,
            aum: 8500,
            expenseRatio: 0.25,
            minSIP: 500,
            launchDate: '2015-09-05',
            description: 'Passively managed fund replicating Nifty 100 index. Low expense ratio with market-linked returns.',
            tags: ['Index', 'Passive', 'Nifty 100']
        },
        {
            id: 'fund_005',
            name: 'Mirae Asset Tax Saver Fund',
            category: 'tax',
            subCategory: 'ELSS',
            fundHouse: 'Mirae Asset Mutual Fund',
            rating: 4.6,
            risk: 'high',
            returns: {
                '1Y': 19.2,
                '3Y': 16.5,
                '5Y': 15.8
            },
            nav: 89.45,
            aum: 12400,
            expenseRatio: 0.85,
            minSIP: 500,
            launchDate: '2011-11-30',
            description: 'Equity Linked Savings Scheme with tax benefits under Section 80C. 3-year lock-in period.',
            tags: ['ELSS', 'Tax Saving', 'Growth']
        },
        {
            id: 'fund_006',
            name: 'Kotak Emerging Equity Fund',
            category: 'equity',
            subCategory: 'Mid Cap',
            fundHouse: 'Kotak Mahindra Mutual Fund',
            rating: 4.4,
            risk: 'high',
            returns: {
                '1Y': 21.5,
                '3Y': 18.2,
                '5Y': 17.5
            },
            nav: 112.34,
            aum: 9600,
            expenseRatio: 0.78,
            minSIP: 1000,
            launchDate: '2013-04-15',
            description: 'Focuses on mid-cap companies with high growth potential. Higher risk with potential for higher returns.',
            tags: ['Mid Cap', 'Growth', 'High Risk']
        },
        {
            id: 'fund_007',
            name: 'Aditya Birla Sun Life Digital India Fund',
            category: 'sectoral',
            subCategory: 'Technology',
            fundHouse: 'Aditya Birla Sun Life Mutual Fund',
            rating: 4.7,
            risk: 'high',
            returns: {
                '1Y': 25.4,
                '3Y': 22.1,
                '5Y': 20.8
            },
            nav: 78.91,
            aum: 6800,
            expenseRatio: 0.82,
            minSIP: 500,
            launchDate: '2016-02-20',
            description: 'Sectoral fund investing in technology and digital companies. High growth potential with sector-specific risks.',
            tags: ['Technology', 'Sectoral', 'Digital India']
        },
        {
            id: 'fund_008',
            name: 'Nippon India Liquid Fund',
            category: 'debt',
            subCategory: 'Liquid',
            fundHouse: 'Nippon India Mutual Fund',
            rating: 4.2,
            risk: 'low',
            returns: {
                '1Y': 6.8,
                '3Y': 6.5,
                '5Y': 6.3
            },
            nav: 2456.78,
            aum: 38500,
            expenseRatio: 0.15,
            minSIP: 5000,
            launchDate: '2005-08-12',
            description: 'Ultra-short duration debt fund with high liquidity and minimal risk. Ideal for parking surplus funds.',
            tags: ['Liquid', 'Low Risk', 'Short Term']
        }
    ];

    // DOM Elements
    const fundsGrid = document.getElementById('fundsGrid');
    const fundSearch = document.getElementById('fundSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const riskFilter = document.getElementById('riskFilter');
    const sortFilter = document.getElementById('sortFilter');
    const applyFilters = document.getElementById('applyFilters');
    const categoryChips = document.querySelectorAll('.category-chip');
    const fundModal = document.getElementById('fundModal');
    const closeModal = document.getElementById('closeModal');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');

    // State
    let currentFunds = [...sampleFunds];
    let filteredFunds = [...sampleFunds];
    let currentCategory = 'all';

    // Initialize
    function init() {
        loadFunds();
        setupEventListeners();
        simulateLoading();
    }

    // Simulate loading for better UX
    function simulateLoading() {
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            renderFunds();
        }, 1000);
    }

    // Load funds
    function loadFunds() {
        // In a real app, this would be an API call
        console.log('Loading funds...');
    }

    // Render funds to grid
    function renderFunds() {
        if (filteredFunds.length === 0) {
            noResults.style.display = 'block';
            fundsGrid.innerHTML = '';
            return;
        }

        noResults.style.display = 'none';
        fundsGrid.innerHTML = '';

        filteredFunds.forEach(fund => {
            const fundCard = createFundCard(fund);
            fundsGrid.appendChild(fundCard);
        });
    }

    // Create fund card element
    function createFundCard(fund) {
        const card = document.createElement('div');
        card.className = 'fund-card';
        card.dataset.id = fund.id;

        const categoryColors = {
            equity: '#667eea',
            debt: '#10b981',
            hybrid: '#8b5cf6',
            index: '#f59e0b',
            sectoral: '#ef4444',
            tax: '#ec4899'
        };

        const riskLabels = {
            low: 'Low Risk',
            moderate: 'Moderate Risk',
            high: 'High Risk'
        };

        const categoryLabels = {
            equity: 'Equity',
            debt: 'Debt',
            hybrid: 'Hybrid',
            index: 'Index',
            sectoral: 'Sectoral',
            tax: 'ELSS'
        };

        const gradientColors = {
            equity: '135deg, #667eea 0%, #764ba2 100%',
            debt: '135deg, #10b981 0%, #059669 100%',
            hybrid: '135deg, #8b5cf6 0%, #7c3aed 100%',
            index: '135deg, #f59e0b 0%, #d97706 100%',
            sectoral: '135deg, #ef4444 0%, #dc2626 100%',
            tax: '135deg, #ec4899 0%, #db2777 100%'
        };

        card.innerHTML = `
            <div class="fund-card-header" style="background: linear-gradient(${gradientColors[fund.category]})">
                <h3><i class="fas fa-chart-line"></i> ${fund.name}</h3>
                <span class="category-badge">${categoryLabels[fund.category]}</span>
            </div>
            <div class="fund-card-body">
                <div class="fund-stats">
                    <div class="stat-item">
                        <label>Risk</label>
                        <div class="stat-value">${riskLabels[fund.risk]}</div>
                    </div>
                    <div class="stat-item">
                        <label>AUM</label>
                        <div class="stat-value">₹${(fund.aum / 1000).toFixed(1)}K Cr</div>
                    </div>
                    <div class="stat-item">
                        <label>NAV</label>
                        <div class="stat-value">₹${fund.nav.toFixed(2)}</div>
                    </div>
                    <div class="stat-item">
                        <label>Expense Ratio</label>
                        <div class="stat-value">${fund.expenseRatio}%</div>
                    </div>
                </div>
                
                <div class="returns-info">
                    <div class="return-item">
                        <label>1Y Return</label>
                        <div class="return-value positive">${fund.returns['1Y'].toFixed(1)}%</div>
                    </div>
                    <div class="return-item">
                        <label>3Y Return</label>
                        <div class="return-value positive">${fund.returns['3Y'].toFixed(1)}%</div>
                    </div>
                    <div class="return-item">
                        <label>5Y Return</label>
                        <div class="return-value positive">${fund.returns['5Y'].toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="rating">
                    ${'★'.repeat(Math.floor(fund.rating))}${'☆'.repeat(5 - Math.floor(fund.rating))}
                    <span>${fund.rating.toFixed(1)}</span>
                </div>
                
                <div class="tags">
                    ${fund.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="fund-card-footer">
                <button class="btn-outline view-details" data-id="${fund.id}">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn-secondary invest-now" data-id="${fund.id}">
                    <i class="fas fa-rupee-sign"></i> Invest
                </button>
            </div>
        `;

        // Add event listeners to buttons
        card.querySelector('.view-details').addEventListener('click', () => showFundDetails(fund));
        card.querySelector('.invest-now').addEventListener('click', () => startInvestment(fund));

        return card;
    }

    // Filter funds based on criteria
    function filterFunds() {
        const searchTerm = fundSearch.value.toLowerCase();
        const category = categoryFilter.value;
        const risk = riskFilter.value;
        const sort = sortFilter.value;

        filteredFunds = currentFunds.filter(fund => {
            const matchesSearch = fund.name.toLowerCase().includes(searchTerm) ||
                                fund.fundHouse.toLowerCase().includes(searchTerm) ||
                                fund.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesCategory = !category || fund.category === category;
            const matchesRisk = !risk || fund.risk === risk;

            return matchesSearch && matchesCategory && matchesRisk;
        });

        // Sort funds
        sortFunds(sort);
        renderFunds();
    }

    // Sort funds based on criteria
    function sortFunds(criteria) {
        switch(criteria) {
            case 'returns_high':
                filteredFunds.sort((a, b) => b.returns['3Y'] - a.returns['3Y']);
                break;
            case 'returns_low':
                filteredFunds.sort((a, b) => a.returns['3Y'] - b.returns['3Y']);
                break;
            case 'rating':
                filteredFunds.sort((a, b) => b.rating - a.rating);
                break;
            case 'aum':
                filteredFunds.sort((a, b) => b.aum - a.aum);
                break;
            case 'expense':
                filteredFunds.sort((a, b) => a.expenseRatio - b.expenseRatio);
                break;
        }
    }

    // Show fund details in modal
    function showFundDetails(fund) {
        // Update modal content
        document.getElementById('modalFundName').textContent = fund.name;
        document.getElementById('modalCategory').textContent = fund.category.charAt(0).toUpperCase() + fund.category.slice(1);
        document.getElementById('modalRisk').textContent = fund.risk === 'high' ? 'High Risk' : fund.risk === 'moderate' ? 'Moderate Risk' : 'Low Risk';
        document.getElementById('modalReturns1Y').textContent = `${fund.returns['1Y'].toFixed(1)}%`;
        document.getElementById('modalReturns3Y').textContent = `${fund.returns['3Y'].toFixed(1)}%`;
        document.getElementById('modalExpense').textContent = `${fund.expenseRatio}%`;
        document.getElementById('modalMinSIP').textContent = `₹${fund.minSIP}`;
        document.getElementById('modalFundHouse').textContent = fund.fundHouse;
        document.getElementById('modalAUM').textContent = `₹${(fund.aum / 1000).toFixed(1)}K Cr`;
        document.getElementById('modalNAV').textContent = `₹${fund.nav.toFixed(2)}`;
        document.getElementById('modalLaunchDate').textContent = new Date(fund.launchDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        document.getElementById('modalDescription').textContent = fund.description;

        // Setup chart
        setupPerformanceChart(fund);

        // Show modal
        fundModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Setup performance chart
    function setupPerformanceChart(fund) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.performanceChart) {
            window.performanceChart.destroy();
        }

        const years = ['2019', '2020', '2021', '2022', '2023'];
        const returns = [
            fund.returns['5Y'] - 2,
            fund.returns['5Y'] - 1,
            fund.returns['5Y'],
            fund.returns['3Y'] - 1,
            fund.returns['1Y']
        ];

        window.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Annual Returns (%)',
                    data: returns,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
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
                        title: {
                            display: true,
                            text: 'Returns (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
    }

    // Start investment process
    function startInvestment(fund) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            alert('Please login to invest');
            return;
        }

        // Show investment modal or redirect
        const confirmInvest = confirm(`Invest in ${fund.name}?\nMinimum SIP: ₹${fund.minSIP}`);
        if (confirmInvest) {
            // In a real app, this would redirect to investment page or show modal
            alert('Redirecting to investment page...');
            // window.location.href = `invest.html?fund=${fund.id}`;
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search
        fundSearch.addEventListener('input', filterFunds);

        // Filters
        categoryFilter.addEventListener('change', filterFunds);
        riskFilter.addEventListener('change', filterFunds);
        sortFilter.addEventListener('change', filterFunds);
        applyFilters.addEventListener('click', filterFunds);

        // Category chips
        categoryChips.forEach(chip => {
            chip.addEventListener('click', function() {
                // Remove active class from all chips
                categoryChips.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked chip
                this.classList.add('active');
                
                // Update category filter
                const category = this.dataset.category;
                currentCategory = category;
                
                if (category === 'all') {
                    categoryFilter.value = '';
                } else {
                    categoryFilter.value = category;
                }
                
                // Apply filters
                filterFunds();
            });
        });

        // Modal
        closeModal.addEventListener('click', () => {
            fundModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        fundModal.addEventListener('click', (e) => {
            if (e.target === fundModal) {
                fundModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Watchlist button
        document.getElementById('addToWatchlist').addEventListener('click', function() {
            const fundName = document.getElementById('modalFundName').textContent;
            this.innerHTML = '<i class="fas fa-star"></i> Added to Watchlist';
            this.disabled = true;
            
            // Store in localStorage
            const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
            if (!watchlist.includes(fundName)) {
                watchlist.push(fundName);
                localStorage.setItem('watchlist', JSON.stringify(watchlist));
            }
            
            setTimeout(() => {
                this.innerHTML = '<i class="far fa-star"></i> Watchlist';
                this.disabled = false;
            }, 2000);
        });

        // Invest Now button in modal
        document.getElementById('investNow').addEventListener('click', () => {
            const fundName = document.getElementById('modalFundName').textContent;
            startInvestment({ name: fundName, minSIP: 500 });
        });

        // Start SIP button in modal
        document.getElementById('startSIP').addEventListener('click', () => {
            const fundName = document.getElementById('modalFundName').textContent;
            alert(`Starting SIP for ${fundName}. Redirecting to SIP planner...`);
            // window.location.href = `sip.html?fund=${encodeURIComponent(fundName)}`;
        });

        // Logout
        document.querySelectorAll('.logout-btn').forEach(btn => {
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