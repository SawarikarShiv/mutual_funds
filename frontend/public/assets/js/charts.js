// Chart initialization and management
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initializeCharts();
    }

    initializeCharts() {
        // Portfolio Allocation Chart
        this.createPortfolioAllocationChart();
        
        // Performance Chart
        this.createPerformanceChart();
        
        // Fund Performance Chart
        this.createFundPerformanceChart();
    }

    createPortfolioAllocationChart() {
        const ctx = document.getElementById('portfolioAllocationChart')?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Equity Large Cap', 'Equity Small Cap', 'Debt Funds', 'Hybrid Funds'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#4361ee',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                }
            }
        });

        this.charts.set('portfolioAllocation', chart);
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Portfolio Return',
                    data: [5, 8, 12, 15, 18, 14, 16, 20, 22, 25, 28, 30],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4361ee',
                    pointRadius: 4,
                    pointHoverRadius: 8
                }, {
                    label: 'Benchmark (NIFTY 50)',
                    data: [3, 6, 8, 10, 12, 10, 11, 14, 16, 18, 20, 22],
                    borderColor: '#4cc9f0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4cc9f0',
                    pointRadius: 4,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Return (%)',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });

        this.charts.set('performance', chart);
    }

    createFundPerformanceChart() {
        const ctx = document.getElementById('fundPerformanceChart')?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['HDFC', 'ICICI', 'SBI', 'Axis', 'Mirae'],
                datasets: [{
                    label: '1Y Return (%)',
                    data: [18.2, 16.8, 40.8, 20.5, 24.8],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.7)',
                        'rgba(76, 201, 240, 0.7)',
                        'rgba(247, 37, 133, 0.7)',
                        'rgba(114, 9, 183, 0.7)',
                        'rgba(72, 149, 239, 0.7)'
                    ],
                    borderColor: [
                        '#4361ee',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7',
                        '#4895ef'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Return (%)',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });

        this.charts.set('fundPerformance', chart);
    }

    updatePortfolioData(data) {
        const chart = this.charts.get('portfolioAllocation');
        if (chart) {
            chart.data.datasets[0].data = data;
            chart.update();
        }
    }

    updatePerformanceData(portfolioData, benchmarkData) {
        const chart = this.charts.get('performance');
        if (chart) {
            chart.data.datasets[0].data = portfolioData;
            chart.data.datasets[1].data = benchmarkData;
            chart.update();
        }
    }

    destroyChart(name) {
        const chart = this.charts.get(name);
        if (chart) {
            chart.destroy();
            this.charts.delete(name);
        }
    }

    destroyAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}

// Initialize chart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chartManager = new ChartManager();
});