// js/main.js
// Common functions used across all pages

// Initialize date and time
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    // Update any date/time elements
    const dateElements = document.querySelectorAll('.current-date');
    dateElements.forEach(el => {
        el.textContent = `${dateStr} • ${timeStr}`;
    });
    
    // Update page title with time
    const title = document.title;
    if (!title.includes('|')) {
        document.title = `${timeStr} | ${title}`;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'rgba(76, 201, 240, 0.9)' : 'rgba(247, 37, 133, 0.9)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format currency
function formatCurrency(amount, currency = '₹') {
    if (amount >= 10000000) {
        return `${currency}${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
        return `${currency}${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
        return `${currency}${(amount / 1000).toFixed(2)} K`;
    }
    return `${currency}${amount.toFixed(2)}`;
}

// Format percentage
function formatPercentage(value) {
    const sign = value >= 0 ? '+' : '';
    const color = value >= 0 ? 'positive' : 'negative';
    return `<span class="${color}">${sign}${value.toFixed(2)}%</span>`;
}

// Generate random stock/fund data for demo
function generateMockData(type, count = 10) {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        if (type === 'fund') {
            const funds = [
                'HDFC Top 100 Fund',
                'ICICI Pru Bluechip Fund',
                'SBI Small Cap Fund',
                'Axis Long Term Equity',
                'Mirae Asset Emerging',
                'Nippon India Small Cap',
                'UTI Nifty 50 Index Fund',
                'Aditya Birla Sun Life',
                'Kotak Standard Multicap',
                'Franklin India Prima'
            ];
            
            const amcs = [
                'HDFC Mutual Fund',
                'ICICI Prudential',
                'SBI Mutual Fund',
                'Axis Mutual Fund',
                'Mirae Asset',
                'Nippon India',
                'UTI Mutual Fund',
                'Aditya Birla',
                'Kotak Mahindra',
                'Franklin Templeton'
            ];
            
            const categories = [
                'Equity Large Cap',
                'Equity Small Cap',
                'Equity Mid Cap',
                'ELSS',
                'Debt Fund',
                'Hybrid Fund',
                'Index Fund',
                'Sectoral Fund'
            ];
            
            data.push({
                name: funds[Math.floor(Math.random() * funds.length)],
                amc: amcs[Math.floor(Math.random() * amcs.length)],
                category: categories[Math.floor(Math.random() * categories.length)],
                nav: parseFloat((Math.random() * 500 + 50).toFixed(2)),
                change: parseFloat((Math.random() * 4 - 2).toFixed(2)),
                aum: Math.floor(Math.random() * 50000) + 1000,
                return1y: parseFloat((Math.random() * 40 - 5).toFixed(2)),
                risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    return data;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update date/time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', function() {
            navContainer.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navContainer && navContainer.classList.contains('active')) {
            if (!event.target.closest('.nav-container') && 
                !event.target.closest('#mobileMenuBtn')) {
                navContainer.classList.remove('active');
            }
        }
    });
    
    // Set active navigation based on current page
    setActiveNav();
});

// Set active navigation item based on current page
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}