// transactions.js - Live Transaction Management

let transactions = [];
let volumeChart = null;
let typeChart = null;
let liveTransactionInterval = null;

// Initialize transactions module
document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('transactionDate').valueAsDate = new Date();
    
    // Generate reference number
    generateReferenceNumber();
    
    // Load initial data
    loadTransactions();
    loadTransactionStats();
    
    // Initialize charts
    initializeCharts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start live updates
    startLiveUpdates();
    
    // Show welcome message
    setTimeout(() => {
        showToast('Transactions module loaded! Real-time processing active.', 'success');
    }, 1000);
});

// Setup event listeners
function setupEventListeners() {
    // Transaction form submission
    document.getElementById('transactionForm').addEventListener('submit', processTransaction);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Process transaction button
    document.getElementById('processTransaction').addEventListener('click', function() {
        quickProcessTransaction();
    });
    
    // Transaction type change
    document.getElementById('transactionType').addEventListener('change', function() {
        updateFormForTransactionType(this.value);
    });
    
    // Search functionality
    document.getElementById('searchTransactions').addEventListener('input', function(e) {
        searchTransactions(e.target.value);
    });
}

// Load transactions data
function loadTransactions() {
    // Mock transactions data
    transactions = [
        {
            id: 'TXN20240115001',
            date: '2024-01-15 10:30:45',
            investor: 'Rajesh Kumar',
            investorId: 'INV001',
            type: 'purchase',
            fund: 'HDFC Top 100 Fund',
            amount: 50000,
            units: 81.25,
            nav: 615.20,
            status: 'completed',
            paymentMode: 'online',
            reference: 'REF20240115001'
        },
        {
            id: 'TXN20240114002',
            date: '2024-01-14 14:20:15',
            investor: 'Priya Sharma',
            investorId: 'INV002',
            type: 'sip',
            fund: 'ICICI Pru Bluechip Fund',
            amount: 10000,
            units: 17.82,
            nav: 560.75,
            status: 'completed',
            paymentMode: 'auto-debit',
            reference: 'REF20240114002'
        },
        {
            id: 'TXN20240113003',
            date: '2024-01-13 11:45:30',
            investor: 'Amit Patel',
            investorId: 'INV003',
            type: 'redemption',
            fund: 'SBI Small Cap Fund',
            amount: -25000,
            units: -207.90,
            nav: 120.25,
            status: 'processing',
            paymentMode: 'online',
            reference: 'REF20240113003'
        },
        {
            id: 'TXN20240112004',
            date: '2024-01-12 09:15:20',
            investor: 'Sunita Reddy',
            investorId: 'INV004',
            type: 'switch',
            fund: 'Axis Long Term Equity',
            amount: 0,
            units: 0,
            nav: 410.25,
            status: 'pending',
            paymentMode: 'cheque',
            reference: 'REF20240112004'
        },
        {
            id: 'TXN20240111005',
            date: '2024-01-11 16:30:10',
            investor: 'Rajesh Kumar',
            investorId: 'INV001',
            type: 'purchase',
            fund: 'Mirae Asset Emerging',
            amount: 75000,
            units: 214.16,
            nav: 350.20,
            status: 'completed',
            paymentMode: 'upi',
            reference: 'REF20240111005'
        }
    ];
    
    updateTransactionsTable();
    updateLiveTransactionFeed();
}

// Load transaction statistics
function loadTransactionStats() {
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => 
        t.date.startsWith(today)
    ).length;
    
    const monthVolume = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    
    // Update DOM
    document.getElementById('todayTransactions').textContent = todayTransactions;
    document.getElementById('monthVolume').textContent = formatCurrency(monthVolume);
    document.getElementById('pendingApprovals').textContent = pendingCount;
    document.getElementById('successRate').textContent = '98.5%';
    
    // Update today's volume
    const todayVolume = transactions
        .filter(t => t.date.startsWith(today))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    document.getElementById('todayVolume').textContent = formatCurrency(todayVolume);
}

// Update transactions table
function updateTransactionsTable() {
    const tableBody = document.getElementById('transactionsTableBody');
    tableBody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Type badge
        let typeBadge = '';
        switch(transaction.type) {
            case 'purchase':
                typeBadge = '<span class="type-badge type-purchase">Purchase</span>';
                break;
            case 'redemption':
                typeBadge = '<span class="type-badge type-redemption">Redemption</span>';
                break;
            case 'sip':
                typeBadge = '<span class="type-badge type-sip">SIP</span>';
                break;
            case 'switch':
                typeBadge = '<span class="type-badge type-switch">Switch</span>';
                break;
        }
        
        // Status badge
        let statusBadge = '';
        switch(transaction.status) {
            case 'completed':
                statusBadge = '<span class="status-badge status-completed">Completed</span>';
                break;
            case 'processing':
                statusBadge = '<span class="status-badge status-processing">Processing</span>';
                break;
            case 'pending':
                statusBadge = '<span class="status-badge status-pending">Pending</span>';
                break;
        }
        
        // Format date
        const dateObj = new Date(transaction.date.replace(' ', 'T'));
        const formattedDate = dateObj.toLocaleDateString('en-IN') + ' ' + 
                             dateObj.toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'});
        
        row.innerHTML = `
            <td><strong>${transaction.id}</strong></td>
            <td>${formattedDate}</td>
            <td>${transaction.investor}<br><small>${transaction.investorId}</small></td>
            <td>${typeBadge}</td>
            <td>${transaction.fund}</td>
            <td class="${transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'}">
                ${transaction.amount >= 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
            </td>
            <td>${Math.abs(transaction.units).toFixed(3)}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-outline" style="padding: 5px 10px; font-size: 12px;" 
                        onclick="viewTransaction('${transaction.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update counts
    document.getElementById('showingCount').textContent = transactions.length;
    document.getElementById('totalCount').textContent = transactions.length + 245;
}

// Update live transaction feed
function updateLiveTransactionFeed() {
    const feed = document.getElementById('liveTransactionsFeed');
    feed.innerHTML = '';
    
    // Show last 5 transactions
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    recentTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'sip-schedule';
        
        const timeAgo = getTimeAgo(transaction.date);
        const typeIcon = transaction.type === 'purchase' ? 'fa-download' : 
                        transaction.type === 'redemption' ? 'fa-upload' : 
                        transaction.type === 'sip' ? 'fa-calendar-alt' : 'fa-exchange-alt';
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <i class="fas ${typeIcon}" style="color: #4361ee;"></i>
                    <strong>${transaction.investor}</strong>
                    <span style="color: rgba(255,255,255,0.7);">• ${transaction.fund}</span>
                </div>
                <div style="color: ${transaction.amount >= 0 ? '#4cc9f0' : '#f72585'}; font-weight: 600;">
                    ${transaction.amount >= 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                <div style="font-size: 12px; color: rgba(255,255,255,0.5);">
                    ${transaction.id} • ${timeAgo}
                </div>
                <div style="font-size: 12px; color: ${transaction.status === 'completed' ? '#4cc9f0' : '#ffc107'};">
                    ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
            </div>
        `;
        
        feed.appendChild(item);
    });
}

// Process transaction
function processTransaction(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        type: document.getElementById('transactionType').value,
        investorId: document.getElementById('investorAccount').value,
        fund: document.getElementById('fundScheme').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        units: document.getElementById('transactionUnits').value,
        date: document.getElementById('transactionDate').value,
        paymentMode: document.getElementById('paymentMode').value,
        folioNumber: document.getElementById('folioNumber').value,
        reference: document.getElementById('referenceNumber').value
    };
    
    // Validate form
    if (!validateTransaction(formData)) {
        return;
    }
    
    // Show processing animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate transaction ID
        const txnId = generateTransactionId();
        
        // Get NAV and calculate units if not provided
        const nav = getFundNAV(formData.fund);
        const units = formData.units || (formData.amount / nav).toFixed(3);
        
        // Create new transaction
        const newTransaction = {
            id: txnId,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            investor: getInvestorName(formData.investorId),
            investorId: formData.investorId,
            type: formData.type,
            fund: getFundName(formData.fund),
            amount: formData.amount,
            units: parseFloat(units),
            nav: nav,
            status: 'processing',
            paymentMode: formData.paymentMode,
            reference: formData.reference
        };
        
        // Add to transactions array
        transactions.unshift(newTransaction);
        
        // Update UI
        updateTransactionsTable();
        updateTransactionStats();
        updateLiveTransactionFeed();
        updateCharts();
        
        // Show success message
        showToast(`Transaction ${txnId} processed successfully!`, 'success');
        
        // Update last processed time
        document.getElementById('lastProcessedTime').textContent = 'Just now';
        
        // Reset form
        clearForm();
        generateReferenceNumber();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Simulate status update after 2 seconds
        setTimeout(() => {
            updateTransactionStatus(txnId, 'completed');
        }, 2000);
        
    }, 1500);
}

// Quick process transaction
function quickProcessTransaction() {
    const quickData = {
        type: 'purchase',
        investorId: 'INV001',
        fund: 'FUND001',
        amount: 25000,
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'online',
        reference: generateReferenceNumber()
    };
    
    // Show quick process modal
    showQuickProcessModal(quickData);
}

// Generate transaction ID
function generateTransactionId() {
    const now = new Date();
    const dateStr = now.getFullYear() + 
                   String(now.getMonth() + 1).padStart(2, '0') + 
                   String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `TXN${dateStr}${randomNum}`;
}

// Generate reference number
function generateReferenceNumber() {
    const ref = 'REF' + Date.now() + Math.floor(Math.random() * 1000);
    const refInput = document.getElementById('referenceNumber');
    if (refInput) {
        refInput.value = ref;
    }
    return ref;
}

// Validate transaction
function validateTransaction(data) {
    if (!data.type) {
        showToast('Please select transaction type', 'error');
        return false;
    }
    
    if (!data.investorId) {
        showToast('Please select investor account', 'error');
        return false;
    }
    
    if (!data.fund) {
        showToast('Please select fund scheme', 'error');
        return false;
    }
    
    if (!data.amount || data.amount < 1000) {
        showToast('Minimum transaction amount is ₹1,000', 'error');
        return false;
    }
    
    return true;
}

// Get fund NAV
function getFundNAV(fundId) {
    const navs = {
        'FUND001': 615.20,
        'FUND002': 560.75,
        'FUND003': 120.25,
        'FUND004': 410.25,
        'FUND005': 350.20
    };
    return navs[fundId] || 100;
}

// Get fund name
function getFundName(fundId) {
    const funds = {
        'FUND001': 'HDFC Top 100 Fund',
        'FUND002': 'ICICI Pru Bluechip Fund',
        'FUND003': 'SBI Small Cap Fund',
        'FUND004': 'Axis Long Term Equity',
        'FUND005': 'Mirae Asset Emerging'
    };
    return funds[fundId] || 'Unknown Fund';
}

// Get investor name
function getInvestorName(investorId) {
    const investors = {
        'INV001': 'Rajesh Kumar',
        'INV002': 'Priya Sharma',
        'INV003': 'Amit Patel',
        'INV004': 'Sunita Reddy'
    };
    return investors[investorId] || 'Unknown Investor';
}

// Calculate units based on amount and NAV
function calculateUnits() {
    const amount = document.getElementById('transactionAmount').value;
    const fundId = document.getElementById('fundScheme').value;
    
    if (!amount || !fundId) {
        showToast('Please enter amount and select fund first', 'error');
        return;
    }
    
    const nav = getFundNAV(fundId);
    const units = (amount / nav).toFixed(3);
    
    document.getElementById('transactionUnits').value = units;
    
    showToast(`Calculated: ${units} units at NAV ₹${nav}`, 'success');
}

// Clear form
function clearForm() {
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').valueAsDate = new Date();
    generateReferenceNumber();
}

// Update form based on transaction type
function updateFormForTransactionType(type) {
    const amountField = document.getElementById('transactionAmount');
    const unitsField = document.getElementById('transactionUnits');
    
    switch(type) {
        case 'redemption':
            amountField.placeholder = 'Enter redemption amount';
            unitsField.disabled = false;
            break;
        case 'switch':
            amountField.disabled = true;
            amountField.value = '';
            unitsField.disabled = false;
            break;
        case 'sip':
            amountField.placeholder = 'Monthly SIP amount';
            unitsField.disabled = true;
            unitsField.value = '';
            break;
        default:
            amountField.placeholder = 'Enter investment amount';
            amountField.disabled = false;
            unitsField.disabled = false;
    }
}

// Switch tabs
function switchTab(tab) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide tab content
    const tabs = ['new', 'history', 'sip', 'reports'];
    tabs.forEach(t => {
        const element = document.getElementById(t + 'TransactionTab') || 
                       document.getElementById(t + 'Tab');
        if (element) {
            element.style.display = t === tab ? 'block' : 'none';
        }
    });
    
    if (tab === 'history') {
        updateTransactionsTable();
    }
}

// Search transactions
function searchTransactions(query) {
    if (!query.trim()) {
        updateTransactionsTable();
        return;
    }
    
    const filtered = transactions.filter(t => 
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.investor.toLowerCase().includes(query.toLowerCase()) ||
        t.fund.toLowerCase().includes(query.toLowerCase()) ||
        t.type.toLowerCase().includes(query.toLowerCase())
    );
    
    const tableBody = document.getElementById('transactionsTableBody');
    tableBody.innerHTML = '';
    
    filtered.forEach(transaction => {
        // Similar row creation as updateTransactionsTable
        // (omitted for brevity, same logic)
    });
    
    document.getElementById('showingCount').textContent = filtered.length;
}

// Export transactions
function exportTransactions() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Transaction ID,Date,Investor,Type,Fund,Amount,Units,NAV,Status,Payment Mode,Reference\n";
    
    transactions.forEach(t => {
        const row = [
            t.id,
            t.date,
            t.investor,
            t.type,
            t.fund,
            t.amount,
            t.units,
            t.nav,
            t.status,
            t.paymentMode,
            t.reference
        ].join(',');
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Transactions exported to CSV!', 'success');
}

// View transaction details
function viewTransaction(txnId) {
    const transaction = transactions.find(t => t.id === txnId);
    if (!transaction) return;
    
    alert(`Transaction Details:\n\n` +
          `ID: ${transaction.id}\n` +
          `Date: ${transaction.date}\n` +
          `Investor: ${transaction.investor}\n` +
          `Type: ${transaction.type}\n` +
          `Fund: ${transaction.fund}\n` +
          `Amount: ₹${transaction.amount.toLocaleString()}\n` +
          `Units: ${transaction.units}\n` +
          `NAV: ₹${transaction.nav}\n` +
          `Status: ${transaction.status}\n` +
          `Payment: ${transaction.paymentMode}\n` +
          `Reference: ${transaction.reference}`);
}

// Update transaction status
function updateTransactionStatus(txnId, newStatus) {
    const transaction = transactions.find(t => t.id === txnId);
    if (transaction) {
        transaction.status = newStatus;
        updateTransactionsTable();
        updateLiveTransactionFeed();
        
        if (newStatus === 'completed') {
            showToast(`Transaction ${txnId} completed successfully!`, 'success');
        }
    }
}

// Initialize charts
function initializeCharts() {
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    const typeCtx = document.getElementById('typeChart').getContext('2d');
    
    // Volume Chart
    volumeChart = new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Transaction Volume (₹L)',
                data: [12.5, 15.2, 18.7, 22.4, 25.8, 28.3, 30.5],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
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
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'L';
                        }
                    }
                }
            }
        }
    });
    
    // Type Chart
    typeChart = new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Purchase', 'Redemption', 'SIP', 'Switch'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#4361ee',
                    '#f72585',
                    '#7209b7',
                    '#4cc9f0'
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

// Update charts
function updateCharts() {
    if (!volumeChart || !typeChart) return;
    
    // Update volume chart with new data
    const currentData = volumeChart.data.datasets[0].data;
    const lastValue = currentData[currentData.length - 1];
    const newValue = lastValue + (Math.random() * 2 - 1);
    currentData.push(Math.max(0, newValue));
    currentData.shift();
    volumeChart.update();
    
    // Update type distribution
    const typeCounts = {
        purchase: transactions.filter(t => t.type === 'purchase').length,
        redemption: transactions.filter(t => t.type === 'redemption').length,
        sip: transactions.filter(t => t.type === 'sip').length,
        switch: transactions.filter(t => t.type === 'switch').length
    };
    
    const total = Object.values(typeCounts).reduce((a, b) => a + b, 1);
    typeChart.data.datasets[0].data = [
        (typeCounts.purchase / total * 100).toFixed(1),
        (typeCounts.redemption / total * 100).toFixed(1),
        (typeCounts.sip / total * 100).toFixed(1),
        (typeCounts.switch / total * 100).toFixed(1)
    ];
    typeChart.update();
}

// Start live updates
function startLiveUpdates() {
    // Simulate new transactions every 60 seconds
    liveTransactionInterval = setInterval(() => {
        simulateLiveTransaction();
    }, 60000);
    
    // Update transaction statuses every 30 seconds
    setInterval(() => {
        updateRandomTransactionStatus();
    }, 30000);
    
    // Update charts every 20 seconds
    setInterval(() => {
        updateCharts();
    }, 20000);
}

// Simulate live transaction
function simulateLiveTransaction() {
    const investors = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Reddy'];
    const funds = ['HDFC Top 100 Fund', 'ICICI Pru Bluechip Fund', 'SBI Small Cap Fund'];
    const types = ['purchase', 'sip'];
    
    const randomInvestor = investors[Math.floor(Math.random() * investors.length)];
    const randomFund = funds[Math.floor(Math.random() * funds.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAmount = Math.floor(Math.random() * 50000) + 5000;
    
    const newTransaction = {
        id: generateTransactionId(),
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        investor: randomInvestor,
        investorId: 'INV00' + (Math.floor(Math.random() * 4) + 1),
        type: randomType,
        fund: randomFund,
        amount: randomAmount,
        units: (randomAmount / getFundNAV('FUND001')).toFixed(3),
        nav: getFundNAV('FUND001'),
        status: 'processing',
        paymentMode: 'online',
        reference: generateReferenceNumber()
    };
    
    transactions.unshift(newTransaction);
    
    // Update UI
    updateTransactionsTable();
    updateTransactionStats();
    updateLiveTransactionFeed();
    
    // Show notification
    showToast(`New ${randomType}: ${randomInvestor} invested ₹${randomAmount.toLocaleString()}`, 'success');
    
    // Auto-complete after 5 seconds
    setTimeout(() => {
        updateTransactionStatus(newTransaction.id, 'completed');
    }, 5000);
}

// Update random transaction status
function updateRandomTransactionStatus() {
    const pendingTransactions = transactions.filter(t => t.status === 'processing' || t.status === 'pending');
    
    if (pendingTransactions.length > 0) {
        const randomTxn = pendingTransactions[Math.floor(Math.random() * pendingTransactions.length)];
        updateTransactionStatus(randomTxn.id, 'completed');
    }
}

// Get time ago string
function getTimeAgo(dateString) {
    const date = new Date(dateString.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Show quick process modal
function showQuickProcessModal(data) {
    const modalHtml = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: rgba(26, 26, 46, 0.95); border-radius: 15px; padding: 30px; width: 90%; max-width: 500px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="margin-bottom: 20px;">Quick Process Transaction</h3>
                <div style="margin-bottom: 20px;">
                    <p>Process a quick investment for Rajesh Kumar?</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Amount:</span>
                            <strong>₹${data.amount.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span>Fund:</span>
                            <strong>${getFundName(data.fund)}</strong>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="confirmQuickProcess(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                        <i class="fas fa-check"></i> Confirm
                    </button>
                    <button class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// Confirm quick process (to be called from modal)
window.confirmQuickProcess = function(data) {
    // Process the quick transaction
    const txnId = generateTransactionId();
    const nav = getFundNAV(data.fund);
    const units = (data.amount / nav).toFixed(3);
    
    const newTransaction = {
        id: txnId,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        investor: 'Rajesh Kumar',
        investorId: data.investorId,
        type: data.type,
        fund: getFundName(data.fund),
        amount: data.amount,
        units: parseFloat(units),
        nav: nav,
        status: 'processing',
        paymentMode: data.paymentMode,
        reference: data.reference
    };
    
    transactions.unshift(newTransaction);
    updateTransactionsTable();
    updateTransactionStats();
    updateLiveTransactionFeed();
    
    showToast(`Quick transaction ${txnId} processed!`, 'success');
    closeModal();
    
    // Auto-complete
    setTimeout(() => {
        updateTransactionStatus(txnId, 'completed');
    }, 2000);
};

// Close modal
window.closeModal = function() {
    const modal = document.querySelector('div[style*="position: fixed; top: 0; left: 0"]');
    if (modal) modal.remove();
};

// Pagination functions
window.prevPage = function() {
    showToast('Loading previous page...', 'success');
};

window.nextPage = function() {
    showToast('Loading next page...', 'success');
};