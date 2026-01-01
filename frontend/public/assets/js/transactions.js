// Transactions Manager
class TransactionsManager {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            type: 'all',
            dateRange: 'month',
            sort: 'date-desc',
            search: ''
        };
        this.init();
    }

    async init() {
        await this.loadTransactions();
        this.setupEventListeners();
        this.applyFilters();
        this.renderTransactions();
    }

    async loadTransactions() {
        // In a real app, this would be an API call
        // Sample transaction data
        this.transactions = [
            {
                id: 1,
                fundName: 'SBI Bluechip Fund',
                folioNo: 'SBI/123456/789',
                type: 'sip',
                amount: 10000,
                units: 45.12,
                nav: 52.10,
                date: '2024-12-29',
                status: 'completed',
                amc: 'SBI Mutual Fund',
                category: 'Equity'
            },
            {
                id: 2,
                fundName: 'HDFC Balanced Fund',
                folioNo: 'HDFC/789012/345',
                type: 'purchase',
                amount: 50000,
                units: 1396.86,
                nav: 35.80,
                date: '2024-12-28',
                status: 'completed',
                amc: 'HDFC Mutual Fund',
                category: 'Hybrid'
            },
            {
                id: 3,
                fundName: 'ICICI Technology Fund',
                folioNo: 'ICICI/456789/123',
                type: 'sip',
                amount: 5000,
                units: 155.56,
                nav: 32.15,
                date: '2024-12-27',
                status: 'completed',
                amc: 'ICICI Prudential',
                category: 'Sectoral'
            },
            {
                id: 4,
                fundName: 'Axis Small Cap Fund',
                folioNo: 'AXIS/234567/890',
                type: 'redemption',
                amount: 25000,
                units: 312.50,
                nav: 80.00,
                date: '2024-12-26',
                status: 'completed',
                amc: 'Axis Mutual Fund',
                category: 'Equity'
            },
            {
                id: 5,
                fundName: 'Kotak Emerging Equity Fund',
                folioNo: 'KOTAK/345678/901',
                type: 'sip',
                amount: 8000,
                units: 142.86,
                nav: 56.00,
                date: '2024-12-25',
                status: 'pending',
                amc: 'Kotak Mutual Fund',
                category: 'Equity'
            },
            {
                id: 6,
                fundName: 'Nippon India Large Cap Fund',
                folioNo: 'NIPPON/456789/012',
                type: 'switch',
                amount: 30000,
                units: 375.00,
                nav: 80.00,
                date: '2024-12-24',
                status: 'completed',
                amc: 'Nippon India Mutual Fund',
                category: 'Equity'
            },
            {
                id: 7,
                fundName: 'Aditya Birla Sun Life Tax Relief 96',
                folioNo: 'ABSL/567890/123',
                type: 'purchase',
                amount: 15000,
                units: 60.00,
                nav: 250.00,
                date: '2024-12-23',
                status: 'failed',
                amc: 'Aditya Birla Sun Life',
                category: 'ELSS'
            },
            {
                id: 8,
                fundName: 'UTI Nifty 50 Index Fund',
                folioNo: 'UTI/678901/234',
                type: 'sip',
                amount: 7000,
                units: 35.00,
                nav: 200.00,
                date: '2024-12-22',
                status: 'completed',
                amc: 'UTI Mutual Fund',
                category: 'Index'
            }
        ];
    }

    setupEventListeners() {
        // Filter events
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            if (e.target.value === 'custom') {
                document.getElementById('customDateRange').style.display = 'block';
            } else {
                document.getElementById('customDateRange').style.display = 'none';
                this.applyFilters();
            }
        });

        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
        });

        document.getElementById('searchTransactions').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        // Custom date range
        document.getElementById('applyDateRange').addEventListener('click', () => {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            if (startDate && endDate) {
                this.applyFilters();
            }
        });

        document.getElementById('cancelDateRange').addEventListener('click', () => {
            document.getElementById('dateFilter').value = 'month';
            document.getElementById('customDateRange').style.display = 'none';
            this.filters.dateRange = 'month';
            this.applyFilters();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTransactions();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTransactions();
            }
        });

        // Modal actions
        document.getElementById('addTransaction').addEventListener('click', () => {
            this.openAddTransactionModal();
        });

        document.getElementById('addFirstTransaction').addEventListener('click', () => {
            this.openAddTransactionModal();
        });

        document.getElementById('saveTransaction').addEventListener('click', () => {
            this.saveNewTransaction();
        });

        document.getElementById('cancelTransaction').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('printStatement').addEventListener('click', () => {
            this.printStatement();
        });

        // Close modal on outside click
        document.getElementById('addTransactionModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('addTransactionModal')) {
                this.closeModal();
            }
        });
    }

    applyFilters() {
        let filtered = [...this.transactions];

        // Filter by type
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(t => t.type === this.filters.type);
        }

        // Filter by date range
        const now = new Date();
        let startDate = new Date();

        switch (this.filters.dateRange) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'custom':
                const customStart = document.getElementById('startDate').value;
                const customEnd = document.getElementById('endDate').value;
                if (customStart && customEnd) {
                    startDate = new Date(customStart);
                    const endDate = new Date(customEnd);
                    filtered = filtered.filter(t => {
                        const transDate = new Date(t.date);
                        return transDate >= startDate && transDate <= endDate;
                    });
                }
                break;
        }

        if (this.filters.dateRange !== 'custom' && this.filters.dateRange !== 'all') {
            filtered = filtered.filter(t => new Date(t.date) >= startDate);
        }

        // Filter by search
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(t => 
                t.fundName.toLowerCase().includes(searchTerm) ||
                t.folioNo.toLowerCase().includes(searchTerm) ||
                t.amc.toLowerCase().includes(searchTerm)
            );
        }

        // Sort transactions
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            switch (this.filters.sort) {
                case 'date-desc':
                    return dateB - dateA;
                case 'date-asc':
                    return dateA - dateB;
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                default:
                    return dateB - dateA;
            }
        });

        this.filteredTransactions = filtered;
        this.currentPage = 1;
        this.renderTransactions();
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        const emptyState = document.getElementById('emptyState');
        const transactionCount = document.getElementById('transactionCount');

        if (!container) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredTransactions.slice(startIndex, endIndex);

        // Update count
        if (transactionCount) {
            transactionCount.textContent = `${this.filteredTransactions.length} transactions found`;
        }

        // Show/hide empty state
        if (emptyState) {
            if (this.filteredTransactions.length === 0) {
                emptyState.style.display = 'block';
                container.innerHTML = '';
            } else {
                emptyState.style.display = 'none';
            }
        }

        if (this.filteredTransactions.length === 0) {
            return;
        }

        // Render transactions
        container.innerHTML = '';

        pageData.forEach(transaction => {
            const transactionElem = document.createElement('div');
            transactionElem.className = `transaction-item ${transaction.type}`;

            const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            const formattedAmount = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0
            }).format(transaction.amount);

            const formattedUnits = transaction.units.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            transactionElem.innerHTML = `
                <div class="transaction-main">
                    <div class="transaction-header">
                        <h3>${transaction.fundName}</h3>
                        <span class="transaction-type ${transaction.type}">
                            ${transaction.type.toUpperCase()}
                        </span>
                    </div>
                    <div class="transaction-meta">
                        <span class="meta-item">
                            <i class="far fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-hashtag"></i>
                            ${transaction.folioNo}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-building"></i>
                            ${transaction.amc}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-layer-group"></i>
                            ${formattedUnits} units
                        </span>
                    </div>
                </div>
                <div class="transaction-details">
                    <div class="transaction-amount">
                        <p class="amount">${formattedAmount}</p>
                        <span class="transaction-status status ${transaction.status}">
                            ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                    </div>
                    <div class="transaction-actions">
                        <button class="action-icon" onclick="window.transactionsManager.viewTransaction(${transaction.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon" onclick="window.transactionsManager.editTransaction(${transaction.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon" onclick="window.transactionsManager.deleteTransaction(${transaction.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(transactionElem);
        });

        // Update pagination
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        const currentPageElem = document.getElementById('currentPage');
        const totalPagesElem = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (currentPageElem) currentPageElem.textContent = this.currentPage;
        if (totalPagesElem) totalPagesElem.textContent = totalPages;
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    openAddTransactionModal() {
        const modal = document.getElementById('addTransactionModal');
        modal.classList.add('show');
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }

    closeModal() {
        const modal = document.getElementById('addTransactionModal');
        modal.classList.remove('show');
        document.getElementById('transactionForm').reset();
    }

    saveNewTransaction() {
        const form = document.getElementById('transactionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const type = document.getElementById('transactionType').value;
        const fundName = document.getElementById('fundName').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('transactionDate').value;
        const remarks = document.getElementById('remarks').value;

        // Generate a new transaction
        const newTransaction = {
            id: Date.now(),
            fundName: this.getFundDisplayName(fundName),
            folioNo: this.generateFolioNumber(),
            type: type,
            amount: amount,
            units: amount / 50, // Simplified calculation
            nav: 50.00, // Default NAV
            date: date,
            status: 'completed',
            amc: this.getAMCFromFund(fundName),
            category: 'Equity',
            remarks: remarks
        };

        // Add to transactions array
        this.transactions.unshift(newTransaction);
        
        // Re-apply filters and render
        this.applyFilters();
        
        // Close modal
        this.closeModal();
        
        // Show success toast
        this.showToast('Transaction added successfully!');
    }

    getFundDisplayName(fundKey) {
        const fundMap = {
            'sbi-bluechip': 'SBI Bluechip Fund',
            'hdfc-balanced': 'HDFC Balanced Fund',
            'icici-tech': 'ICICI Technology Fund'
        };
        return fundMap[fundKey] || 'Unknown Fund';
    }

    getAMCFromFund(fundKey) {
        const amcMap = {
            'sbi-bluechip': 'SBI Mutual Fund',
            'hdfc-balanced': 'HDFC Mutual Fund',
            'icici-tech': 'ICICI Prudential'
        };
        return amcMap[fundKey] || 'Unknown AMC';
    }

    generateFolioNumber() {
        const prefix = ['SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK', 'UTI'];
        const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
        const numbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `${randomPrefix}/${numbers}/001`;
    }

    viewTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            alert(`Viewing transaction details for:\n\nFund: ${transaction.fundName}\nAmount: ₹${transaction.amount}\nDate: ${transaction.date}\nStatus: ${transaction.status}`);
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            alert(`Edit functionality for transaction ${id} would open here.\n\nFund: ${transaction.fundName}\nAmount: ₹${transaction.amount}`);
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.applyFilters();
            this.showToast('Transaction deleted successfully!');
        }
    }

    exportToCSV() {
        const headers = ['Date', 'Fund Name', 'Type', 'Amount', 'Units', 'NAV', 'Status', 'Folio No', 'AMC'];
        const csvContent = [
            headers.join(','),
            ...this.filteredTransactions.map(t => [
                t.date,
                `"${t.fundName}"`,
                t.type,
                t.amount,
                t.units,
                t.nav,
                t.status,
                t.folioNo,
                `"${t.amc}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Transactions exported to CSV!');
    }

    printStatement() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Transaction Statement</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .total { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Transaction Statement</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <table>
                        <tr>
                            <th>Date</th>
                            <th>Fund Name</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                        ${this.filteredTransactions.map(t => `
                            <tr>
                                <td>${new Date(t.date).toLocaleDateString()}</td>
                                <td>${t.fundName}</td>
                                <td>${t.type}</td>
                                <td>₹${t.amount.toLocaleString()}</td>
                                <td>${t.status}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <p class="total">Total Transactions: ${this.filteredTransactions.length}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    showToast(message) {
        const toast = document.getElementById('successToast');
        if (toast) {
            toast.querySelector('span').textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.transactionsManager = new TransactionsManager();
});