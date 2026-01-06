// js/funds.js - Fund Master Database Functions

let fundsData = [];
let filteredFunds = [];
let currentFundPage = 1;
const fundsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    initializeFundsPage();
});

function initializeFundsPage() {
    loadFundsData();
    setupFundsListeners();
    updateFundStats();
    initializeFundCharts();
}

function loadFundsData() {
    // Load funds from localStorage or API
    const savedFunds = localStorage.getItem('fundsData');
    
    if (savedFunds) {
        fundsData = JSON.parse(savedFunds);
    } else {
        // Load sample data
        fundsData = getSampleFundsData();
        saveFundsData();
    }
    
    filteredFunds = [...fundsData];
    renderFundsTable();
}

function getSampleFundsData() {
    return [
        {
            id: 1,
            name: "SBI Bluechip Fund - Direct Growth",
            amc: "SBI Mutual Fund",
            category: "Equity",
            subCategory: "Large Cap",
            schemeCode: "120503",
            currentNAV: 78.45,
            previousNAV: 77.85,
            navDate: "2024-01-15",
            changePercent: 0.77,
            oneYearReturn: 24.8,
            threeYearCAGR: 18.5,
            fiveYearCAGR: 15.2,
            aum: 42500,
            expenseRatio: 0.95,
            risk: "Medium",
            rating: 5,
            minInvestment: 500,
            launchDate: "2006-02-14",
            fundManager: "Sohini Andani",
            investmentObjective: "To provide investors with opportunities for long-term growth in capital",
            status: "Active",
            isDirect: true,
            isGrowth: true
        },
        // ... (Add more sample funds as needed)
    ];
}

function renderFundsTable() {
    const tbody = document.getElementById('fundsTableBody');
    if (!tbody) return;
    
    const startIndex = (currentFundPage - 1) * fundsPerPage;
    const endIndex = Math.min(startIndex + fundsPerPage, filteredFunds.length);
    const pageFunds = filteredFunds.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageFunds.forEach(fund => {
        const row = document.createElement('tr');
        const changeClass = fund.changePercent >= 0 ? 'positive' : 'negative';
        const changeIcon = fund.changePercent >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        row.innerHTML = `
            <td>
                <div class="fund-name">
                    <strong>${fund.name}</strong>
                    <small>${fund.schemeCode}</small>
                </div>
            </td>
            <td>${fund.amc}</td>
            <td>
                <span class="category-badge ${fund.category.toLowerCase()}">
                    ${fund.category}
                </span>
            </td>
            <td><strong>₹${fund.currentNAV.toFixed(2)}</strong></td>
            <td class="${changeClass}">
                <i class="fas ${changeIcon}"></i> ${Math.abs(fund.changePercent).toFixed(2)}%
            </td>
            <td>${fund.oneYearReturn.toFixed(1)}%</td>
            <td>
                <span class="risk-badge ${fund.risk.toLowerCase()}">
                    ${fund.risk}
                </span>
            </td>
            <td>
                <div class="rating">
                    ${'★'.repeat(fund.rating)}${'☆'.repeat(5 - fund.rating)}
                </div>
            </td>
            <td>₹${(fund.aum / 1000).toFixed(0)}K Cr</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewFundDetails(${fund.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editFund(${fund.id})" title="Edit Fund">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteFund(${fund.id})" title="Delete Fund">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateFundPagination();
}

function updateFundStats() {
    const totalFunds = fundsData.length;
    const equityFunds = fundsData.filter(f => f.category === 'Equity').length;
    const debtFunds = fundsData.filter(f => f.category === 'Debt').length;
    const avgReturn = fundsData.reduce((sum, fund) => sum + fund.oneYearReturn, 0) / totalFunds;
    
    document.getElementById('totalFunds').textContent = totalFunds;
    document.getElementById('equityFunds').textContent = equityFunds;
    document.getElementById('debtFunds').textContent = debtFunds;
    document.getElementById('avgReturn').textContent = avgReturn.toFixed(1) + '%';
}

// ... (Continue with more functions)