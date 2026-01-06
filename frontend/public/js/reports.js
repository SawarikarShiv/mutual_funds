/**
 * Reports Generation for Infinity Mutual Funds
 */

class ReportsManager {
    constructor() {
        this.reportTemplates = {};
        this.generatedReports = [];
        this.init();
    }
    
    async init() {
        await this.loadReportTemplates();
        this.setupEventListeners();
        this.renderReportTemplates();
        this.renderGeneratedReports();
    }
    
    async loadReportTemplates() {
        try {
            const response = await InfinityMF.makeRequest('reports/templates');
            if (response?.data) {
                this.reportTemplates = response.data;
            }
        } catch (error) {
            console.error('Error loading report templates:', error);
            InfinityMF.showNotification('Failed to load report templates', 'error');
        }
    }
    
    renderReportTemplates() {
        const container = document.getElementById('report-templates');
        if (!container || !this.reportTemplates.categories) return;
        
        const categories = this.reportTemplates.categories;
        
        const html = Object.keys(categories).map(category => {
            const templates = categories[category];
            
            return `
                <div class="category-section">
                    <h4>${category}</h4>
                    <div class="templates-grid">
                        ${templates.map(template => `
                            <div class="template-card" data-template-id="${template.id}">
                                <div class="template-icon">${this.getTemplateIcon(template.type)}</div>
                                <div class="template-info">
                                    <h5>${template.name}</h5>
                                    <p>${template.description}</p>
                                    <div class="template-meta">
                                        <span class="template-frequency">${template.frequency}</span>
                                        <span class="template-pages">${template.pages} pages</span>
                                    </div>
                                </div>
                                <div class="template-actions">
                                    <button class="btn-generate" onclick="reportsManager.generateReport('${template.id}')">
                                        Generate
                                    </button>
                                    <button class="btn-preview" onclick="reportsManager.previewTemplate('${template.id}')">
                                        Preview
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    getTemplateIcon(type) {
        const icons = {
            'portfolio': '📊',
            'transaction': '💰',
            'tax': '🧾',
            'performance': '📈',
            'compliance': '⚖️',
            'custom': '📋'
        };
        return icons[type] || '📄';
    }
    
    renderGeneratedReports() {
        const container = document.getElementById('generated-reports');
        if (!container) return;
        
        // Load generated reports from localStorage
        this.generatedReports = JSON.parse(localStorage.getItem('generated_reports') || '[]');
        
        if (this.generatedReports.length === 0) {
            container.innerHTML = `
                <div class="empty-reports">
                    <div class="empty-icon">📄</div>
                    <h3>No Reports Generated</h3>
                    <p>Generate your first report using the templates above</p>
                </div>
            `;
            return;
        }
        
        // Sort by date (newest first)
        this.generatedReports.sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at));
        
        const html = this.generatedReports.map(report => {
            return `
                <div class="report-item" data-report-id="${report.id}">
                    <div class="report-header">
                        <div class="report-type">${report.type}</div>
                        <div class="report-date">${InfinityMF.formatDate(report.generated_at)}</div>
                    </div>
                    <div class="report-info">
                        <h5>${report.name}</h5>
                        <p>${report.description || 'No description'}</p>
                        <div class="report-meta">
                            <span class="report-pages">${report.pages || 'N/A'} pages</span>
                            <span class="report-size">${this.formatFileSize(report.size)}</span>
                            <span class="report-status status-${report.status}">${report.status}</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="btn-view" onclick="reportsManager.viewReport('${report.id}')">
                            👁️ View
                        </button>
                        <button class="btn-download" onclick="reportsManager.downloadReport('${report.id}')">
                            ⬇️ Download
                        </button>
                        <button class="btn-share" onclick="reportsManager.shareReport('${report.id}')">
                            🔗 Share
                        </button>
                        <button class="btn-delete" onclick="reportsManager.deleteReport('${report.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    async generateReport(templateId) {
        const template = this.findTemplateById(templateId);
        if (!template) {
            InfinityMF.showNotification('Template not found', 'error');
            return;
        }
        
        // Show configuration modal for the report
        this.showReportConfigModal(template);
    }
    
    findTemplateById(templateId) {
        const categories = this.reportTemplates.categories || {};
        
        for (const category in categories) {
            const template = categories[category].find(t => t.id === templateId);
            if (template) return template;
        }
        
        return null;
    }
    
    showReportConfigModal(template) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Generate: ${template.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="report-config-form">
                        <input type="hidden" name="template_id" value="${template.id}">
                        
                        ${template.parameters ? this.renderParameters(template.parameters) : ''}
                        
                        <div class="form-group">
                            <label>Report Format</label>
                            <select name="format" required>
                                <option value="pdf">PDF Document</option>
                                <option value="excel">Excel Spreadsheet</option>
                                <option value="html">HTML Web Page</option>
                                <option value="csv">CSV Data File</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Report Name</label>
                            <input type="text" name="report_name" 
                                   value="${template.name} - ${new Date().toLocaleDateString('en-IN')}"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label>Email Notification</label>
                            <div class="checkbox-group">
                                <input type="checkbox" name="email_notification" id="email-notification" checked>
                                <label for="email-notification">Send report to email</label>
                            </div>
                        </div>
                        
                        <div id="email-fields" style="display: block;">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value="${localStorage.getItem('user_email') || ''}">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="reportsManager.processReportGeneration()">Generate Report</button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
        
        // Toggle email fields
        const emailCheckbox = document.getElementById('email-notification');
        const emailFields = document.getElementById('email-fields');
        
        if (emailCheckbox && emailFields) {
            emailCheckbox.addEventListener('change', (e) => {
                emailFields.style.display = e.target.checked ? 'block' : 'none';
            });
        }
    }
    
    renderParameters(parameters) {
        return parameters.map(param => {
            switch(param.type) {
                case 'date_range':
                    return `
                        <div class="form-group">
                            <label>${param.label}</label>
                            <div class="date-range">
                                <input type="date" name="${param.name}_from" value="${param.default_from || ''}" required>
                                <span>to</span>
                                <input type="date" name="${param.name}_to" value="${param.default_to || ''}" required>
                            </div>
                        </div>
                    `;
                    
                case 'select':
                    return `
                        <div class="form-group">
                            <label>${param.label}</label>
                            <select name="${param.name}" ${param.required ? 'required' : ''}>
                                <option value="">Select ${param.label}</option>
                                ${param.options.map(opt => 
                                    `<option value="${opt.value}" ${opt.default ? 'selected' : ''}>${opt.label}</option>`
                                ).join('')}
                            </select>
                        </div>
                    `;
                    
                case 'checkbox':
                    return `
                        <div class="form-group">
                            <label>${param.label}</label>
                            <div class="checkbox-group">
                                ${param.options.map(opt => `
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="${param.name}[]" value="${opt.value}" 
                                               id="${param.name}_${opt.value}" ${opt.default ? 'checked' : ''}>
                                        <label for="${param.name}_${opt.value}">${opt.label}</label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    
                default:
                    return `
                        <div class="form-group">
                            <label>${param.label}</label>
                            <input type="${param.type}" name="${param.name}" 
                                   value="${param.default || ''}" 
                                   ${param.required ? 'required' : ''}>
                        </div>
                    `;
            }
        }).join('');
    }
    
    async processReportGeneration() {
        const form = document.getElementById('report-config-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const config = Object.fromEntries(formData.entries());
        
        // Process checkbox arrays
        formData.getAll('sections[]').forEach(value => {
            if (!config.sections) config.sections = [];
            config.sections.push(value);
        });
        
        InfinityMF.showNotification('Generating report...', 'info');
        
        try {
            const response = await InfinityMF.makeRequest('reports/generate', 'POST', config);
            
            if (response?.success) {
                const report = response.data;
                
                // Add to generated reports
                this.generatedReports.unshift({
                    id: report.id || Date.now().toString(),
                    name: config.report_name,
                    type: config.template_id.split('_')[0],
                    description: 'Generated report',
                    generated_at: new Date().toISOString(),
                    pages: report.pages || 1,
                    size: report.size || 1024,
                    status: 'completed',
                    download_url: report.download_url,
                    view_url: report.view_url
                });
                
                // Save to localStorage
                localStorage.setItem('generated_reports', JSON.stringify(this.generatedReports));
                
                // Close modal
                document.querySelector('.modal').remove();
                
                // Show success message
                InfinityMF.showNotification('Report generated successfully!', 'success');
                
                // Render updated list
                this.renderGeneratedReports();
                
                // Offer download
                if (report.download_url) {
                    setTimeout(() => {
                        if (confirm('Do you want to download the report now?')) {
                            window.open(report.download_url, '_blank');
                        }
                    }, 1000);
                }
            }
        } catch (error) {
            InfinityMF.showNotification('Failed to generate report', 'error');
        }
    }
    
    async previewTemplate(templateId) {
        const template = this.findTemplateById(templateId);
        if (!template) return;
        
        InfinityMF.showNotification('Loading preview...', 'info');
        
        try {
            const response = await InfinityMF.makeRequest(`reports/templates/${templateId}/preview`);
            if (response?.data) {
                this.showPreviewModal(template, response.data);
            }
        } catch (error) {
            InfinityMF.showNotification('Failed to load preview', 'error');
        }
    }
    
    showPreviewModal(template, previewData) {
        const modal = document.createElement('div');
        modal.className = 'modal wide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Preview: ${template.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="preview-container">
                        <div class="preview-header">
                            <div class="preview-meta">
                                <span class="preview-pages">Sample: ${previewData.pages || 1} pages</span>
                                <span class="preview-size">${this.formatFileSize(previewData.size || 1024)}</span>
                            </div>
                        </div>
                        
                        <div class="preview-content">
                            ${previewData.content || '<p>Preview content not available.</p>'}
                        </div>
                        
                        ${previewData.sample_data ? `
                            <div class="preview-sample">
                                <h4>Sample Data</h4>
                                <div class="sample-table-container">
                                    <table class="sample-table">
                                        <thead>
                                            <tr>
                                                ${previewData.sample_data.headers.map(header => `<th>${header}</th>`).join('')}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${previewData.sample_data.rows.map(row => `
                                                <tr>
                                                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${previewData.charts ? `
                            <div class="preview-charts">
                                <h4>Sample Charts</h4>
                                <div class="chart-container">
                                    <canvas id="preview-chart"></canvas>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="reportsManager.generateReport('${template.id}'); this.closest('.modal').remove()">
                        Generate Full Report
                    </button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
        
        // Render chart if available
        if (previewData.charts && typeof Chart !== 'undefined') {
            setTimeout(() => this.renderPreviewChart(previewData.charts), 100);
        }
    }
    
    renderPreviewChart(chartData) {
        const ctx = document.getElementById('preview-chart');
        if (!ctx) return;
        
        new Chart(ctx.getContext('2d'), {
            type: chartData.type || 'bar',
            data: {
                labels: chartData.labels || [],
                datasets: chartData.datasets || []
            },
            options: chartData.options || {
                responsive: true
            }
        });
    }
    
    viewReport(reportId) {
        const report = this.generatedReports.find(r => r.id === reportId);
        if (!report || !report.view_url) {
            InfinityMF.showNotification('Report not available for viewing', 'error');
            return;
        }
        
        window.open(report.view_url, '_blank');
    }
    
    downloadReport(reportId) {
        const report = this.generatedReports.find(r => r.id === reportId);
        if (!report || !report.download_url) {
            InfinityMF.showNotification('Report not available for download', 'error');
            return;
        }
        
        window.open(report.download_url, '_blank');
    }
    
    shareReport(reportId) {
        const report = this.generatedReports.find(r => r.id === reportId);
        if (!report) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Share Report</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="share-options">
                        <div class="share-option">
                            <label>Share via Email</label>
                            <div class="email-share">
                                <input type="email" id="share-email" placeholder="Enter email address">
                                <button onclick="reportsManager.shareViaEmail('${reportId}')">Send</button>
                            </div>
                        </div>
                        
                        <div class="share-option">
                            <label>Shareable Link</label>
                            <div class="link-share">
                                <input type="text" id="share-link" value="${window.location.origin}/reports/${reportId}" readonly>
                                <button onclick="reportsManager.copyShareLink('${reportId}')">Copy</button>
                            </div>
                        </div>
                        
                        <div class="share-option">
                            <label>Expiration</label>
                            <select id="share-expiry">
                                <option value="1">1 day</option>
                                <option value="7" selected>1 week</option>
                                <option value="30">1 month</option>
                                <option value="365">1 year</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                        
                        <div class="share-option">
                            <label>Access Permissions</label>
                            <div class="permissions">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="allow-view" checked> Allow viewing
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="allow-download"> Allow downloading
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="allow-print"> Allow printing
                                </label>
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
    }
    
    async shareViaEmail(reportId) {
        const email = document.getElementById('share-email')?.value;
        if (!email) {
            InfinityMF.showNotification('Please enter an email address', 'error');
            return;
        }
        
        const report = this.generatedReports.find(r => r.id === reportId);
        if (!report) return;
        
        const response = await InfinityMF.makeRequest('reports/share', 'POST', {
            report_id: reportId,
            email: email,
            permissions: {
                view: document.getElementById('allow-view')?.checked || false,
                download: document.getElementById('allow-download')?.checked || false,
                print: document.getElementById('allow-print')?.checked || false
            }
        });
        
        if (response?.success) {
            InfinityMF.showNotification('Report shared successfully', 'success');
            document.querySelector('.modal').remove();
        }
    }
    
    copyShareLink(reportId) {
        const input = document.getElementById('share-link');
        if (!input) return;
        
        input.select();
        input.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(input.value);
            InfinityMF.showNotification('Link copied to clipboard', 'success');
        } catch (error) {
            // Fallback for older browsers
            document.execCommand('copy');
            InfinityMF.showNotification('Link copied to clipboard', 'success');
        }
    }
    
    deleteReport(reportId) {
        if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }
        
        this.generatedReports = this.generatedReports.filter(r => r.id !== reportId);
        localStorage.setItem('generated_reports', JSON.stringify(this.generatedReports));
        
        InfinityMF.showNotification('Report deleted', 'success');
        this.renderGeneratedReports();
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    setupEventListeners() {
        // Search reports
        const searchInput = document.getElementById('report-search');
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchReports(e.target.value);
            }, 300));
        }
        
        // Filter by type
        const typeFilter = document.getElementById('report-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filterReports(e.target.value);
            });
        }
        
        // Bulk actions
        const bulkSelect = document.getElementById('bulk-select');
        if (bulkSelect) {
            bulkSelect.addEventListener('change', (e) => {
                this.handleBulkAction(e.target.value);
            });
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
    
    filterReports(type) {
        const reports = document.querySelectorAll('.report-item');
        
        reports.forEach(report => {
            const reportType = report.querySelector('.report-type')?.textContent.toLowerCase();
            const isVisible = type === 'all' || reportType === type.toLowerCase();
            report.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    handleBulkAction(action) {
        const selectedReports = Array.from(document.querySelectorAll('.report-checkbox:checked'))
            .map(cb => cb.closest('.report-item').dataset.reportId);
        
        if (selectedReports.length === 0) {
            InfinityMF.showNotification('Please select reports first', 'warning');
            return;
        }
        
        switch(action) {
            case 'download':
                selectedReports.forEach(id => this.downloadReport(id));
                break;
            case 'delete':
                if (confirm(`Delete ${selectedReports.length} selected reports?`)) {
                    selectedReports.forEach(id => this.deleteReport(id));
                }
                break;
            case 'share':
                // Implement bulk sharing
                InfinityMF.showNotification('Bulk sharing not implemented yet', 'info');
                break;
        }
        
        // Reset bulk action selector
        document.getElementById('bulk-select').value = '';
    }
    
    setupModalStyles() {
        if (!document.getElementById('reports-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'reports-modal-styles';
            style.textContent = `
                .template-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                    transition: box-shadow 0.3s;
                }
                .template-card:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .template-icon {
                    font-size: 32px;
                }
                .template-info {
                    flex: 1;
                }
                .template-info h5 {
                    margin: 0 0 10px 0;
                    color: #2c3e50;
                }
                .template-info p {
                    margin: 0 0 10px 0;
                    color: #666;
                    font-size: 14px;
                }
                .template-meta {
                    display: flex;
                    gap: 15px;
                    font-size: 12px;
                    color: #999;
                }
                .template-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .date-range {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .date-range input {
                    flex: 1;
                }
                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .report-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 15px;
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .report-type {
                    padding: 4px 12px;
                    background: #3498db;
                    color: white;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .report-date {
                    color: #666;
                    font-size: 14px;
                }
                .report-meta {
                    display: flex;
                    gap: 15px;
                    font-size: 14px;
                    color: #666;
                    margin-top: 10px;
                }
                .report-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .preview-container {
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .preview-content {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .sample-table-container {
                    overflow-x: auto;
                    margin: 20px 0;
                }
                .sample-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .sample-table th, .sample-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                .sample-table th {
                    background: #f8f9fa;
                    font-weight: bold;
                }
                .share-options {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .share-option {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .email-share, .link-share {
                    display: flex;
                    gap: 10px;
                }
                .email-share input, .link-share input {
                    flex: 1;
                }
                .permissions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize reports manager
let reportsManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('report-templates')) {
        reportsManager = new ReportsManager();
        window.reportsManager = reportsManager;
    }
});