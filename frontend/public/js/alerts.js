/**
 * Alerts and Notifications System for Infinity Mutual Funds
 */

class AlertsManager {
    constructor() {
        this.alerts = [];
        this.notifications = [];
        this.preferences = {};
        this.init();
    }
    
    async init() {
        await this.loadAlerts();
        await this.loadNotifications();
        await this.loadPreferences();
        this.setupEventListeners();
        this.renderAlerts();
        this.renderNotifications();
        this.renderPreferences();
        this.setupWebSocket();
    }
    
    async loadAlerts() {
        try {
            const response = await InfinityMF.makeRequest('alerts');
            if (response?.data) {
                this.alerts = response.data;
            }
        } catch (error) {
            console.error('Error loading alerts:', error);
        }
    }
    
    async loadNotifications() {
        try {
            const response = await InfinityMF.makeRequest('notifications');
            if (response?.data) {
                this.notifications = response.data;
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    async loadPreferences() {
        try {
            const response = await InfinityMF.makeRequest('alerts/preferences');
            if (response?.data) {
                this.preferences = response.data;
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            // Set default preferences
            this.preferences = this.getDefaultPreferences();
        }
    }
    
    getDefaultPreferences() {
        return {
            email_alerts: true,
            push_notifications: true,
            sms_alerts: false,
            desktop_notifications: true,
            alert_categories: {
                portfolio: true,
                transactions: true,
                market: true,
                compliance: true,
                system: false
            },
            alert_severities: {
                critical: true,
                warning: true,
                info: false
            },
            quiet_hours: {
                enabled: false,
                start: '22:00',
                end: '07:00'
            },
            digest_frequency: 'daily'
        };
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
                <div class="alert-stat critical">
                    <div class="stat-value">${criticalAlerts.length}</div>
                    <div class="stat-label">Critical</div>
                </div>
                <div class="alert-stat warning">
                    <div class="stat-value">${warningAlerts.length}</div>
                    <div class="stat-label">Warnings</div>
                </div>
                <div class="alert-stat total">
                    <div class="stat-value">${activeAlerts.length}</div>
                    <div class="stat-label">Total Active</div>
                </div>
            `;
        }
        
        if (activeAlerts.length === 0) {
            container.innerHTML = '<p class="no-alerts">No active alerts</p>';
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
                <div class="alert-item alert-${alert.severity}" data-alert-id="${alert.id}">
                    <div class="alert-icon">
                        ${this.getAlertIcon(alert.severity)}
                    </div>
                    
                    <div class="alert-content">
                        <div class="alert-header">
                            <h5>${alert.title}</h5>
                            <div class="alert-time">${this.formatTimeAgo(alert.created_at)}</div>
                        </div>
                        
                        <p>${alert.message}</p>
                        
                        <div class="alert-meta">
                            <span class="meta-category">${alert.category}</span>
                            ${alert.source ? `<span class="meta-source">Source: ${alert.source}</span>` : ''}
                        </div>
                        
                        ${alert.data ? `
                            <div class="alert-data">
                                <button class="btn-toggle-data" onclick="alertsManager.toggleAlertData('${alert.id}')">
                                    Show Details
                                </button>
                                <div class="data-content" style="display: none;">
                                    <pre>${JSON.stringify(alert.data, null, 2)}</pre>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="alert-actions">
                        <button class="btn-acknowledge" onclick="alertsManager.acknowledgeAlert('${alert.id}')">
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
    
    renderNotifications() {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        // Filter unread notifications first
        const unreadNotifications = this.notifications.filter(n => !n.read);
        const readNotifications = this.notifications.filter(n => n.read);
        
        // Combine with unread first
        const sortedNotifications = [...unreadNotifications, ...readNotifications];
        
        if (sortedNotifications.length === 0) {
            container.innerHTML = '<p class="no-notifications">No notifications</p>';
            return;
        }
        
        const html = sortedNotifications.map(notification => {
            return `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                     data-notification-id="${notification.id}">
                    <div class="notification-icon">
                        ${this.getNotificationIcon(notification.type)}
                    </div>
                    
                    <div class="notification-content">
                        <div class="notification-header">
                            <h5>${notification.title}</h5>
                            <div class="notification-time">${this.formatTimeAgo(notification.created_at)}</div>
                        </div>
                        
                        <p>${notification.message}</p>
                        
                        ${notification.link ? `
                            <a href="${notification.link}" class="notification-link">View Details →</a>
                        ` : ''}
                    </div>
                    
                    <div class="notification-actions">
                        ${!notification.read ? `
                            <button class="btn-mark-read" onclick="alertsManager.markNotificationRead('${notification.id}')">
                                ✓
                            </button>
                        ` : ''}
                        <button class="btn-delete" onclick="alertsManager.deleteNotification('${notification.id}')">
                            ×
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        
        // Update notification badge
        this.updateNotificationBadge(unreadNotifications.length);
    }
    
    renderPreferences() {
        const container = document.getElementById('preferences-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="preferences-section">
                <h4>Alert Channels</h4>
                <div class="preference-group">
                    <label class="preference-item">
                        <input type="checkbox" name="email_alerts" 
                               ${this.preferences.email_alerts ? 'checked' : ''}
                               onchange="alertsManager.updatePreference('email_alerts', this.checked)">
                        <span>Email Alerts</span>
                    </label>
                    
                    <label class="preference-item">
                        <input type="checkbox" name="push_notifications" 
                               ${this.preferences.push_notifications ? 'checked' : ''}
                               onchange="alertsManager.updatePreference('push_notifications', this.checked)">
                        <span>Push Notifications</span>
                    </label>
                    
                    <label class="preference-item">
                        <input type="checkbox" name="sms_alerts" 
                               ${this.preferences.sms_alerts ? 'checked' : ''}
                               onchange="alertsManager.updatePreference('sms_alerts', this.checked)">
                        <span>SMS Alerts</span>
                    </label>
                    
                    <label class="preference-item">
                        <input type="checkbox" name="desktop_notifications" 
                               ${this.preferences.desktop_notifications ? 'checked' : ''}
                               onchange="alertsManager.updatePreference('desktop_notifications', this.checked)">
                        <span>Desktop Notifications</span>
                    </label>
                </div>
            </div>
            
            <div class="preferences-section">
                <h4>Alert Categories</h4>
                <div class="preference-group">
                    ${Object.keys(this.preferences.alert_categories || {}).map(category => `
                        <label class="preference-item">
                            <input type="checkbox" name="alert_category_${category}" 
                                   ${this.preferences.alert_categories[category] ? 'checked' : ''}
                                   onchange="alertsManager.updateCategoryPreference('${category}', this.checked)">
                            <span>${this.formatCategoryName(category)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="preferences-section">
                <h4>Alert Severities</h4>
                <div class="preference-group">
                    ${Object.keys(this.preferences.alert_severities || {}).map(severity => `
                        <label class="preference-item">
                            <input type="checkbox" name="alert_severity_${severity}" 
                                   ${this.preferences.alert_severities[severity] ? 'checked' : ''}
                                   onchange="alertsManager.updateSeverityPreference('${severity}', this.checked)">
                            <span>${this.formatSeverityName(severity)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="preferences-section">
                <h4>Quiet Hours</h4>
                <div class="preference-group">
                    <label class="preference-item">
                        <input type="checkbox" name="quiet_hours_enabled" 
                               ${this.preferences.quiet_hours?.enabled ? 'checked' : ''}
                               onchange="alertsManager.updateQuietHours('enabled', this.checked)">
                        <span>Enable Quiet Hours</span>
                    </label>
                    
                    <div class="time-range" ${!this.preferences.quiet_hours?.enabled ? 'style="display: none;"' : ''}>
                        <input type="time" name="quiet_hours_start" 
                               value="${this.preferences.quiet_hours?.start || '22:00'}"
                               onchange="alertsManager.updateQuietHours('start', this.value)">
                        <span>to</span>
                        <input type="time" name="quiet_hours_end" 
                               value="${this.preferences.quiet_hours?.end || '07:00'}"
                               onchange="alertsManager.updateQuietHours('end', this.value)">
                    </div>
                </div>
            </div>
            
            <div class="preferences-section">
                <h4>Digest Frequency</h4>
                <div class="preference-group">
                    <select name="digest_frequency" 
                            onchange="alertsManager.updatePreference('digest_frequency', this.value)">
                        <option value="realtime" ${this.preferences.digest_frequency === 'realtime' ? 'selected' : ''}>
                            Real-time
                        </option>
                        <option value="hourly" ${this.preferences.digest_frequency === 'hourly' ? 'selected' : ''}>
                            Hourly Digest
                        </option>
                        <option value="daily" ${this.preferences.digest_frequency === 'daily' ? 'selected' : ''}>
                            Daily Digest
                        </option>
                        <option value="weekly" ${this.preferences.digest_frequency === 'weekly' ? 'selected' : ''}>
                            Weekly Digest
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="preferences-actions">
                <button onclick="alertsManager.savePreferences()">Save Preferences</button>
                <button onclick="alertsManager.resetPreferences()" class="secondary">Reset to Defaults</button>
            </div>
        `;
        
        // Add event listener for quiet hours toggle
        const quietHoursToggle = document.querySelector('input[name="quiet_hours_enabled"]');
        if (quietHoursToggle) {
            quietHoursToggle.addEventListener('change', function() {
                const timeRange = this.closest('.preference-group').querySelector('.time-range');
                timeRange.style.display = this.checked ? 'block' : 'none';
            });
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
    
    getNotificationIcon(type) {
        const icons = {
            'portfolio': '📊',
            'transaction': '💰',
            'market': '📈',
            'compliance': '⚖️',
            'system': '⚙️',
            'info': 'ℹ️'
        };
        return icons[type] || '🔔';
    }
    
    formatTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    formatSeverityName(severity) {
        const names = {
            'critical': 'Critical',
            'warning': 'Warning',
            'info': 'Information'
        };
        return names[severity] || severity;
    }
    
    updateNotificationBadge(count) {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    setupEventListeners() {
        // Filter alerts
        const filterSelect = document.getElementById('alert-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterAlerts(e.target.value);
            });
        }
        
        // Search notifications
        const searchInput = document.getElementById('notification-search');
        if (searchInput) {
            searchInput.addEventListener('input', InfinityMF.debounce((e) => {
                this.searchNotifications(e.target.value);
            }, 300));
        }
        
        // Mark all as read
        const markAllReadBtn = document.getElementById('mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllNotificationsRead());
        }
        
        // Clear all notifications
        const clearAllBtn = document.getElementById('clear-all');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        }
        
        // Acknowledge all alerts
        const ackAllBtn = document.getElementById('acknowledge-all-alerts');
        if (ackAllBtn) {
            ackAllBtn.addEventListener('click', () => this.acknowledgeAllAlerts());
        }
        
        // Test notification
        const testBtn = document.getElementById('test-notification');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.sendTestNotification());
        }
    }
    
    filterAlerts(severity) {
        const alerts = document.querySelectorAll('.alert-item');
        
        alerts.forEach(alert => {
            const alertSeverity = alert.classList.contains('alert-critical') ? 'critical' :
                                 alert.classList.contains('alert-warning') ? 'warning' : 'info';
            const isVisible = severity === 'all' || alertSeverity === severity;
            alert.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    searchNotifications(query) {
        const notifications = document.querySelectorAll('.notification-item');
        const searchTerm = query.toLowerCase();
        
        notifications.forEach(notification => {
            const text = notification.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            notification.style.display = isVisible ? 'flex' : 'none';
        });
    }
    
    toggleAlertData(alertId) {
        const alert = document.querySelector(`[data-alert-id="${alertId}"]`);
        if (!alert) return;
        
        const toggleBtn = alert.querySelector('.btn-toggle-data');
        const dataContent = alert.querySelector('.data-content');
        
        if (dataContent.style.display === 'none') {
            dataContent.style.display = 'block';
            toggleBtn.textContent = 'Hide Details';
        } else {
            dataContent.style.display = 'none';
            toggleBtn.textContent = 'Show Details';
        }
    }
    
    async acknowledgeAlert(alertId) {
        const response = await InfinityMF.makeRequest(`alerts/${alertId}/acknowledge`, 'POST');
        if (response?.success) {
            InfinityMF.showNotification('Alert acknowledged', 'success');
            await this.loadAlerts();
            this.renderAlerts();
        }
    }
    
    async acknowledgeAllAlerts() {
        if (!confirm('Acknowledge all alerts?')) return;
        
        const response = await InfinityMF.makeRequest('alerts/acknowledge-all', 'POST');
        if (response?.success) {
            InfinityMF.showNotification('All alerts acknowledged', 'success');
            await this.loadAlerts();
            this.renderAlerts();
        }
    }
    
    async markNotificationRead(notificationId) {
        const response = await InfinityMF.makeRequest(`notifications/${notificationId}/read`, 'POST');
        if (response?.success) {
            await this.loadNotifications();
            this.renderNotifications();
        }
    }
    
    async markAllNotificationsRead() {
        const response = await InfinityMF.makeRequest('notifications/read-all', 'POST');
        if (response?.success) {
            InfinityMF.showNotification('All notifications marked as read', 'success');
            await this.loadNotifications();
            this.renderNotifications();
        }
    }
    
    async deleteNotification(notificationId) {
        if (!confirm('Delete this notification?')) return;
        
        const response = await InfinityMF.makeRequest(`notifications/${notificationId}`, 'DELETE');
        if (response?.success) {
            await this.loadNotifications();
            this.renderNotifications();
        }
    }
    
    async clearAllNotifications() {
        if (!confirm('Clear all notifications?')) return;
        
        const response = await InfinityMF.makeRequest('notifications/clear', 'DELETE');
        if (response?.success) {
            InfinityMF.showNotification('All notifications cleared', 'success');
            await this.loadNotifications();
            this.renderNotifications();
        }
    }
    
    async updatePreference(key, value) {
        this.preferences[key] = value;
    }
    
    async updateCategoryPreference(category, enabled) {
        if (!this.preferences.alert_categories) {
            this.preferences.alert_categories = {};
        }
        this.preferences.alert_categories[category] = enabled;
    }
    
    async updateSeverityPreference(severity, enabled) {
        if (!this.preferences.alert_severities) {
            this.preferences.alert_severities = {};
        }
        this.preferences.alert_severities[severity] = enabled;
    }
    
    async updateQuietHours(key, value) {
        if (!this.preferences.quiet_hours) {
            this.preferences.quiet_hours = {};
        }
        
        if (key === 'enabled') {
            this.preferences.quiet_hours.enabled = value;
        } else {
            this.preferences.quiet_hours[key] = value;
        }
    }
    
    async savePreferences() {
        const response = await InfinityMF.makeRequest('alerts/preferences', 'PUT', this.preferences);
        if (response?.success) {
            InfinityMF.showNotification('Preferences saved', 'success');
            
            // Request notification permission if enabled
            if (this.preferences.desktop_notifications && 'Notification' in window) {
                this.requestNotificationPermission();
            }
        }
    }
    
    async resetPreferences() {
        if (!confirm('Reset all preferences to defaults?')) return;
        
        this.preferences = this.getDefaultPreferences();
        this.renderPreferences();
        
        const response = await InfinityMF.makeRequest('alerts/preferences/reset', 'POST');
        if (response?.success) {
            InfinityMF.showNotification('Preferences reset to defaults', 'success');
        }
    }
    
    async sendTestNotification() {
        const response = await InfinityMF.makeRequest('alerts/test', 'POST');
        if (response?.success) {
            InfinityMF.showNotification('Test notification sent', 'success');
            
            // Show desktop notification if enabled
            if (this.preferences.desktop_notifications && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Infinity Mutual Funds', {
                    body: 'This is a test notification from Infinity Mutual Funds',
                    icon: 'logo.jpg'
                });
            }
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    InfinityMF.showNotification('Desktop notifications enabled', 'success');
                }
            });
        }
    }
    
    setupWebSocket() {
        // Check if WebSocket is supported
        if (!('WebSocket' in window)) {
            console.warn('WebSocket not supported');
            return;
        }
        
        const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsScheme}://${window.location.host}/ws/alerts`;
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                console.log('WebSocket connection established');
                // Send authentication token
                const token = localStorage.getItem('auth_token');
                if (token) {
                    ws.send(JSON.stringify({ type: 'auth', token }));
                }
            };
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            ws.onclose = () => {
                console.log('WebSocket connection closed');
                // Attempt to reconnect after 5 seconds
                setTimeout(() => this.setupWebSocket(), 5000);
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            // Store WebSocket connection
            this.ws = ws;
        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
        }
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'alert':
                this.handleNewAlert(data.alert);
                break;
                
            case 'notification':
                this.handleNewNotification(data.notification);
                break;
                
            case 'ping':
                // Keep connection alive
                if (this.ws) {
                    this.ws.send(JSON.stringify({ type: 'pong' }));
                }
                break;
        }
    }
    
    handleNewAlert(alert) {
        // Check if alert should be shown based on preferences
        if (!this.shouldShowAlert(alert)) {
            return;
        }
        
        // Add to alerts array
        this.alerts.unshift(alert);
        
        // Update UI
        this.renderAlerts();
        
        // Show desktop notification
        if (this.preferences.desktop_notifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Alert: ${alert.title}`, {
                body: alert.message,
                icon: 'logo.jpg'
            });
        }
        
        // Show in-app notification
        InfinityMF.showNotification(`New alert: ${alert.title}`, alert.severity);
    }
    
    handleNewNotification(notification) {
        // Add to notifications array
        this.notifications.unshift(notification);
        
        // Update UI
        this.renderNotifications();
        
        // Show desktop notification if not reading
        if (this.preferences.desktop_notifications && 'Notification' in window && 
            Notification.permission === 'granted' && document.visibilityState !== 'visible') {
            new Notification(`Notification: ${notification.title}`, {
                body: notification.message,
                icon: 'logo.jpg'
            });
        }
    }
    
    shouldShowAlert(alert) {
        // Check category preference
        if (this.preferences.alert_categories && 
            !this.preferences.alert_categories[alert.category]) {
            return false;
        }
        
        // Check severity preference
        if (this.preferences.alert_severities && 
            !this.preferences.alert_severities[alert.severity]) {
            return false;
        }
        
        // Check quiet hours
        if (this.preferences.quiet_hours?.enabled) {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const start = this.preferences.quiet_hours.start;
            const end = this.preferences.quiet_hours.end;
            
            if (start < end) {
                // Normal case: quiet hours don't cross midnight
                if (currentTime >= start && currentTime <= end) {
                    return false;
                }
            } else {
                // Quiet hours cross midnight
                if (currentTime >= start || currentTime <= end) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Method to be called from other modules to create alerts
    static createAlert(title, message, severity = 'info', category = 'system', data = null) {
        if (window.alertsManager) {
            window.alertsManager.handleNewAlert({
                id: Date.now().toString(),
                title,
                message,
                severity,
                category,
                data,
                status: 'active',
                created_at: new Date().toISOString()
            });
        }
    }
    
    // Method to be called from other modules to create notifications
    static createNotification(title, message, type = 'info', link = null) {
        if (window.alertsManager) {
            window.alertsManager.handleNewNotification({
                id: Date.now().toString(),
                title,
                message,
                type,
                link,
                read: false,
                created_at: new Date().toISOString()
            });
        }
    }
}

// Initialize alerts manager
let alertsManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('alerts-container') || 
        document.getElementById('notifications-container') ||
        document.getElementById('preferences-container')) {
        alertsManager = new AlertsManager();
        window.alertsManager = alertsManager;
    }
});