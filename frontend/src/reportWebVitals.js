// 02-frontend/08-src/reportWebVitals.js

/**
 * Web Vitals Reporting for Mutual Fund Management System
 * 
 * This module collects and reports Core Web Vitals and custom performance metrics
 * to help monitor and optimize application performance.
 */

// Performance measurement utilities
const metrics = {
  // Core Web Vitals
  CLS: { name: 'CLS', value: 0, rating: '' },
  FID: { name: 'FID', value: 0, rating: '' },
  LCP: { name: 'LCP', value: 0, rating: '' },
  FCP: { name: 'FCP', value: 0, rating: '' },
  TTFB: { name: 'TTFB', value: 0, rating: '' },
  
  // Custom metrics for financial application
  APP_INIT_TIME: { name: 'APP_INIT_TIME', value: 0, rating: '' },
  FUND_DATA_LOAD: { name: 'FUND_DATA_LOAD', value: 0, rating: '' },
  PORTFOLIO_RENDER: { name: 'PORTFOLIO_RENDER', value: 0, rating: '' },
  CHART_RENDER: { name: 'CHART_RENDER', value: 0, rating: '' },
  API_RESPONSE_TIME: { name: 'API_RESPONSE_TIME', value: 0, rating: '' },
  
  // Memory usage
  MEMORY_USAGE: { name: 'MEMORY_USAGE', value: 0, rating: '' },
  
  // Network metrics
  NETWORK_SPEED: { name: 'NETWORK_SPEED', value: 0, rating: '' },
};

// Thresholds for different metrics (in milliseconds)
const thresholds = {
  GOOD: {
    CLS: 0.1,
    FID: 100,
    LCP: 2500,
    FCP: 1800,
    TTFB: 800,
    APP_INIT_TIME: 3000,
    FUND_DATA_LOAD: 2000,
    PORTFOLIO_RENDER: 1000,
    CHART_RENDER: 500,
    API_RESPONSE_TIME: 500,
  },
  NEEDS_IMPROVEMENT: {
    CLS: 0.25,
    FID: 300,
    LCP: 4000,
    FCP: 3000,
    TTFB: 1800,
    APP_INIT_TIME: 5000,
    FUND_DATA_LOAD: 4000,
    PORTFOLIO_RENDER: 2000,
    CHART_RENDER: 1000,
    API_RESPONSE_TIME: 1000,
  },
};

// Performance monitoring configuration
const config = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.1, // Sample 10% of users
  endpoint: process.env.REACT_APP_PERFORMANCE_ENDPOINT || '/api/performance',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
  userId: null,
  sessionId: generateSessionId(),
  debug: process.env.NODE_ENV === 'development',
};

// Session management
function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Generate user ID from localStorage or create new
function getOrCreateUserId() {
  const storageKey = 'mf_user_id';
  let userId = localStorage.getItem(storageKey);
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem(storageKey, userId);
  }
  
  return userId;
}

// Determine rating for a metric
function getRating(metricName, value) {
  const goodThreshold = thresholds.GOOD[metricName];
  const needsImprovementThreshold = thresholds.NEEDS_IMPROVEMENT[metricName];
  
  if (value <= goodThreshold) return 'good';
  if (value <= needsImprovementThreshold) return 'needs-improvement';
  return 'poor';
}

// Send metrics to analytics endpoint
function sendToAnalytics(metric) {
  if (!config.enabled) return;
  
  // Apply sampling
  if (Math.random() > config.sampleRate) return;
  
  const payload = {
    ...metric,
    appVersion: config.appVersion,
    userId: config.userId,
    sessionId: config.sessionId,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    } : null,
  };
  
  // Send via Beacon API for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon(config.endpoint, JSON.stringify(payload));
  } else {
    // Fallback to fetch
    fetch(config.endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(error => {
      if (config.debug) console.warn('Failed to send metrics:', error);
    });
  }
  
  // Log in development
  if (config.debug) {
    console.log('[Performance Metric]', metric.name, {
      value: metric.value,
      rating: metric.rating,
      timestamp: payload.timestamp,
    });
  }
}

// Measure memory usage (if supported)
function measureMemory() {
  if (performance.memory) {
    const memory = performance.memory;
    const usedJSHeapSize = memory.usedJSHeapSize;
    const totalJSHeapSize = memory.totalJSHeapSize;
    const jsHeapSizeLimit = memory.jsHeapSizeLimit;
    
    metrics.MEMORY_USAGE.value = usedJSHeapSize;
    metrics.MEMORY_USAGE.rating = usedJSHeapSize / jsHeapSizeLimit > 0.8 ? 'poor' : 'good';
    
    if (config.debug) {
      console.log('[Memory Usage]', {
        used: formatBytes(usedJSHeapSize),
        total: formatBytes(totalJSHeapSize),
        limit: formatBytes(jsHeapSizeLimit),
        percentage: ((usedJSHeapSize / totalJSHeapSize) * 100).toFixed(2) + '%',
      });
    }
  }
}

// Format bytes to human readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Measure network speed
function measureNetworkSpeed() {
  if (navigator.connection && navigator.connection.downlink) {
    metrics.NETWORK_SPEED.value = navigator.connection.downlink;
    const rating = navigator.connection.downlink > 2 ? 'good' : 
                   navigator.connection.downlink > 0.5 ? 'needs-improvement' : 'poor';
    metrics.NETWORK_SPEED.rating = rating;
  }
}

// Custom performance marks and measures
const performanceTracker = {
  marks: new Map(),
  
  start(markName) {
    if (!performance.mark) return;
    const mark = `${markName}_start`;
    performance.mark(mark);
    this.marks.set(markName, mark);
  },
  
  end(markName, metricName) {
    if (!performance.mark || !this.marks.has(markName)) return;
    
    const startMark = this.marks.get(markName);
    const endMark = `${markName}_end`;
    performance.mark(endMark);
    
    performance.measure(markName, startMark, endMark);
    
    const measures = performance.getEntriesByName(markName);
    const lastMeasure = measures[measures.length - 1];
    
    if (lastMeasure && metricName && metrics[metricName]) {
      metrics[metricName].value = lastMeasure.duration;
      metrics[metricName].rating = getRating(metricName, lastMeasure.duration);
      
      if (config.debug) {
        console.log(`[Performance Measure] ${markName}:`, lastMeasure.duration.toFixed(2) + 'ms', 
                   `Rating: ${metrics[metricName].rating}`);
      }
    }
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(markName);
    this.marks.delete(markName);
  },
};

// Initialize Web Vitals measurement
function initWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Set user ID
    config.userId = getOrCreateUserId();
    
    // Measure initial metrics
    measureNetworkSpeed();
    
    // Start measuring app initialization time
    performanceTracker.start('app_init');
    
    // Set up periodic memory measurements
    if (config.enabled) {
      setInterval(measureMemory, 60000); // Every minute
    }
    
    // Import and initialize web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      // Core Web Vitals
      getCLS((metric) => {
        metrics.CLS.value = metric.value;
        metrics.CLS.rating = getRating('CLS', metric.value);
        onPerfEntry(metric);
        sendToAnalytics({
          ...metric,
          category: 'web-vital',
          subcategory: 'layout-shift',
        });
      });
      
      getFID((metric) => {
        metrics.FID.value = metric.value;
        metrics.FID.rating = getRating('FID', metric.value);
        onPerfEntry(metric);
        sendToAnalytics({
          ...metric,
          category: 'web-vital',
          subcategory: 'interactivity',
        });
      });
      
      getLCP((metric) => {
        metrics.LCP.value = metric.value;
        metrics.LCP.rating = getRating('LCP', metric.value);
        onPerfEntry(metric);
        sendToAnalytics({
          ...metric,
          category: 'web-vital',
          subcategory: 'loading',
        });
      });
      
      // Additional Web Vitals
      getFCP((metric) => {
        metrics.FCP.value = metric.value;
        metrics.FCP.rating = getRating('FCP', metric.value);
        onPerfEntry(metric);
        sendToAnalytics({
          ...metric,
          category: 'web-vital',
          subcategory: 'paint',
        });
      });
      
      getTTFB((metric) => {
        metrics.TTFB.value = metric.value;
        metrics.TTFB.rating = getRating('TTFB', metric.value);
        onPerfEntry(metric);
        sendToAnalytics({
          ...metric,
          category: 'web-vital',
          subcategory: 'server-response',
        });
      });
    }).catch(error => {
      console.error('Failed to load web-vitals:', error);
    });
    
    // Custom performance marks for application-specific metrics
    if (window.performance && performance.mark) {
      // Mark app initialization complete when React mounts
      const observer = new MutationObserver(() => {
        const rootElement = document.getElementById('root');
        if (rootElement && rootElement.children.length > 0) {
          performanceTracker.end('app_init', 'APP_INIT_TIME');
          
          // Send app init metric
          sendToAnalytics({
            name: 'APP_INIT_TIME',
            value: metrics.APP_INIT_TIME.value,
            rating: metrics.APP_INIT_TIME.rating,
            category: 'custom',
            subcategory: 'app-initialization',
          });
          
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page became hidden
        performanceTracker.start('page_hidden');
      } else {
        // Page became visible
        performanceTracker.end('page_hidden', 'PAGE_HIDDEN_DURATION');
      }
    });
    
    // Track beforeunload for session duration
    let pageLoadTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - pageLoadTime;
      sendToAnalytics({
        name: 'SESSION_DURATION',
        value: sessionDuration,
        rating: sessionDuration > 60000 ? 'good' : 'needs-improvement', // More than 1 minute is good
        category: 'custom',
        subcategory: 'user-engagement',
      });
    });
  }
}

// API performance monitoring
function monitorAPI(apiUrl, method, startTime, endTime, status, size) {
  const duration = endTime - startTime;
  
  metrics.API_RESPONSE_TIME.value = duration;
  metrics.API_RESPONSE_TIME.rating = getRating('API_RESPONSE_TIME', duration);
  
  const apiMetric = {
    name: 'API_PERFORMANCE',
    value: duration,
    rating: metrics.API_RESPONSE_TIME.rating,
    category: 'custom',
    subcategory: 'api-call',
    details: {
      url: apiUrl,
      method,
      status,
      size,
      timestamp: new Date().toISOString(),
    },
  };
  
  sendToAnalytics(apiMetric);
  
  if (config.debug && duration > 1000) {
    console.warn(`[Slow API] ${method} ${apiUrl}:`, duration.toFixed(2) + 'ms');
  }
}

// Custom metric tracking for financial features
const financialMetrics = {
  startFundDataLoad() {
    performanceTracker.start('fund_data_load');
  },
  
  endFundDataLoad() {
    performanceTracker.end('fund_data_load', 'FUND_DATA_LOAD');
    sendToAnalytics({
      name: 'FUND_DATA_LOAD',
      value: metrics.FUND_DATA_LOAD.value,
      rating: metrics.FUND_DATA_LOAD.rating,
      category: 'custom',
      subcategory: 'data-loading',
    });
  },
  
  startPortfolioRender() {
    performanceTracker.start('portfolio_render');
  },
  
  endPortfolioRender() {
    performanceTracker.end('portfolio_render', 'PORTFOLIO_RENDER');
    sendToAnalytics({
      name: 'PORTFOLIO_RENDER',
      value: metrics.PORTFOLIO_RENDER.value,
      rating: metrics.PORTFOLIO_RENDER.rating,
      category: 'custom',
      subcategory: 'ui-rendering',
    });
  },
  
  startChartRender(chartType) {
    performanceTracker.start(`chart_render_${chartType}`);
  },
  
  endChartRender(chartType) {
    performanceTracker.end(`chart_render_${chartType}`, 'CHART_RENDER');
    sendToAnalytics({
      name: 'CHART_RENDER',
      value: metrics.CHART_RENDER.value,
      rating: metrics.CHART_RENDER.rating,
      category: 'custom',
      subcategory: 'visualization',
      details: { chartType },
    });
  },
  
  trackTransaction(action, duration) {
    sendToAnalytics({
      name: 'TRANSACTION_ACTION',
      value: duration,
      rating: duration < 2000 ? 'good' : duration < 5000 ? 'needs-improvement' : 'poor',
      category: 'business',
      subcategory: 'transaction',
      details: { action },
    });
  },
  
  trackError(errorType, errorMessage, component) {
    sendToAnalytics({
      name: 'APPLICATION_ERROR',
      value: 1, // Count of errors
      rating: 'poor',
      category: 'error',
      subcategory: errorType,
      details: {
        message: errorMessage,
        component,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
    });
  },
  
  // Get current performance summary
  getPerformanceSummary() {
    return {
      coreWebVitals: {
        CLS: metrics.CLS,
        FID: metrics.FID,
        LCP: metrics.LCP,
        FCP: metrics.FCP,
        TTFB: metrics.TTFB,
      },
      customMetrics: {
        APP_INIT_TIME: metrics.APP_INIT_TIME,
        FUND_DATA_LOAD: metrics.FUND_DATA_LOAD,
        PORTFOLIO_RENDER: metrics.PORTFOLIO_RENDER,
        CHART_RENDER: metrics.CHART_RENDER,
        API_RESPONSE_TIME: metrics.API_RESPONSE_TIME,
      },
      systemMetrics: {
        MEMORY_USAGE: metrics.MEMORY_USAGE,
        NETWORK_SPEED: metrics.NETWORK_SPEED,
      },
      timestamp: new Date().toISOString(),
      sessionId: config.sessionId,
      userId: config.userId,
    };
  },
  
  // Export metrics for debugging
  exportMetrics() {
    const summary = this.getPerformanceSummary();
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

// Expose for debugging in development
if (process.env.NODE_ENV === 'development') {
  window.financialMetrics = financialMetrics;
  window.performanceTracker = performanceTracker;
  
  // Add performance dashboard to window
  window.showPerformanceDashboard = () => {
    const summary = financialMetrics.getPerformanceSummary();
    
    // Create a simple dashboard
    const dashboard = document.createElement('div');
    dashboard.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 2px solid #1976d2;
      border-radius: 8px;
      padding: 16px;
      z-index: 9999;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: monospace;
      font-size: 12px;
    `;
    
    let html = `<h3 style="margin-top:0;color:#1976d2">Performance Dashboard</h3>`;
    
    // Core Web Vitals
    html += `<h4>Core Web Vitals</h4>`;
    Object.values(summary.coreWebVitals).forEach(metric => {
      if (metric.value > 0) {
        const color = metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red';
        html += `<div>${metric.name}: <span style="color:${color};font-weight:bold">${metric.value.toFixed(2)} (${metric.rating})</span></div>`;
      }
    });
    
    // Custom Metrics
    html += `<h4>Custom Metrics</h4>`;
    Object.values(summary.customMetrics).forEach(metric => {
      if (metric.value > 0) {
        const color = metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red';
        html += `<div>${metric.name}: <span style="color:${color};font-weight:bold">${metric.value.toFixed(2)}ms (${metric.rating})</span></div>`;
      }
    });
    
    html += `<hr style="margin:10px 0">`;
    html += `<div>Session: ${summary.sessionId}</div>`;
    html += `<div>User: ${summary.userId}</div>`;
    html += `<div>Time: ${new Date(summary.timestamp).toLocaleTimeString()}</div>`;
    
    html += `<div style="margin-top:10px;">
      <button onclick="window.financialMetrics.exportMetrics()" style="padding:5px 10px;margin-right:5px;">Export</button>
      <button onclick="this.parentNode.parentNode.remove()" style="padding:5px 10px;">Close</button>
    </div>`;
    
    dashboard.innerHTML = html;
    document.body.appendChild(dashboard);
  };
  
  console.log('[Performance] Monitoring initialized in development mode');
  console.log('[Performance] Type showPerformanceDashboard() to view metrics');
}

// Main export function
const reportWebVitals = (onPerfEntry) => {
  // Initialize web vitals monitoring
  initWebVitals(onPerfEntry);
  
  // Return utilities for custom metric tracking
  return {
    financialMetrics,
    performanceTracker,
    monitorAPI,
    getMetrics: () => financialMetrics.getPerformanceSummary(),
  };
};

// Default export (for Create React App compatibility)
export default reportWebVitals;

// Named exports for advanced usage
export {
  financialMetrics,
  performanceTracker,
  monitorAPI,
  initWebVitals,
  getOrCreateUserId,
  generateSessionId,
  measureMemory,
  measureNetworkSpeed,
  formatBytes,
};