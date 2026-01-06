// Charts JavaScript for Infinity Mutual Funds
class InfinityCharts {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        console.log('Infinity Charts initialized');
    }

    createPerformanceChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: data.values || [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2
                }]
            },
            options: this.getChartOptions('Performance')
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    createAllocationChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels || [],
                datasets: [{
                    data: data.values || [],
                    backgroundColor: [
                        '#667eea', // Equity
                        '#10b981', // Debt
                        '#f59e0b', // Hybrid
                        '#8b5cf6', // Others
                        '#ec4899'  // Cash
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: this.getChartOptions('Allocation')
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    createReturnsChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Returns (%)',
                    data: data.values || [],
                    backgroundColor: (context) => {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
                    },
                    borderColor: (context) => {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: this.getChartOptions('Returns')
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    createRiskChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Your Portfolio',
                    data: data.portfolio || [],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2
                }, {
                    label: 'Benchmark',
                    data: data.benchmark || [],
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    borderColor: '#94a3b8',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#94a3b8',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2
                }]
            },
            options: this.getChartOptions('Risk')
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    getChartOptions(type) {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: (context) => {
                            if (type === 'Performance') {
                                return `Value: ₹${context.raw.toLocaleString('en-IN')}`;
                            } else if (type === 'Returns') {
                                return `Returns: ${context.raw}%`;
                            }
                            return context.label + ': ' + context.raw;
                        }
                    }
                }
            }
        };

        const scaleOptions = {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    callback: function(value) {
                        if (type === 'Performance') {
                            if (value >= 10000000) return '₹' + (value/10000000).toFixed(1) + 'Cr';
                            if (value >= 100000) return '₹' + (value/100000).toFixed(1) + 'L';
                            return '₹' + (value/1000).toFixed(1) + 'K';
                        }
                        return value;
                    }
                }
            }
        };

        const doughnutOptions = {
            cutout: '65%',
            plugins: {
                ...commonOptions.plugins,
                legend: {
                    ...commonOptions.plugins.legend,
                    position: 'bottom'
                },
                tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value})`;
                        }
                    }
                }
            }
        };

        const radarOptions = {
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#cbd5e1',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    ticks: {
                        color: '#94a3b8',
                        backdropColor: 'transparent'
                    }
                }
            }
        };

        switch (type) {
            case 'Performance':
                return {
                    ...commonOptions,
                    scales: scaleOptions,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                };
            case 'Allocation':
                return {
                    ...commonOptions,
                    ...doughnutOptions,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                };
            case 'Returns':
                return {
                    ...commonOptions,
                    scales: scaleOptions,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                };
            case 'Risk':
                return {
                    ...commonOptions,
                    ...radarOptions,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                };
            default:
                return commonOptions;
        }
    }

    updateChart(canvasId, data) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        if (data.labels) {
            chart.data.labels = data.labels;
        }

        if (data.datasets) {
            chart.data.datasets = data.datasets;
        } else if (data.values) {
            chart.data.datasets[0].data = data.values;
        }

        chart.update();
    }

    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    destroyAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Utility functions for generating sample data
    generatePerformanceData(period = '1y') {
        const periods = {
            '1m': Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            '3m': Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`),
            '6m': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            '1y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'all': ['2020', '2021', '2022', '2023', '2024']
        };

        const baseValues = {
            '1m': 2400000,
            '3m': 2300000,
            '6m': 2100000,
            '1y': 1850000,
            'all': 1500000
        };

        const labels = periods[period] || periods['1y'];
        const baseValue = baseValues[period] || baseValues['1y'];

        // Generate random walk data
        let currentValue = baseValue;
        const values = labels.map((_, i) => {
            // Add some random variation
            const variation = (Math.random() - 0.5) * 0.1 * currentValue;
            currentValue += variation;
            
            // Ensure positive trend
            if (i > labels.length / 2) {
                currentValue += currentValue * 0.02;
            }
            
            return Math.round(currentValue);
        });

        return { labels, values };
    }

    generateAllocationData() {
        return {
            labels: ['Equity', 'Debt', 'Hybrid', 'Money Market', 'Others'],
            values: [45, 25, 15, 10, 5]
        };
    }

    generateReturnsData() {
        const funds = [
            'SBI Bluechip', 'HDFC Balanced', 'ICICI Corporate Bond',
            'Axis Small Cap', 'Kotak Flexicap', 'UTI Nifty Index',
            'Aditya Birla ELSS', 'Nippon Liquid'
        ];

        const returns = funds.map(() => {
            const base = (Math.random() - 0.3) * 40; // -12% to +28%
            return parseFloat(base.toFixed(2));
        });

        return { labels: funds, values: returns };
    }

    generateRiskData() {
        const metrics = ['Volatility', 'Beta', 'Alpha', 'Sharpe Ratio', 'Sortino Ratio', 'Maximum Drawdown'];
        
        const portfolioMetrics = metrics.map(() => Math.random() * 100);
        const benchmarkMetrics = metrics.map(() => 50 + (Math.random() - 0.5) * 20);

        return {
            labels: metrics,
            portfolio: portfolioMetrics,
            benchmark: benchmarkMetrics
        };
    }

    // Export chart as image
    exportChart(canvasId, filename = 'chart') {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = chart.toBase64Image();
        link.click();
    }

    // Print chart
    printChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Chart Print</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    img { max-width: 100%; height: auto; }
                    .chart-info { margin-top: 20px; color: #666; }
                </style>
            </head>
            <body>
                <h2>Infinity Funds - Portfolio Chart</h2>
                <img src="${chart.toBase64Image()}">
                <div class="chart-info">
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
                <script>
                    window.onload = () => window.print();
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Save chart configuration
    saveChartConfig(canvasId) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        const config = {
            type: chart.config.type,
            data: chart.data,
            options: chart.options
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `chart-config-${canvasId}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Load chart configuration
    loadChartConfig(canvasId, config) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Get chart statistics
    getChartStats(canvasId) {
        const chart = this.charts.get(canvasId);
        if (!chart) return null;

        const data = chart.data.datasets[0].data;
        const stats = {
            min: Math.min(...data),
            max: Math.max(...data),
            avg: data.reduce((a, b) => a + b, 0) / data.length,
            count: data.length,
            sum: data.reduce((a, b) => a + b, 0)
        };

        // Calculate standard deviation
        const variance = data.reduce((acc, val) => acc + Math.pow(val - stats.avg, 2), 0) / data.length;
        stats.stdDev = Math.sqrt(variance);

        return stats;
    }

    // Add data point to chart
    addDataPoint(canvasId, label, value) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(value);
        });

        // Remove old data if we have too many points
        const maxPoints = 50;
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach((dataset) => {
                dataset.data.shift();
            });
        }

        chart.update();
    }

    // Remove data point from chart
    removeDataPoint(canvasId, index) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        if (index >= 0 && index < chart.data.labels.length) {
            chart.data.labels.splice(index, 1);
            chart.data.datasets.forEach((dataset) => {
                dataset.data.splice(index, 1);
            });
            chart.update();
        }
    }

    // Clear all data from chart
    clearChartData(canvasId) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        chart.data.labels = [];
        chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        chart.update();
    }

    // Change chart type
    changeChartType(canvasId, newType) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;

        // Store current data
        const data = {
            labels: [...chart.data.labels],
            datasets: chart.data.datasets.map(dataset => ({
                label: dataset.label,
                data: [...dataset.data],
                backgroundColor: dataset.backgroundColor,
                borderColor: dataset.borderColor
            }))
        };

        // Destroy old chart
        this.destroyChart(canvasId);

        // Create new chart with same data
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const newChart = new Chart(ctx, {
            type: newType,
            data: data,
            options: this.getChartOptions(newType.charAt(0).toUpperCase() + newType.slice(1))
        });

        this.charts.set(canvasId, newChart);
        return newChart;
    }

    // Resize all charts
    resizeAllCharts() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }

    // Set chart theme
    setChartTheme(theme = 'dark') {
        const isDark = theme === 'dark';
        
        const textColor = isDark ? '#cbd5e1' : '#1e293b';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        this.charts.forEach(chart => {
            // Update legend
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }

            // Update scales
            if (chart.options.scales) {
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.grid) {
                        scale.grid.color = gridColor;
                    }
                    if (scale.ticks) {
                        scale.ticks.color = textColor;
                    }
                });
            }

            // Update radar chart
            if (chart.options.scales?.r) {
                if (chart.options.scales.r.grid) {
                    chart.options.scales.r.grid.color = gridColor;
                }
                if (chart.options.scales.r.angleLines) {
                    chart.options.scales.r.angleLines.color = gridColor;
                }
                if (chart.options.scales.r.pointLabels) {
                    chart.options.scales.r.pointLabels.color = textColor;
                }
            }

            chart.update();
        });
    }
}

// Export for global use
window.InfinityCharts = InfinityCharts;

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.infinityCharts = new InfinityCharts();
    
    // Auto-initialize charts with data attributes
    document.querySelectorAll('[data-chart]').forEach(element => {
        const canvasId = element.id;
        const chartType = element.getAttribute('data-chart');
        const dataSource = element.getAttribute('data-source');
        
        if (chartType && canvasId) {
            let data;
            
            switch (dataSource) {
                case 'performance':
                    data = infinityCharts.generatePerformanceData();
                    break;
                case 'allocation':
                    data = infinityCharts.generateAllocationData();
                    break;
                case 'returns':
                    data = infinityCharts.generateReturnsData();
                    break;
                case 'risk':
                    data = infinityCharts.generateRiskData();
                    break;
                default:
                    data = { labels: [], values: [] };
            }
            
            switch (chartType) {
                case 'performance':
                    infinityCharts.createPerformanceChart(canvasId, data);
                    break;
                case 'allocation':
                    infinityCharts.createAllocationChart(canvasId, data);
                    break;
                case 'returns':
                    infinityCharts.createReturnsChart(canvasId, data);
                    break;
                case 'risk':
                    infinityCharts.createRiskChart(canvasId, data);
                    break;
            }
        }
    });
});