/**
 * Analytics and Insights for Infinity Mutual Funds
 */

class AnalyticsManager {
    constructor() {
        this.analyticsData = {};
        this.timeRange = '1y'; // 1 year default
        this.init();
    }
    
    async init() {
        await this.loadAnalyticsData();
        this.setupEventListeners();
        this.renderCharts();
        this.renderInsights();
    }
    
    async loadAnalyticsData() {
        try {
            const response = await InfinityMF.makeRequest(`analytics?range=${this.timeRange}`);
            if (response?.data) {
                this.analyticsData = response.data;
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            InfinityMF.showNotification('Failed to load analytics data', 'error');
        }
    }
    
    renderCharts() {
        // Portfolio Growth Chart
        this.renderPortfolioGrowthChart();
        
        // Returns Distribution Chart
        this.renderReturnsDistributionChart();
        
        // Risk-Return Scatter Plot
        this.renderRiskReturnChart();
        
        // SIP Performance Chart
        this.renderSIPPerformanceChart();
    }
    
    renderPortfolioGrowthChart() {
        const ctx = document.getElementById('portfolio-growth-chart');
        if (!ctx || typeof Chart === 'undefined' || !this.analyticsData.portfolio_growth) return;
        
        const data = this.analyticsData.portfolio_growth;
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [
                    {
                        label: 'Portfolio Value',
                        data: data.values || [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Investment',
                        data: data.investment || [],
                        borderColor: '#2ecc71',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${InfinityMF.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return InfinityMF.formatCurrency(value).replace('₹', '₹');
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderReturnsDistributionChart() {
        const ctx = document.getElementById('returns-distribution-chart');
        if (!ctx || typeof Chart === 'undefined' || !this.analyticsData.returns_distribution) return;
        
        const data = this.analyticsData.returns_distribution;
        
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.ranges || [],
                datasets: [{
                    label: 'Number of Funds',
                    data: data.counts || [],
                    backgroundColor: this.generateGradientColors(data.counts.length, '#3498db', '#2ecc71'),
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Returns: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `Funds: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Funds'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Returns Range (%)'
                        }
                    }
                }
            }
        });
    }
    
    renderRiskReturnChart() {
        const ctx = document.getElementById('risk-return-chart');
        if (!ctx || typeof Chart === 'undefined' || !this.analyticsData.risk_return) return;
        
        const data = this.analyticsData.risk_return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Funds',
                    data: data.points || [],
                    backgroundColor: this.generatePointColors(data.points || []),
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return [
                                    `Fund: ${point.fund_name}`,
                                    `Return: ${point.return.toFixed(2)}%`,
                                    `Risk: ${point.risk.toFixed(2)}`,
                                    `Category: ${point.category}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Risk (Standard Deviation)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Returns (%)'
                        }
                    }
                }
            }
        });
    }
    
    renderSIPPerformanceChart() {
        const ctx = document.getElementById('sip-performance-chart');
        if (!ctx || typeof Chart === 'undefined' || !this.analyticsData.sip_performance) return;
        
        const data = this.analyticsData.sip_performance;
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [
                    {
                        label: 'SIP Investment',
                        data: data.sip_values || [],
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Lumpsum Investment',
                        data: data.lumpsum_values || [],
                        borderColor: '#f1c40f',
                        backgroundColor: 'rgba(241, 196, 15, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${InfinityMF.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderInsights() {
        this.renderTopPerformers();
        this.renderRiskAnalysis();
        this.renderRecommendations();
    }
    
    renderTopPerformers() {
        const container = document.getElementById('top-performers');
        if (!container || !this.analyticsData.top_performers) return;
        
        const performers = this.analyticsData.top_performers.slice(0, 5);
        
        const html = performers.map((fund, index) => {
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            
            return `
                <div class="performer-item ${rankClass}">
                    <div class="performer-rank">${index + 1}</div>
                    <div class="performer-info">
                        <div class="performer-name">${fund.fund_name}</div>
                        <div class="performer-category">${fund.category}</div>
                    </div>
                    <div class="performer-returns ${fund.return >= 0 ? 'positive' : 'negative'}">
                        ${fund.return >= 0 ? '+' : ''}${fund.return.toFixed(2)}%
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    renderRiskAnalysis() {
        const container = document.getElementById('risk-analysis');
        if (!container || !this.analyticsData.risk_analysis) return;
        
        const analysis = this.analyticsData.risk_analysis;
        
        container.innerHTML = `
            <div class="risk-metrics">
                <div class="metric-item">
                    <div class="metric-label">Portfolio Beta</div>
                    <div class="metric-value ${analysis.beta < 1 ? 'low' : 'high'}">
                        ${analysis.beta.toFixed(2)}
                    </div>
                    <div class="metric-description">
                        ${analysis.beta < 1 ? 'Less volatile than market' : 'More volatile than market'}
                    </div>
                </div>
                
                <div class="metric-item">
                    <div class="metric-label">Sharpe Ratio</div>
                    <div class="metric-value ${analysis.sharpe > 1 ? 'good' : analysis.sharpe > 0 ? 'average' : 'poor'}">
                        ${analysis.sharpe.toFixed(2)}
                    </div>
                    <div class="metric-description">
                        Risk-adjusted returns
                    </div>
                </div>
                
                <div class="metric-item">
                    <div class="metric-label">Max Drawdown</div>
                    <div class="metric-value ${analysis.drawdown < -10 ? 'high' : 'low'}">
                        ${analysis.drawdown.toFixed(2)}%
                    </div>
                    <div class="metric-description">
                        Largest peak-to-trough decline
                    </div>
                </div>
            </div>
            
            <div class="risk-recommendation">
                <h4>Risk Assessment</h4>
                <p>${analysis.recommendation}</p>
            </div>
        `;
    }
    
    renderRecommendations() {
        const container = document.getElementById('recommendations');
        if (!container || !this.analyticsData.recommendations) return;
        
        const recommendations = this.analyticsData.recommendations;
        
        const html = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-type ${rec.type}">${rec.type.toUpperCase()}</div>
                <div class="recommendation-content">
                    <h5>${rec.title}</h5>
                    <p>${rec.description}</p>
                    ${rec.action ? `
                        <button class="recommendation-action" onclick="${rec.action}">
                            ${rec.action_text || 'Take Action'}
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    generateGradientColors(count, color1, color2) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            colors.push(this.interpolateColor(color1, color2, ratio));
        }
        return colors;
    }
    
    generatePointColors(points) {
        return points.map(point => {
            if (point.return > 15) return '#2ecc71'; // Green for high returns
            if (point.return > 0) return '#f1c40f'; // Yellow for positive returns
            return '#e74c3c'; // Red for negative returns
        });
    }
    
    interpolateColor(color1, color2, ratio) {
        const hex = (color) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        
        const c1 = hex(color1);
        const c2 = hex(color2);
        
        if (!c1 || !c2) return color1;
        
        const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
        const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
        const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    setupEventListeners() {
        // Time range selector
        const timeRangeSelect = document.getElementById('time-range-select');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', async (e) => {
                this.timeRange = e.target.value;
                await this.loadAnalyticsData();
                this.renderCharts();
                this.renderInsights();
            });
        }
        
        // Export analytics button
        const exportBtn = document.getElementById('export-analytics');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAnalytics());
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                InfinityMF.showNotification('Refreshing analytics...', 'info');
                await this.loadAnalyticsData();
                this.renderCharts();
                this.renderInsights();
                InfinityMF.showNotification('Analytics updated', 'success');
            });
        }
    }
    
    async exportAnalytics() {
        const response = await InfinityMF.makeRequest('analytics/export');
        if (response?.data) {
            const report = this.generateAnalyticsReport(response.data);
            const blob = new Blob([report], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinity-analytics-report-${new Date().toISOString().split('T')[0]}.html`;
            a.click();
        }
    }
    
    generateAnalyticsReport(data) {
        const reportDate = new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Infinity Mutual Funds - Analytics Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .section { margin-bottom: 30px; }
                    .section-title { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    .positive { color: #27ae60; }
                    .negative { color: #e74c3c; }
                    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Infinity Mutual Funds - Analytics Report</h1>
                    <p>Generated on ${reportDate}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Portfolio Performance</h2>
                    <table>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Total Investment</td>
                            <td>${InfinityMF.formatCurrency(data.total_investment)}</td>
                        </tr>
                        <tr>
                            <td>Current Value</td>
                            <td>${InfinityMF.formatCurrency(data.current_value)}</td>
                        </tr>
                        <tr>
                            <td>Total Gain/Loss</td>
                            <td class="${data.total_gain >= 0 ? 'positive' : 'negative'}">
                                ${data.total_gain >= 0 ? '+' : ''}${InfinityMF.formatCurrency(data.total_gain)}
                            </td>
                        </tr>
                        <tr>
                            <td>Return Percentage</td>
                            <td class="${data.return_percentage >= 0 ? 'positive' : 'negative'}">
                                ${data.return_percentage >= 0 ? '+' : ''}${data.return_percentage.toFixed(2)}%
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Top Performing Funds</h2>
                    <table>
                        <tr>
                            <th>Rank</th>
                            <th>Fund Name</th>
                            <th>Category</th>
                            <th>Returns</th>
                        </tr>
                        ${data.top_performers?.map((fund, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${fund.fund_name}</td>
                                <td>${fund.category}</td>
                                <td class="${fund.return >= 0 ? 'positive' : 'negative'}">
                                    ${fund.return >= 0 ? '+' : ''}${fund.return.toFixed(2)}%
                                </td>
                            </tr>
                        `).join('') || ''}
                    </table>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Risk Analysis</h2>
                    <table>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Interpretation</th>
                        </tr>
                        <tr>
                            <td>Portfolio Beta</td>
                            <td>${data.risk_analysis?.beta?.toFixed(2) || 'N/A'}</td>
                            <td>${data.risk_analysis?.beta < 1 ? 'Less volatile than market' : 'More volatile than market'}</td>
                        </tr>
                        <tr>
                            <td>Sharpe Ratio</td>
                            <td>${data.risk_analysis?.sharpe?.toFixed(2) || 'N/A'}</td>
                            <td>${this.getSharpeInterpretation(data.risk_analysis?.sharpe)}</td>
                        </tr>
                        <tr>
                            <td>Max Drawdown</td>
                            <td>${data.risk_analysis?.drawdown?.toFixed(2) || 'N/A'}%</td>
                            <td>${this.getDrawdownInterpretation(data.risk_analysis?.drawdown)}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Recommendations</h2>
                    <ul>
                        ${data.recommendations?.map(rec => `
                            <li><strong>${rec.title}:</strong> ${rec.description}</li>
                        `).join('') || '<li>No recommendations available</li>'}
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Report generated by Infinity Mutual Funds Analytics System</p>
                    <p>For more detailed analysis, visit your dashboard at infinitymutualfunds.com</p>
                </div>
            </body>
            </html>
        `;
    }
    
    getSharpeInterpretation(sharpe) {
        if (sharpe > 1) return 'Excellent risk-adjusted returns';
        if (sharpe > 0) return 'Acceptable risk-adjusted returns';
        if (sharpe === 0) return 'Returns equal to risk-free rate';
        return 'Poor risk-adjusted returns';
    }
    
    getDrawdownInterpretation(drawdown) {
        if (drawdown > -10) return 'Low risk exposure';
        if (drawdown > -20) return 'Moderate risk exposure';
        return 'High risk exposure';
    }
}

// Initialize analytics manager
let analyticsManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('portfolio-growth-chart')) {
        analyticsManager = new AnalyticsManager();
        window.analyticsManager = analyticsManager;
    }
});