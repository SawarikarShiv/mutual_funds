/**
 * Tax Calculations and Reports for Infinity Mutual Funds
 */

class TaxManager {
    constructor() {
        this.taxData = {};
        this.taxYear = new Date().getFullYear();
        this.init();
    }
    
    async init() {
        await this.loadTaxData();
        this.setupEventListeners();
        this.renderTaxSummary();
        this.renderCapitalGains();
        this.renderDividendDetails();
        this.renderTaxCalculations();
    }
    
    async loadTaxData() {
        try {
            const response = await InfinityMF.makeRequest(`tax?year=${this.taxYear}`);
            if (response?.data) {
                this.taxData = response.data;
            }
        } catch (error) {
            console.error('Error loading tax data:', error);
            InfinityMF.showNotification('Failed to load tax data', 'error');
        }
    }
    
    renderTaxSummary() {
        const container = document.getElementById('tax-summary');
        if (!container || !this.taxData.summary) return;
        
        const summary = this.taxData.summary;
        
        container.innerHTML = `
            <div class="summary-card">
                <h4>Total Capital Gains</h4>
                <div class="amount ${summary.total_capital_gains >= 0 ? 'positive' : 'negative'}">
                    ${InfinityMF.formatCurrency(summary.total_capital_gains)}
                </div>
                <div class="breakdown">
                    <span>Short-term: ${InfinityMF.formatCurrency(summary.short_term_gains)}</span>
                    <span>Long-term: ${InfinityMF.formatCurrency(summary.long_term_gains)}</span>
                </div>
            </div>
            
            <div class="summary-card">
                <h4>Total Dividends</h4>
                <div class="amount">${InfinityMF.formatCurrency(summary.total_dividends)}</div>
                <div class="subtext">Received in FY ${this.taxYear}</div>
            </div>
            
            <div class="summary-card">
                <h4>Estimated Tax Liability</h4>
                <div class="amount tax-due">${InfinityMF.formatCurrency(summary.estimated_tax)}</div>
                <div class="subtext">Based on current tax slab</div>
            </div>
            
            <div class="summary-card">
                <h4>Tax Already Paid</h4>
                <div class="amount">${InfinityMF.formatCurrency(summary.tax_paid)}</div>
                <div class="subtext">TDS/Advance Tax</div>
            </div>
        `;
    }
    
    renderCapitalGains() {
        const container = document.getElementById('capital-gains');
        if (!container || !this.taxData.capital_gains) return;
        
        const gains = this.taxData.capital_gains;
        
        if (gains.length === 0) {
            container.innerHTML = '<p class="no-data">No capital gains transactions this year</p>';
            return;
        }
        
        const html = gains.map(gain => {
            const holdingPeriod = this.calculateHoldingPeriod(gain.purchase_date, gain.sale_date);
            const isLongTerm = holdingPeriod >= 365; // 1 year for equity funds
            const taxRate = isLongTerm ? '10% (LTCG)' : '15% (STCG)';
            const taxAmount = isLongTerm ? gain.gain * 0.1 : gain.gain * 0.15;
            
            return `
                <div class="gain-item ${isLongTerm ? 'long-term' : 'short-term'}">
                    <div class="gain-info">
                        <div class="gain-fund">${gain.fund_name}</div>
                        <div class="gain-dates">
                            <span>Purchased: ${InfinityMF.formatDate(gain.purchase_date)}</span>
                            <span>Sold: ${InfinityMF.formatDate(gain.sale_date)}</span>
                            <span>Held: ${holdingPeriod} days</span>
                        </div>
                    </div>
                    
                    <div class="gain-amounts">
                        <div class="amount-row">
                            <span>Sale Value:</span>
                            <span>${InfinityMF.formatCurrency(gain.sale_value)}</span>
                        </div>
                        <div class="amount-row">
                            <span>Purchase Cost:</span>
                            <span>${InfinityMF.formatCurrency(gain.purchase_cost)}</span>
                        </div>
                        <div class="amount-row">
                            <span>Capital Gain:</span>
                            <span class="gain-amount ${gain.gain >= 0 ? 'positive' : 'negative'}">
                                ${InfinityMF.formatCurrency(gain.gain)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="gain-tax">
                        <div class="tax-info">
                            <span class="tax-type">${isLongTerm ? 'LTCG' : 'STCG'}</span>
                            <span class="tax-rate">${taxRate}</span>
                        </div>
                        <div class="tax-amount">${InfinityMF.formatCurrency(taxAmount)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    renderDividendDetails() {
        const container = document.getElementById('dividend-details');
        if (!container || !this.taxData.dividends) return;
        
        const dividends = this.taxData.dividends;
        
        if (dividends.length === 0) {
            container.innerHTML = '<p class="no-data">No dividends received this year</p>';
            return;
        }
        
        // Group dividends by fund
        const groupedDividends = dividends.reduce((groups, dividend) => {
            const fundName = dividend.fund_name;
            if (!groups[fundName]) {
                groups[fundName] = [];
            }
            groups[fundName].push(dividend);
            return groups;
        }, {});
        
        let html = '';
        
        Object.keys(groupedDividends).forEach(fundName => {
            const fundDividends = groupedDividends[fundName];
            const totalDividends = fundDividends.reduce((sum, d) => sum + d.amount, 0);
            const totalTds = fundDividends.reduce((sum, d) => sum + (d.tds || 0), 0);
            
            html += `
                <div class="dividend-fund">
                    <div class="fund-header">
                        <div class="fund-name">${fundName}</div>
                        <div class="fund-total">
                            Total: ${InfinityMF.formatCurrency(totalDividends)}
                            ${totalTds > 0 ? `<span class="tds-amount">(TDS: ${InfinityMF.formatCurrency(totalTds)})</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="dividend-list">
                        ${fundDividends.map(dividend => `
                            <div class="dividend-item">
                                <div class="dividend-date">${InfinityMF.formatDate(dividend.date)}</div>
                                <div class="dividend-amount">${InfinityMF.formatCurrency(dividend.amount)}</div>
                                ${dividend.tds ? `
                                    <div class="dividend-tds">TDS: ${InfinityMF.formatCurrency(dividend.tds)}</div>
                                ` : ''}
                                <div class="dividend-status status-${dividend.status || 'credited'}">
                                    ${dividend.status || 'credited'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    renderTaxCalculations() {
        const container = document.getElementById('tax-calculations');
        if (!container || !this.taxData.calculations) return;
        
        const calculations = this.taxData.calculations;
        
        container.innerHTML = `
            <div class="calculation-section">
                <h4>Capital Gains Tax Calculation</h4>
                <div class="calculation-table">
                    <div class="calc-row">
                        <span>Short Term Capital Gains (STCG):</span>
                        <span>${InfinityMF.formatCurrency(calculations.stcg)}</span>
                    </div>
                    <div class="calc-row">
                        <span>STCG Tax Rate:</span>
                        <span>15%</span>
                    </div>
                    <div class="calc-row">
                        <span>STCG Tax:</span>
                        <span>${InfinityMF.formatCurrency(calculations.stcg_tax)}</span>
                    </div>
                    
                    <div class="calc-divider"></div>
                    
                    <div class="calc-row">
                        <span>Long Term Capital Gains (LTCG):</span>
                        <span>${InfinityMF.formatCurrency(calculations.ltcg)}</span>
                    </div>
                    <div class="calc-row">
                        <span>LTCG Exemption (up to ₹1 lakh):</span>
                        <span>${InfinityMF.formatCurrency(calculations.ltcg_exemption)}</span>
                    </div>
                    <div class="calc-row">
                        <span>Taxable LTCG:</span>
                        <span>${InfinityMF.formatCurrency(calculations.taxable_ltcg)}</span>
                    </div>
                    <div class="calc-row">
                        <span>LTCG Tax Rate:</span>
                        <span>10%</span>
                    </div>
                    <div class="calc-row">
                        <span>LTCG Tax:</span>
                        <span>${InfinityMF.formatCurrency(calculations.ltcg_tax)}</span>
                    </div>
                    
                    <div class="calc-divider"></div>
                    
                    <div class="calc-row total">
                        <span>Total Capital Gains Tax:</span>
                        <span class="tax-total">${InfinityMF.formatCurrency(calculations.total_cg_tax)}</span>
                    </div>
                </div>
            </div>
            
            <div class="calculation-section">
                <h4>Dividend Income Tax Calculation</h4>
                <div class="calculation-table">
                    <div class="calc-row">
                        <span>Total Dividends Received:</span>
                        <span>${InfinityMF.formatCurrency(calculations.total_dividends)}</span>
                    </div>
                    <div class="calc-row">
                        <span>TDS Deducted:</span>
                        <span>${InfinityMF.formatCurrency(calculations.tds_deducted)}</span>
                    </div>
                    <div class="calc-row">
                        <span>Taxable Dividends:</span>
                        <span>${InfinityMF.formatCurrency(calculations.taxable_dividends)}</span>
                    </div>
                    <div class="calc-row">
                        <span>Tax as per your slab:</span>
                        <span>${calculations.dividend_tax_rate}%</span>
                    </div>
                    <div class="calc-row">
                        <span>Dividend Tax:</span>
                        <span>${InfinityMF.formatCurrency(calculations.dividend_tax)}</span>
                    </div>
                    <div class="calc-row">
                        <span>TDS Credit Available:</span>
                        <span>${InfinityMF.formatCurrency(calculations.tds_credit)}</span>
                    </div>
                    
                    <div class="calc-divider"></div>
                    
                    <div class="calc-row total">
                        <span>Net Dividend Tax Payable:</span>
                        <span class="tax-total">${InfinityMF.formatCurrency(calculations.net_dividend_tax)}</span>
                    </div>
                </div>
            </div>
            
            <div class="calculation-section">
                <h4>Overall Tax Summary</h4>
                <div class="calculation-table">
                    <div class="calc-row">
                        <span>Capital Gains Tax:</span>
                        <span>${InfinityMF.formatCurrency(calculations.total_cg_tax)}</span>
                    </div>
                    <div class="calc-row">
                        <span>Dividend Tax:</span>
                        <span>${InfinityMF.formatCurrency(calculations.net_dividend_tax)}</span>
                    </div>
                    <div class="calc-row">
                        <span>TDS/Advance Tax Paid:</span>
                        <span>${InfinityMF.formatCurrency(calculations.tax_paid)}</span>
                    </div>
                    
                    <div class="calc-divider"></div>
                    
                    <div class="calc-row final-total">
                        <span>Net Tax Payable/(Refund):</span>
                        <span class="${calculations.net_tax_payable >= 0 ? 'tax-due' : 'tax-refund'}">
                            ${InfinityMF.formatCurrency(calculations.net_tax_payable)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateHoldingPeriod(purchaseDate, saleDate) {
        const purchase = new Date(purchaseDate);
        const sale = new Date(saleDate);
        const diffTime = sale - purchase;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    
    setupEventListeners() {
        // Tax year selector
        const yearSelect = document.getElementById('tax-year');
        if (yearSelect) {
            // Populate years (current year and previous 4 years)
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i >= currentYear - 4; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `FY ${i}-${i + 1}`;
                if (i === this.taxYear) {
                    option.selected = true;
                }
                yearSelect.appendChild(option);
            }
            
            yearSelect.addEventListener('change', async (e) => {
                this.taxYear = parseInt(e.target.value);
                await this.loadTaxData();
                this.renderTaxSummary();
                this.renderCapitalGains();
                this.renderDividendDetails();
                this.renderTaxCalculations();
            });
        }
        
        // Export tax reports
        const exportBtn = document.getElementById('export-tax-report');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportTaxReport());
        }
        
        // Download Form 26AS
        const form26asBtn = document.getElementById('download-26as');
        if (form26asBtn) {
            form26asBtn.addEventListener('click', () => this.downloadForm26AS());
        }
        
        // Tax saving suggestions
        const suggestionsBtn = document.getElementById('tax-suggestions');
        if (suggestionsBtn) {
            suggestionsBtn.addEventListener('click', () => this.showTaxSuggestions());
        }
        
        // Tax calculator
        const calculatorBtn = document.getElementById('open-tax-calculator');
        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', () => this.openTaxCalculator());
        }
    }
    
    async exportTaxReport() {
        InfinityMF.showNotification('Generating tax report...', 'info');
        
        const response = await InfinityMF.makeRequest('tax/export', 'POST', {
            year: this.taxYear,
            format: 'pdf'
        });
        
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
            InfinityMF.showNotification('Tax report generated', 'success');
        }
    }
    
    async downloadForm26AS() {
        InfinityMF.showNotification('Downloading Form 26AS...', 'info');
        
        const response = await InfinityMF.makeRequest('tax/form26as');
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
        } else {
            InfinityMF.showNotification('Form 26AS not available', 'error');
        }
    }
    
    showTaxSuggestions() {
        const modal = document.createElement('div');
        modal.className = 'modal wide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tax Saving Suggestions for FY ${this.taxYear}-${this.taxYear + 1}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="tax-suggestions">
                        <div class="suggestion-section">
                            <h4>Capital Gains Tax Optimization</h4>
                            <ul>
                                <li>
                                    <strong>Harvest Tax Losses:</strong> Consider selling funds with losses 
                                    to offset capital gains. Current unrealized losses: 
                                    <span class="loss-amount">${InfinityMF.formatCurrency(this.taxData.suggestions?.unrealized_losses || 0)}</span>
                                </li>
                                <li>
                                    <strong>Hold for Long Term:</strong> Hold equity funds for more than 12 months 
                                    to qualify for lower LTCG tax rate (10% vs 15% for STCG)
                                </li>
                                <li>
                                    <strong>Use ₹1 Lakh LTCG Exemption:</strong> You have used 
                                    <span class="exemption-used">${InfinityMF.formatCurrency(this.taxData.suggestions?.ltcg_exemption_used || 0)}</span> 
                                    of ₹1 lakh LTCG exemption
                                </li>
                            </ul>
                        </div>
                        
                        <div class="suggestion-section">
                            <h4>Tax Saving Investments (Section 80C)</h4>
                            <ul>
                                <li>
                                    <strong>ELSS Funds:</strong> Consider investing in Equity Linked Saving Schemes 
                                    for tax deduction up to ₹1.5 lakh under Section 80C
                                </li>
                                <li>
                                    <strong>Current 80C Investments:</strong> 
                                    <span class="investment-amount">${InfinityMF.formatCurrency(this.taxData.suggestions?.section_80c_invested || 0)}</span>
                                    (Remaining limit: 
                                    <span class="limit-remaining">${InfinityMF.formatCurrency(Math.max(0, 150000 - (this.taxData.suggestions?.section_80c_invested || 0)))}</span>)
                                </li>
                            </ul>
                        </div>
                        
                        <div class="suggestion-section">
                            <h4>Dividend Tax Planning</h4>
                            <ul>
                                <li>
                                    <strong>Growth vs Dividend Option:</strong> Consider switching to growth option 
                                    to defer tax liability
                                </li>
                                <li>
                                    <strong>TDS Credit:</strong> Ensure TDS credit of 
                                    <span class="tds-credit">${InfinityMF.formatCurrency(this.taxData.suggestions?.tds_credit_available || 0)}</span> 
                                    is claimed in your tax return
                                </li>
                            </ul>
                        </div>
                        
                        <div class="suggestion-section">
                            <h4>Estimated Tax Impact</h4>
                            <div class="tax-impact">
                                <div class="impact-item">
                                    <span>Current Estimated Tax:</span>
                                    <span class="tax-amount">${InfinityMF.formatCurrency(this.taxData.suggestions?.current_tax || 0)}</span>
                                </div>
                                <div class="impact-item">
                                    <span>Potential Savings:</span>
                                    <span class="savings-amount">${InfinityMF.formatCurrency(this.taxData.suggestions?.potential_savings || 0)}</span>
                                </div>
                                <div class="impact-item total">
                                    <span>Revised Estimated Tax:</span>
                                    <span class="revised-tax">${InfinityMF.formatCurrency(this.taxData.suggestions?.revised_tax || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="suggestions-actions">
                        <button onclick="taxManager.openTaxPlanner()">Open Tax Planner</button>
                        <button onclick="taxManager.scheduleTaxConsultation()">Schedule Tax Consultation</button>
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
    
    openTaxCalculator() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tax Calculator</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="tax-calculator-form">
                        <div class="form-group">
                            <label>Tax Regime</label>
                            <select name="tax_regime" id="tax-regime">
                                <option value="new">New Tax Regime</option>
                                <option value="old">Old Tax Regime</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Annual Income (₹)</label>
                            <input type="number" name="annual_income" value="1000000" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label>Capital Gains (₹)</label>
                            <input type="number" name="capital_gains" value="${this.taxData.summary?.total_capital_gains || 0}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label>Dividend Income (₹)</label>
                            <input type="number" name="dividend_income" value="${this.taxData.summary?.total_dividends || 0}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label>80C Investments (₹)</label>
                            <input type="number" name="section_80c" value="150000" min="0" max="150000">
                        </div>
                        
                        <div class="form-group">
                            <label>Other Deductions (₹)</label>
                            <input type="number" name="other_deductions" value="0" min="0">
                        </div>
                    </form>
                    
                    <div class="calculator-results" style="display: none;">
                        <h4>Calculation Results</h4>
                        <div id="calculator-output"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="taxManager.calculateTax()">Calculate Tax</button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    async calculateTax() {
        const form = document.getElementById('tax-calculator-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const response = await InfinityMF.makeRequest('tax/calculate', 'POST', data);
        if (response?.data) {
            const results = response.data;
            const output = document.getElementById('calculator-output');
            const resultsDiv = document.querySelector('.calculator-results');
            
            if (output && resultsDiv) {
                output.innerHTML = `
                    <div class="calc-result">
                        <div class="result-row">
                            <span>Total Income:</span>
                            <span>${InfinityMF.formatCurrency(results.total_income)}</span>
                        </div>
                        <div class="result-row">
                            <span>Taxable Income:</span>
                            <span>${InfinityMF.formatCurrency(results.taxable_income)}</span>
                        </div>
                        <div class="result-row">
                            <span>Income Tax:</span>
                            <span>${InfinityMF.formatCurrency(results.income_tax)}</span>
                        </div>
                        <div class="result-row">
                            <span>Capital Gains Tax:</span>
                            <span>${InfinityMF.formatCurrency(results.capital_gains_tax)}</span>
                        </div>
                        <div class="result-row">
                            <span>Dividend Tax:</span>
                            <span>${InfinityMF.formatCurrency(results.dividend_tax)}</span>
                        </div>
                        <div class="result-row total">
                            <span>Total Tax Liability:</span>
                            <span class="tax-liability">${InfinityMF.formatCurrency(results.total_tax)}</span>
                        </div>
                        <div class="result-row">
                            <span>Effective Tax Rate:</span>
                            <span>${results.effective_tax_rate.toFixed(2)}%</span>
                        </div>
                    </div>
                `;
                
                resultsDiv.style.display = 'block';
            }
        }
    }
    
    async openTaxPlanner() {
        InfinityMF.showNotification('Opening tax planner...', 'info');
        
        const response = await InfinityMF.makeRequest('tax/planner');
        if (response?.data?.url) {
            window.open(response.data.url, '_blank');
        }
    }
    
    async scheduleTaxConsultation() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Schedule Tax Consultation</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="consultation-form">
                        <div class="form-group">
                            <label>Preferred Date *</label>
                            <input type="date" name="consultation_date" required 
                                   min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div class="form-group">
                            <label>Preferred Time *</label>
                            <select name="consultation_time" required>
                                <option value="">Select Time</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Consultation Mode *</label>
                            <select name="consultation_mode" required>
                                <option value="video">Video Call</option>
                                <option value="phone">Phone Call</option>
                                <option value="in_person">In Person</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Specific Topics to Discuss</label>
                            <textarea name="topics" rows="3" placeholder="List any specific tax topics you want to discuss..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="taxManager.submitConsultationRequest()">Schedule Consultation</button>
                    <button class="secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalStyles();
    }
    
    async submitConsultationRequest() {
        const form = document.getElementById('consultation-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const response = await InfinityMF.makeRequest('tax/consultation', 'POST', data);
        if (response?.success) {
            InfinityMF.showNotification('Tax consultation scheduled successfully', 'success');
            document.querySelector('.modal').remove();
        }
    }
    
    setupModalStyles() {
        if (!document.getElementById('tax-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'tax-modal-styles';
            style.textContent = `
                .tax-suggestions {
                    max-height: 60vh;
                    overflow-y: auto;
                }
                .suggestion-section {
                    margin-bottom: 25px;
                    padding-bottom: 25px;
                    border-bottom: 1px solid #eee;
                }
                .suggestion-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .suggestion-section ul {
                    padding-left: 20px;
                    margin: 15px 0;
                }
                .suggestion-section li {
                    margin-bottom: 10px;
                    line-height: 1.5;
                }
                .loss-amount, .exemption-used, .investment-amount, 
                .limit-remaining, .tds-credit {
                    font-weight: bold;
                    color: #2c3e50;
                }
                .loss-amount {
                    color: #e74c3c;
                }
                .savings-amount {
                    color: #27ae60;
                }
                .tax-impact {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 15px;
                }
                .impact-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .impact-item.total {
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                    margin-top: 10px;
                    font-weight: bold;
                }
                .tax-amount, .revised-tax {
                    color: #e74c3c;
                }
                .savings-amount {
                    color: #27ae60;
                }
                .suggestions-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .calculator-results {
                    margin-top: 20px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .calc-result {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .result-row {
                    display: flex;
                    justify-content: space-between;
                }
                .result-row.total {
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                    margin-top: 10px;
                    font-weight: bold;
                }
                .tax-liability {
                    color: #e74c3c;
                    font-size: 18px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize tax manager
let taxManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tax-summary')) {
        taxManager = new TaxManager();
        window.taxManager = taxManager;
    }
});