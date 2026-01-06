/**
 * Infinity Mutual Funds - Charts JavaScript
 */

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.initializeCharts();
        this.bindChartEvents();
    }

    initializeCharts() {
        // Portfolio Growth Chart
        this.initializeGrowthChart();
        
        // Asset Allocation Chart
        this.initializeAllocationChart();
        
        // Returns Chart (if exists)
        this.initializeReturnsChart();
        
        // Performance Chart (if exists)
        this.initializePerformanceChart();
    }

    initializeGrowthChart() {
        const ctx = document.getElementById('growthChart');
        if (!ctx) return;

        this.charts.growth = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Portfolio Value (in ₹Lakhs)',
                    data: [18.5, 19.2, 20.1, 21.5, 22.3, 23.8, 24.1, 25.5, 26.2, 24.8, 25.3, 24.8],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: this.getChartOptions({
                yTitle: 'Portfolio Value (₹Lakhs)',
                yCallback: (value) => `₹${value}L`
            })
        });
    }

    initializeAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        this.charts.allocation = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Equity', 'Debt', 'Hybrid', 'Money Market'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#667eea',  // Equity - Blue
                        '#10b981',  // Debt - Green
                        '#f59e0b',  // Hybrid - Yellow
                        '#8b5cf6'   // Money Market - Purple
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#cbd5e1',
                            padding: 20,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${percentage}% (₹${(value/100 * 36893.74).toLocaleString('en-IN', {minimumFractionDigits: 0})})`;
                            }
                        }
                    }
                }
            }
        });
    }

    initializeReturnsChart() {
        const ctx = document.getElementById('returnsChart');
        if (!ctx) return;

        this.charts.returns = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['SBI Bluechip', 'HDFC Balanced', 'ICICI Bond', 'Axis Small Cap', 'Nippon Liquid'],
                datasets: [{
                    label: 'Returns (%)',
                    data: [15.93, 8.64, 4.80, -10.98, 0.20],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 1
                }]
            },
            options: this.getChartOptions({
                indexAxis: 'y',
                yTitle: 'Funds',
                xTitle: 'Returns (%)'
            })
        });
    }

    initializePerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Returns', 'Risk', 'Cost', 'Liquidity', 'Diversification', 'Consistency'],
                datasets: [
                    {
                        label: 'Your Portfolio',
                        data: [75, 65, 85, 90, 70, 80],
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Benchmark',
                        data: [70, 70, 80, 85, 75, 75],
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderColor: '#f59e0b',
                        borderWidth: 2,
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#cbd5e1',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#94a3b8',
                            backdropColor: 'transparent'
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#cbd5e1'
                        }
                    }
                }
            }
        });
    }

    getChartOptions(customOptions = {}) {
        const defaults = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: !!customOptions.xTitle,
                        text: customOptions.xTitle,
                        color: '#94a3b8',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        },
                        callback: customOptions.yCallback || (value => value)
                    },
                    title: {
                        display: !!customOptions.yTitle,
                        text: customOptions.yTitle,
                        color: '#94a3b8',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 750,
                easing: 'easeOutQuart'
            }
        };

        if (customOptions.indexAxis === 'y') {
            defaults.indexAxis = 'y';
            defaults.scales.x.ticks.callback = customOptions.xCallback;
            defaults.scales.y.ticks.callback = customOptions.yCallback;
        }

        return defaults;
    }

    bindChartEvents() {
        // Growth chart period buttons
        document.querySelectorAll('.chart-period[data-period]').forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.getAttribute('data-period');
                this.updateGrowthChart(period);
                
                // Update active state
                btn.parentElement.querySelectorAll('.chart-period').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });

        // Allocation chart view buttons
        document.querySelectorAll('.chart-period[data-view]').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.updateAllocationChart(view);
                
                // Update active state
                btn.parentElement.querySelectorAll('.chart-period').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });

        // Export chart buttons
        document.querySelectorAll('.chart-export').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartId = btn.closest('.chart-card').querySelector('canvas').id;
                this.exportChart(chartId);
            });
        });
    }

    updateGrowthChart(period) {
        if (!this.charts.growth) return;

        const dataSets = {
            '1m': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [24.0, 24.2, 24.5, 24.8]
            },
            '3m': {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                data: [23.0, 24.0, 24.8]
            },
            '6m': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 24.8]
            },
            '1y': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [18.5, 19.2, 20.1, 21.5, 22.3, 23.8, 24.1, 25.5, 26.2, 24.8, 25.3, 24.8]
            }
        };

        const selectedData = dataSets[period] || dataSets['1y'];

        this.charts.growth.data.labels = selectedData.labels;
        this.charts.growth.data.datasets[0].data = selectedData.data;
        this.charts.growth.update();
    }

    updateAllocationChart(view) {
        if (!this.charts.allocation) return;

        if (view === 'category') {
            this.charts.allocation.data = {
                labels: ['Equity', 'Debt', 'Hybrid', 'Money Market'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#8b5cf6']
                }]
            };
        } else if (view === 'risk') {
            this.charts.allocation.data = {
                labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                }]
            };
        } else if (view === 'fund') {
            this.charts.allocation.data = {
                labels: ['SBI Bluechip', 'HDFC Balanced', 'ICICI Bond', 'Axis Small Cap', 'Nippon Liquid'],
                datasets: [{
                    data: [7925.69, 7946.40, 6550.00, 4471.65, 10020.00],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ]
                }]
            };
        }

        this.charts.allocation.update();
    }

    exportChart(chartId) {
        const chart = this.charts[chartId.replace('Chart', '').toLowerCase()];
        if (!chart) return;

        const link = document.createElement('a');
        link.download = `infinity-chart-${chartId}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = chart.toBase64Image();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Chart exported successfully', 'success');
    }

    updateChartData(chartId, newData) {
        const chart = this.charts[chartId];
        if (!chart) return;

        chart.data = newData;
        chart.update();
    }

    animateChart(chartId) {
        const chart = this.charts[chartId];
        if (!chart) return;

        chart.data.datasets.forEach((dataset, i) => {
            const originalData = [...dataset.data];
            dataset.data = dataset.data.map(() => 0);

            chart.update();

            // Animate each data point
            dataset.data.forEach((value, index) => {
                setTimeout(() => {
                    dataset.data[index] = originalData[index];
                    chart.update();
                }, index * 100);
            });
        });
    }

    showNotification(message, type = 'info') {
        // This would show a toast notification
        console.log(`${type.toUpperCase()}: ${message}`);
        // In a real app, you would use your notification system
        alert(`${type}: ${message}`);
    }

    // Helper function to format currency
    formatCurrency(value, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    // Helper function to format percentage
    formatPercentage(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }).format(value / 100);
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardCharts = new DashboardCharts();
});