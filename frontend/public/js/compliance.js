/**
 * Compliance and Regulatory Management for Infinity Mutual Funds
 */

class ComplianceManager {
    constructor() {
        this.complianceData = {};
        this.regulations = [];
        this.alerts = [];
        this.init();
    }
    
    async init() {
        await this.loadComplianceData();
        this.setupEventListeners();
        this.renderRegulations();
        this.renderAlerts();
        this.renderComplianceStatus();
    }
    
    async loadComplianceData() {
        try {
            const [regulations, alerts, status] = await Promise.all([
                InfinityMF.makeRequest('compliance/regulations'),
                InfinityMF.makeRequest('compliance/alerts'),
                InfinityMF.makeRequest('compliance/status')
            ]);
            
            this.regulations = regulations?.data || [];
            this.alerts = alerts?.data || [];
            this.complianceData.status = status?.data || {};
            
        } catch (error) {
            console.error('Error loading compliance data:', error);
            InfinityMF.showNotification('Failed to load compliance data', 'error');
        }
    }
    
    renderRegulations() {
        const container = document.getElementById('regulations-container');
        if (!container) return;
        
        if (this.regulations.length === 0) {
            container.innerHTML = '<p class="no-data">No regulations found</p>';
            return;
        }
        
        const html = this.regulations.map(regulation => {
            const daysLeft = this.calculateDaysLeft(regulation.due_date);
            const isOverdue = daysLeft < 0;
            const isDueSoon = daysLeft >= 0 && daysLeft <= 7;
            
            return `
                <div class="regulation-item ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}">
                    <div class="regulation-header">
                        <div class="regulation-code">${regulation.code}</div>
                        <div class="regulation-status status-${regulation.status}">
                            ${regulation.status}
                        </div>
                    </div>
                    
                    <div class="regulation-info">
                        <h5>${regulation.title}</h5>
                        <p>${regulation.description}</p>
                        
                        <div class="regulation-meta">
                            <div class="meta-item">
                                <span class="meta-label">Applicable To:</span>
                                <span class="meta-value">${regulation.applicable_to}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Frequency:</span>
                                <span class="meta-value">${regulation.frequency}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Due Date:</span>
                                <span class="meta-value ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}">
                                    ${InfinityMF.formatDate(regulation.due_date)}
                                    ${isOverdue ? ` (Overdue by ${Math.abs(daysLeft)} days)` : 
                                      isDueSoon ? ` (Due in ${daysLeft} days)` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="regulation-actions">
                        <button class="btn-view" onclick="complianceManager.viewRegulation('${regulation.id}')">
                            👁️ View Details
                        </button>
                        
                        ${regulation.status === 'pending' ? `
                            <button class="btn-complete" onclick="complianceManager.markComplete('${regulation.id}')">
                                ✅ Mark Complete
                            </button>
                        ` : ''}
                        
                        <button class="btn-download" onclick="complianceManager.downloadTemplate('${regulation.id}')">
                            ⬇️ Template
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    renderAlerts() {
        const container = document.getElementById('alerts-container');
        const summaryContainer = document.getElementById('alerts-summary');
        
        if (!container) return;
        
        // Filter active alerts
        const activeAlerts = this.alerts.filter(alert => alert.status === 'active');
        const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
        const warningAlerts = activeAlerts.filter(alert => alert.severity === 'warning');
        
        // Update summary
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="alert-stat">
                    <div class="stat-value ${criticalAlerts.length > 0 ? 'critical' : ''}">
                        ${criticalAlerts.length}
                    </div>
                    <div class="stat-label">Critical Alerts</div>
                </div>
                <div class="alert-stat">
                    <div class="stat-value ${warningAlerts.length > 0 ? 'warning' : ''}">
                        ${warningAlerts.length}
                    </div>
                    <div class="stat-label">Warnings</div>
                </div>
                <div class="alert-stat">
                    <div class="stat-value">${activeAlerts.length}</div>
                    <div class="stat-label">Total Active</div>
                </div>
            `;
        }
        
        if (activeAlerts.length === 0) {
            container.innerHTML = '<p class="no-data">No active alerts</p>';
            return;
        }
        
        // Sort by severity and date
        activeAlerts.sort((a, b) => {
            const severityOrder = { 'critical': 0, 'warning': 1, 'info': 2 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        const html = activeAlerts.map(alert => {
            return `
                <div class="alert-item alert-${alert.severity}">
                    <div class="alert-icon">
                        ${this.getAlertIcon(alert.severity)}
                    </div>
                    
                    <div class="alert-content">
                        <div class="alert-header">
                            <h5>${alert.title}</h5>
                            <div class="alert-time">${this.formatTimeAgo(alert.created_at)}</div>
                        </div>
                        
                        <p>${alert.description}</p>
                        
                        <div class="alert-meta">
                            <span class="meta-source">Source: ${alert.source}</span>
                            ${alert.regulation_code ? `
                                <span class="meta-regulation">Regulation: ${alert.regulation_code}</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="alert-actions">
                        <button class="btn-acknowledge" onclick="complianceManager.acknowledgeAlert('${alert.id}')">
                            Acknowledge
                        </button>
                        ${alert.action_url ? `
                            <button class="btn-action" onclick="window.open('${alert.action_url}', '_blank')">
                                Take Action
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    renderComplianceStatus() {
        const container = document.getElementById('compliance-status');
        if (!container || !this.complianceData.status) return;
        
        const status = this.complianceData.status;
        const complianceRate = status.compliance_rate || 0;
        
        container.innerHTML = `
            <div class="status-overview">
                <div class="compliance-meter">
                    <div class="meter-circle" data-percentage="${complianceRate}">
                        <div class="meter-value">${complianceRate}%</div>
                        <div class="meter-label">Compliance Rate</div>
                    </div>
                </div>
                
                <div class="status-breakdown">
                    <div class="breakdown-item">
                        <div class="breakdown-label">Complete</div>
                        <div class="breakdown-value">${status.completed || 0}</div>
                        <div class="breakdown-bar">
                            <div class="bar-fill" style="width: ${(status.completed / (status.total || 1)) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-label">Pending</div>
                        <div class="breakdown-value">${status.pending || 0}</div>
                        <div class="breakdown-bar">
                            <div class="bar-fill pending" style="width: ${(status.pending / (status.total || 1)) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-label">Overdue</div>
                        <div class="breakdown-value">${status.overdue || 0}</div>
                        <div class="breakdown-bar">
                            <div class="bar-fill overdue" style="width: ${(status.overdue / (status.total || 1)) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-label">Total</div>
                        <div class="breakdown-value">${status.total || 0}</div>
                        <div class="breakdown-bar">
                            <div class="bar-fill total" style="width: 100%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="status-details">
                <h4>Recent Updates</h4>
                <ul class="updates-list">
                    ${status.recent_updates?.map(update => `
                        <li>
                            <span class="update-time">${this.formatTimeAgo(update.timestamp)}</span>
                            <span class="update-text">${update.text}</span>
                        </li>
                    `).join('') || '<li>No recent updates</li>'}
                </ul>
            </div>
        `;
        
        // Initialize compliance meter animation
        setTimeout(() => this.initializeComplianceMeter(), 100);
    }
    
    initializeComplianceMeter() {
        const meter = document.querySelector('.meter-circle');
        if (!meter) return;
        
        const percentage = parseInt(meter.dataset.percentage);
        const circumference = 2 * Math.PI * 45; // Radius 45
        
        meter.style.setProperty('--circumference', circumference);
        meter.style.setProperty('--percentage', percentage);
        
        // Add CSS for animation
        if (!document.getElementById('compliance-meter-styles')) {
            const style = document.createElement('style');
            style.id = 'compliance-meter-styles';
            style.textContent = `
                .meter-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: conic-gradient(
                        #2ecc71 0% ${percentage}%,
                        #f1c40f ${percentage}% 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .meter-circle::before {
                    content: '';
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: white;
                    border-radius: 50%;
                }
                .meter-value, .meter-label {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                }
                .meter-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .meter-label {
                    font-size: 12px;
                    color: #666;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    getAlertIcon(severity) {
        const icons = {
            'critical': '🚨',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[severity] || '📢';
    }
    
    calculateDaysLeft(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    formatTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    setupEventListeners() {
        // Filter regulations
        const filterSelect = document.getElementById('regulation-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterRegulations(e.target.value);
            });
        }
        
        // Search alerts
        const searchInput = document.getElementById('alert-search');
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchAlerts(e.target.value);
            }, 300));
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-compliance');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                InfinityMF.showNotification('Refreshing compliance data...', 'info');
                await this.loadComplianceData();
                this.renderRegulations();
                this.renderAlerts();
                this.renderComplianceStatus();
                InfinityMF.showNotification('Compliance data updated', 'success');
            });
        }
        
        // Acknowledge all alerts
        const ackAllBtn = document.getElementById('acknowledge-all');
        if (ackAllBtn) {
            ackAllBtn.addEventListener('click', () => this.acknowledgeAllAlerts());
        }
        
        // Export compliance report
        const exportBtn = document.getElementById('export-compliance');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportComplianceReport());
        }
    }
    
    filterRegulations(status) {
        const regulations = document.querySelectorAll('.regulation-item');
        
        regulations.forEach(regulation => {
            const regulationStatus = regulation.querySelector('.regulation-status')?.textContent.toLowerCase();
            const isVisible = status === 'all' || regulationStatus === status.toLowerCase();
            regulation.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    searchAlerts(query) {
        const alerts = document.querySelectorAll('.alert-item');
        const searchTerm = query.toLowerCase();
        
        alerts.forEach(alert => {
            const text = alert.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            alert.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    async viewRegulation(regulationId) {
        const response = await InfinityMF.makeRequest(`compliance/regulations/${regulationId}`);
        if (response?.data) {
            this.showRegulationModal(response.data);
        }
    }
    
    showRegulationModal(regulation) {
        const daysLeft = this.calculateDaysLeft(regulation.due_date);
        const isOverdue = daysLeft < 0;
        
        const modal = document.createElement('div');
        modal.className = 'modal wide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${regulation.code}: ${regulation.title}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="regulation-details">
                        <div class="detail-section">
                            <h4>Regulation Details</h4>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <label>Regulatory Body</label>
                                    <span>${regulation.regulatory_body}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Applicable To</label>
                                    <span>${regulation.applicable_to}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Frequency</label>
                                    <span>${regulation.frequency}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Effective Date</label>
                                    <span>${InfinityMF.formatDate(regulation.effective_date)}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Due Date</label>
                                    <span class="${isOverdue ? 'overdue' : daysLeft <= 7 ? 'due-soon' : ''}">
                                        ${InfinityMF.formatDate(regulation.due_date)}
                                        ${isOverdue ? ` (Overdue by ${Math.abs(daysLeft)} days)` : 
                                          daysLeft <= 7 ? ` (Due in ${daysLeft} days)` : ''}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Status</label>
                                    <span class="status-badge status-${regulation.status}">
                                        ${regulation.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Description</h4>
                            <p>${regulation.description}</p>
                        </div>
                        
                        ${regulation.requirements ? `
                            <div class="detail-section">
                                <h4>Key Requirements</h4>
                                <ul class="requirements-list">
                                    ${regulation.requirements.map(req => `<li>${req}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${regulation.penalties ? `
                            <div class="detail-section">
                                <h4>Penalties for Non-Compliance</h4>
                                <ul class="penalties-list">
                                    ${regulation.penalties.map(penalty => `<li>${penalty}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <h4>Submission Details</h4>
                            <div class="submission-info">
                                <div class="submission-item">
                                    <label>Last Submitted</label>
                                    <span>${regulation.last_submitted ? InfinityMF.formatDate(regulation.last_submitted) : 'Never'}</span>
                                </div>
                                <div class="submission-item">
                                    <label>Next Submission</label>
                                    <span>${InfinityMF.formatDate(regulation.due_date)}</span>
                                </div>
                                <div class="submission-item">
                                    <label>Submission Method</label>
                                    <span>${regulation.submission_method || 'Online Portal'}</span>
                                </div>
                                ${regulation.submission_url ? `
                                    <div class="submission-item">
                                        <label>Submission URL</label>
                                        <a href="${regulation.submission_url}" target="_blank">
                                            ${regulation.submission_url}
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    ${regulation.status === 'pending' ? `
                        <button onclick="complianceManager.markComplete('${regulation.id}'); this.closest('.modal').remove()">
                            ✅ Mark as Complete
                        </button>
                    ` : ''}
                    <button onclick="complianceManager.downloadTemplate('${regulation.id}')">
                        ⬇️ Download Template
                    </button>
                    <button onclick="complianceManager.submitCompliance('${regulation.id}')">
                        📤 Submit Compliance
                    </button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    async markComplete(regulationId) {
        if (!confirm('Mark this regulation as complete?')) return;
        
        const response = await InfinityMF.makeRequest(
            `compliance/regulations/${regulationId}/complete`, 
            'POST'
        );
        
        if (response?.success) {
            InfinityMF.showNotification('Regulation marked as complete', 'success');
            await this.loadComplianceData();
            this.renderRegulations();
            this.renderComplianceStatus();
        }
    }
    
    async downloadTemplate(regulationId) {
        const response = await InfinityMF.makeRequest(`compliance/templates/${regulationId}`);
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
        } else {
            InfinityMF.showNotification('Template not available', 'error');
        }
    }
    
    async submitCompliance(regulationId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Submit Compliance</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="compliance-submission-form">
                        <input type="hidden" name="regulation_id" value="${regulationId}">
                        
                        <div class="form-group">
                            <label>Submission Date *</label>
                            <input type="date" name="submission_date" required 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div class="form-group">
                            <label>Upload Document *</label>
                            <input type="file" name="document" accept=".pdf,.doc,.docx,.xlsx" required>
                            <small>Accepted formats: PDF, DOC, DOCX, XLSX (Max 10MB)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Remarks</label>
                            <textarea name="remarks" rows="3" placeholder="Any additional comments..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Notify Team Members</label>
                            <div class="checkbox-group">
                                <input type="checkbox" name="notify_team" id="notify-team" checked>
                                <label for="notify-team">Send notification to team</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="complianceManager.processSubmission()">Submit</button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    async processSubmission() {
        const form = document.getElementById('compliance-submission-form');
        if (!form) return;
        
        const formData = new FormData(form);
        
        InfinityMF.showNotification('Submitting compliance...', 'info');
        
        try {
            const response = await fetch(`${InfinityMF.API_BASE_URL}/compliance/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                InfinityMF.showNotification('Compliance submitted successfully', 'success');
                document.querySelector('.modal').remove();
                await this.loadComplianceData();
                this.renderRegulations();
                this.renderComplianceStatus();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            InfinityMF.showNotification(error.message, 'error');
        }
    }
    
    async acknowledgeAlert(alertId) {
        const response = await InfinityMF.makeRequest(
            `compliance/alerts/${alertId}/acknowledge`, 
            'POST'
        );
        
        if (response?.success) {
            InfinityMF.showNotification('Alert acknowledged', 'success');
            await this.loadComplianceData();
            this.renderAlerts();
        }
    }
    
    async acknowledgeAllAlerts() {
        if (!confirm('Acknowledge all active alerts?')) return;
        
        const response = await InfinityMF.makeRequest('compliance/alerts/acknowledge-all', 'POST');
        
        if (response?.success) {
            InfinityMF.showNotification('All alerts acknowledged', 'success');
            await this.loadComplianceData();
            this.renderAlerts();
        }
    }
    
    async exportComplianceReport() {
        const response = await InfinityMF.makeRequest('compliance/export');
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
        } else {
            InfinityMF.showNotification('Report generation failed', 'error');
        }
    }
    
    setupModalStyles() {
        if (!document.getElementById('compliance-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'compliance-modal-styles';
            style.textContent = `
                .regulation-details {
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .detail-section {
                    margin-bottom: 25px;
                    padding-bottom: 25px;
                    border-bottom: 1px solid #eee;
                }
                .detail-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .detail-item {
                    display: flex;
                    flex-direction: column;
                }
                .detail-item label {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }
                .requirements-list, .penalties-list {
                    padding-left: 20px;
                    margin: 10px 0;
                }
                .requirements-list li, .penalties-list li {
                    margin-bottom: 8px;
                    line-height: 1.5;
                }
                .submission-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                .submission-item {
                    display: flex;
                    flex-direction: column;
                }
                .submission-item label {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .status-pending {
                    background: #fff3cd;
                    color: #856404;
                }
                .status-complete {
                    background: #d4edda;
                    color: #155724;
                }
                .status-overdue {
                    background: #f8d7da;
                    color: #721c24;
                }
                .overdue {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .due-soon {
                    color: #f39c12;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize compliance manager
let complianceManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('regulations-container')) {
        complianceManager = new ComplianceManager();
        window.complianceManager = complianceManager;
    }
});