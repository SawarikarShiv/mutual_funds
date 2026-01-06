/**
 * Market Research and Analysis for Infinity Mutual Funds
 */

class ResearchManager {
    constructor() {
        this.researchData = {};
        this.currentCategory = 'all';
        this.init();
    }
    
    async init() {
        await this.loadResearchData();
        this.setupEventListeners();
        this.renderMarketOverview();
        this.renderSectorAnalysis();
        this.renderFundRankings();
        this.renderResearchReports();
    }
    
    async loadResearchData() {
        try {
            const response = await InfinityMF.makeRequest('research');
            if (response?.data) {
                this.researchData = response.data;
            }
        } catch (error) {
            console.error('Error loading research data:', error);
            InfinityMF.showNotification('Failed to load research data', 'error');
        }
    }
    
    renderMarketOverview() {
        const container = document.getElementById('market-overview');
        if (!container || !this.researchData.market_overview) return;
        
        const overview = this.researchData.market_overview;
        
        container.innerHTML = `
            <div class="market-indices">
                ${overview.indices?.map(index => `
                    <div class="index-card">
                        <div class="index-name">${index.name}</div>
                        <div class="index-value">${index.value.toLocaleString('en-IN')}</div>
                        <div class="index-change ${index.change >= 0 ? 'positive' : 'negative'}">
                            ${index.change >= 0 ? '↗' : '↘'} ${Math.abs(index.change).toFixed(2)}%
                        </div>
                    </div>
                `).join('') || ''}
            </div>
            
            <div class="market-summary">
                <h4>Market Summary</h4>
                <p>${overview.summary || 'No summary available.'}</p>
                <div class="market-stats">
                    <div class="stat-item">
                        <span class="stat-label">Market Sentiment:</span>
                        <span class="stat-value sentiment-${overview.sentiment?.toLowerCase() || 'neutral'}">
                            ${overview.sentiment || 'Neutral'}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Advance/Decline:</span>
                        <span class="stat-value">${overview.advance || 0} / ${overview.decline || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Last Updated:</span>
                        <span class="stat-value">${overview.last_updated || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSectorAnalysis() {
        const container = document.getElementById('sector-analysis');
        if (!container || !this.researchData.sector_performance) return;
        
        const sectors = this.researchData.sector_performance;
        
        // Sort by performance
        sectors.sort((a, b) => b.performance - a.performance);
        
        const html = sectors.map(sector => {
            const barWidth = Math.min(Math.abs(sector.performance) * 2, 100);
            
            return `
                <div class="sector-item">
                    <div class="sector-name">${sector.name}</div>
                    <div class="sector-bar-container">
                        <div class="sector-bar ${sector.performance >= 0 ? 'positive' : 'negative'}" 
                             style="width: ${barWidth}%"></div>
                    </div>
                    <div class="sector-performance ${sector.performance >= 0 ? 'positive' : 'negative'}">
                        ${sector.performance >= 0 ? '+' : ''}${sector.performance.toFixed(2)}%
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        
        // Render sector chart if available
        this.renderSectorChart(sectors);
    }
    
    renderSectorChart(sectors) {
        const ctx = document.getElementById('sector-chart');
        if (!ctx || typeof Chart === 'undefined') return;
        
        const topSectors = sectors.slice(0, 8);
        
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: topSectors.map(s => s.name),
                datasets: [{
                    label: 'Performance (%)',
                    data: topSectors.map(s => s.performance),
                    backgroundColor: topSectors.map(s => 
                        s.performance >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)'
                    ),
                    borderColor: topSectors.map(s => 
                        s.performance >= 0 ? '#27ae60' : '#c0392b'
                    ),
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
                            label: function(context) {
                                return `Performance: ${context.raw.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Performance (%)'
                        }
                    }
                }
            }
        });
    }
    
    renderFundRankings() {
        const container = document.getElementById('fund-rankings');
        if (!container || !this.researchData.fund_rankings) return;
        
        const rankings = this.researchData.fund_rankings[this.currentCategory] || 
                       this.researchData.fund_rankings.all || [];
        
        if (rankings.length === 0) {
            container.innerHTML = '<p class="no-data">No rankings available for this category</p>';
            return;
        }
        
        const html = rankings.map((fund, index) => {
            return `
                <div class="ranking-item">
                    <div class="ranking-position">${index + 1}</div>
                    <div class="ranking-info">
                        <div class="ranking-name">${fund.scheme_name}</div>
                        <div class="ranking-meta">
                            <span class="ranking-amc">${fund.amc}</span>
                            <span class="ranking-category">${fund.category}</span>
                        </div>
                    </div>
                    <div class="ranking-performance">
                        <div class="ranking-returns ${fund.returns >= 0 ? 'positive' : 'negative'}">
                            ${fund.returns >= 0 ? '+' : ''}${fund.returns.toFixed(2)}%
                        </div>
                        <div class="ranking-risk">
                            <span class="risk-level risk-${fund.risk_level?.toLowerCase() || 'medium'}">
                                ${fund.risk_level || 'Medium'}
                            </span>
                        </div>
                    </div>
                    <div class="ranking-actions">
                        <button class="btn-action btn-compare" 
                                onclick="researchManager.addToCompare(${fund.fund_id})"
                                data-tooltip="Compare">
                            ⚖️
                        </button>
                        <button class="btn-action btn-details" 
                                onclick="researchManager.viewFundResearch(${fund.fund_id})"
                                data-tooltip="Research">
                            📊
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        InfinityMF.initializeTooltips();
    }
    
    renderResearchReports() {
        const container = document.getElementById('research-reports');
        if (!container || !this.researchData.research_reports) return;
        
        const reports = this.researchData.research_reports;
        
        if (reports.length === 0) {
            container.innerHTML = '<p class="no-data">No research reports available</p>';
            return;
        }
        
        const html = reports.map(report => {
            return `
                <div class="report-item">
                    <div class="report-header">
                        <div class="report-type ${report.type}">${report.type.toUpperCase()}</div>
                        <div class="report-date">${InfinityMF.formatDate(report.date)}</div>
                    </div>
                    <div class="report-content">
                        <h4>${report.title}</h4>
                        <p>${report.summary}</p>
                        <div class="report-key-findings">
                            <h5>Key Findings:</h5>
                            <ul>
                                ${report.key_findings?.map(finding => `<li>${finding}</li>`).join('') || ''}
                            </ul>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button onclick="researchManager.viewReport(${report.id})">Read Full Report</button>
                        <button class="secondary" onclick="researchManager.downloadReport(${report.id})">
                            Download PDF
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    setupEventListeners() {
        // Category filter for rankings
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.renderFundRankings();
            });
        }
        
        // Time period filter
        const periodFilter = document.getElementById('period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', async (e) => {
                await this.loadResearchData();
                this.renderFundRankings();
            });
        }
        
        // Search research reports
        const searchInput = document.getElementById('research-search');
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchReports(e.target.value);
            }, 300));
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-research');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                InfinityMF.showNotification('Updating research data...', 'info');
                await this.loadResearchData();
                this.renderMarketOverview();
                this.renderSectorAnalysis();
                this.renderFundRankings();
                this.renderResearchReports();
                InfinityMF.showNotification('Research data updated', 'success');
            });
        }
    }
    
    async addToCompare(fundId) {
        const compareList = JSON.parse(localStorage.getItem('compare_funds') || '[]');
        
        if (compareList.includes(fundId)) {
            InfinityMF.showNotification('Fund already in comparison list', 'info');
            return;
        }
        
        if (compareList.length >= 4) {
            InfinityMF.showNotification('Maximum 4 funds can be compared at once', 'warning');
            return;
        }
        
        compareList.push(fundId);
        localStorage.setItem('compare_funds', JSON.stringify(compareList));
        InfinityMF.showNotification('Fund added to comparison list', 'success');
    }
    
    async viewFundResearch(fundId) {
        const response = await InfinityMF.makeRequest(`research/fund/${fundId}`);
        if (response?.data) {
            this.showFundResearchModal(response.data);
        }
    }
    
    showFundResearchModal(research) {
        const modal = document.createElement('div');
        modal.className = 'modal wide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${research.fund_name} - Research Report</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="research-tabs">
                        <div class="tab-buttons">
                            <button class="tab-button active" data-tab="overview">Overview</button>
                            <button class="tab-button" data-tab="analysis">Analysis</button>
                            <button class="tab-button" data-tab="recommendation">Recommendation</button>
                        </div>
                        
                        <div class="tab-content" id="overview-tab">
                            <div class="research-overview">
                                <div class="overview-section">
                                    <h4>Fund Details</h4>
                                    <div class="details-grid">
                                        <div class="detail-item">
                                            <label>AMC:</label>
                                            <span>${research.amc}</span>
                                        </div>
                                        <div class="detail-item">
                                            <label>Category:</label>
                                            <span>${research.category}</span>
                                        </div>
                                        <div class="detail-item">
                                            <label>Rating:</label>
                                            <span>${research.rating ? '★'.repeat(research.rating) : 'N/A'}</span>
                                        </div>
                                        <div class="detail-item">
                                            <label>AUM:</label>
                                            <span>${InfinityMF.formatCurrency(research.aum)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="overview-section">
                                    <h4>Performance Metrics</h4>
                                    <div class="metrics-grid">
                                        <div class="metric-item">
                                            <label>1 Year Return</label>
                                            <span class="${research.returns_1y >= 0 ? 'positive' : 'negative'}">
                                                ${research.returns_1y?.toFixed(2) || 'N/A'}%
                                            </span>
                                        </div>
                                        <div class="metric-item">
                                            <label>3 Year Return</label>
                                            <span class="${research.returns_3y >= 0 ? 'positive' : 'negative'}">
                                                ${research.returns_3y?.toFixed(2) || 'N/A'}%
                                            </span>
                                        </div>
                                        <div class="metric-item">
                                            <label>Sharpe Ratio</label>
                                            <span>${research.sharpe_ratio?.toFixed(2) || 'N/A'}</span>
                                        </div>
                                        <div class="metric-item">
                                            <label>Standard Deviation</label>
                                            <span>${research.std_deviation?.toFixed(2) || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-content" id="analysis-tab" style="display: none;">
                            <div class="analysis-content">
                                <h4>Fundamental Analysis</h4>
                                <p>${research.analysis?.fundamental || 'No fundamental analysis available.'}</p>
                                
                                <h4>Technical Analysis</h4>
                                <p>${research.analysis?.technical || 'No technical analysis available.'}</p>
                                
                                ${research.analysis?.charts ? `
                                    <h4>Performance Charts</h4>
                                    <div class="analysis-charts">
                                        <canvas id="analysis-chart"></canvas>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="tab-content" id="recommendation-tab" style="display: none;">
                            <div class="recommendation-content">
                                <div class="recommendation-header">
                                    <div class="recommendation-rating ${research.recommendation?.rating?.toLowerCase() || 'hold'}">
                                        ${research.recommendation?.rating || 'HOLD'}
                                    </div>
                                    <div class="recommendation-date">
                                        Updated: ${InfinityMF.formatDate(research.recommendation?.date)}
                                    </div>
                                </div>
                                
                                <div class="recommendation-body">
                                    <h4>Analyst Opinion</h4>
                                    <p>${research.recommendation?.opinion || 'No analyst opinion available.'}</p>
                                    
                                    <h4>Target Horizon</h4>
                                    <p>${research.recommendation?.horizon || 'N/A'}</p>
                                    
                                    <h4>Key Risks</h4>
                                    <ul>
                                        ${research.recommendation?.risks?.map(risk => `<li>${risk}</li>`).join('') || '<li>No specific risks identified</li>'}
                                    </ul>
                                </div>
                                
                                <div class="recommendation-actions">
                                    <button onclick="researchManager.investInFund(${research.fund_id})">
                                        Invest Now
                                    </button>
                                    <button class="secondary" onclick="researchManager.addToWatchlist(${research.fund_id})">
                                        Add to Watchlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
        this.setupTabSwitchers();
        
        // Load analysis chart if available
        if (research.analysis?.charts) {
            setTimeout(() => this.loadAnalysisChart(research.analysis.charts), 100);
        }
    }
    
    setupTabSwitchers() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show selected tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}-tab`).style.display = 'block';
            });
        });
    }
    
    loadAnalysisChart(chartData) {
        const ctx = document.getElementById('analysis-chart');
        if (!ctx || typeof Chart === 'undefined') return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.labels || [],
                datasets: [
                    {
                        label: 'Fund NAV',
                        data: chartData.nav || [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Benchmark',
                        data: chartData.benchmark || [],
                        borderColor: '#95a5a6',
                        borderDash: [5, 5],
                        fill: false,
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
                                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    async investInFund(fundId) {
        sessionStorage.setItem('selected_fund', JSON.stringify({ id: fundId }));
        window.location.href = 'invest.html';
    }
    
    async addToWatchlist(fundId) {
        const response = await InfinityMF.makeRequest('watchlist/add', 'POST', { fund_id: fundId });
        if (response?.success) {
            InfinityMF.showNotification('Added to watchlist', 'success');
        }
    }
    
    async viewReport(reportId) {
        const response = await InfinityMF.makeRequest(`research/reports/${reportId}`);
        if (response?.data) {
            this.showFullReportModal(response.data);
        }
    }
    
    showFullReportModal(report) {
        const modal = document.createElement('div');
        modal.className = 'modal extra-wide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${report.title}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="report-meta">
                        <span class="report-type ${report.type}">${report.type.toUpperCase()}</span>
                        <span class="report-date">Published: ${InfinityMF.formatDate(report.date)}</span>
                        <span class="report-author">By: ${report.author || 'Research Team'}</span>
                    </div>
                    
                    <div class="report-executive-summary">
                        <h4>Executive Summary</h4>
                        <p>${report.executive_summary || report.summary}</p>
                    </div>
                    
                    <div class="report-content-full">
                        ${report.content || '<p>Full report content not available.</p>'}
                    </div>
                    
                    ${report.conclusion ? `
                        <div class="report-conclusion">
                            <h4>Conclusion</h4>
                            <p>${report.conclusion}</p>
                        </div>
                    ` : ''}
                    
                    ${report.disclaimer ? `
                        <div class="report-disclaimer">
                            <h4>Disclaimer</h4>
                            <p>${report.disclaimer}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button onclick="researchManager.downloadReport(${report.id})">Download PDF</button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    async downloadReport(reportId) {
        const response = await InfinityMF.makeRequest(`research/reports/${reportId}/download`);
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
        } else {
            InfinityMF.showNotification('Download link not available', 'error');
        }
    }
    
    searchReports(query) {
        const reports = document.querySelectorAll('.report-item');
        const searchTerm = query.toLowerCase();
        
        reports.forEach(report => {
            const text = report.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            report.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    setupModalStyles() {
        if (!document.getElementById('research-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'research-modal-styles';
            style.textContent = `
                .extra-wide-modal {
                    max-width: 1000px !important;
                }
                .research-tabs {
                    margin-top: 20px;
                }
                .tab-buttons {
                    display: flex;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 20px;
                }
                .tab-button {
                    padding: 10px 20px;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    cursor: pointer;
                    font-weight: 500;
                }
                .tab-button.active {
                    border-bottom-color: #3498db;
                    color: #3498db;
                }
                .research-overview {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .overview-section {
                    padding: 15px;
                    border: 1px solid #eee;
                    border-radius: 5px;
                }
                .details-grid, .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 10px;
                }
                .detail-item, .metric-item {
                    display: flex;
                    flex-direction: column;
                }
                .detail-item label, .metric-item label {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }
                .recommendation-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .recommendation-rating {
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .recommendation-rating.buy {
                    background: #2ecc71;
                    color: white;
                }
                .recommendation-rating.hold {
                    background: #f1c40f;
                    color: white;
                }
                .recommendation-rating.sell {
                    background: #e74c3c;
                    color: white;
                }
                .recommendation-body {
                    margin-bottom: 20px;
                }
                .recommendation-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .report-meta {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    color: #666;
                    font-size: 14px;
                }
                .report-executive-summary {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .report-content-full {
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .report-content-full h4 {
                    margin-top: 20px;
                    color: #2c3e50;
                }
                .report-content-full p {
                    margin-bottom: 15px;
                }
                .report-disclaimer {
                    padding: 15px;
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    font-size: 12px;
                    color: #856404;
                    margin-top: 20px;
                }
                .analysis-charts {
                    height: 300px;
                    margin-top: 20px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize research manager
let researchManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('market-overview')) {
        researchManager = new ResearchManager();
        window.researchManager = researchManager;
    }
});