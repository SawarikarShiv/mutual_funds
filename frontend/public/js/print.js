// ===== PRINT ENHANCEMENTS =====
class PrintManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPrintButton();
        this.setupPDFExport();
        this.setPrintDate();
    }

    setupPrintButton() {
        // Add print functionality to all print buttons
        document.querySelectorAll('.print-btn, [data-print]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prepareForPrint();
                window.print();
            });
        });
    }

    setupPDFExport() {
        // Setup PDF download (using jsPDF library)
        const pdfBtn = document.getElementById('download-pdf');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', async () => {
                await this.generatePDF();
            });
        }
    }

    setPrintDate() {
        // Set current date on all print date elements
        document.querySelectorAll('#print-date, .print-date').forEach(el => {
            el.textContent = new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });
    }

    prepareForPrint() {
        // Add print-specific classes
        document.body.classList.add('printing');
        
        // Update page numbers
        this.updatePageNumbers();
        
        // Convert charts to images
        this.convertChartsToImages();
        
        // Hide interactive elements
        this.hideInteractiveElements();
        
        // Add watermark if draft
        if (document.body.classList.contains('draft')) {
            this.addWatermark('DRAFT');
        }
    }

    updatePageNumbers() {
        // This would be called after print to update page numbers
        const pageNumbers = document.querySelectorAll('.page-number');
        const totalPages = document.querySelectorAll('.total-pages');
        
        // Note: Actual page counting requires CSS counters
        // This is a simplified version
        pageNumbers.forEach(el => {
            el.textContent = '1';
        });
        
        totalPages.forEach(el => {
            el.textContent = '?';
        });
    }

    convertChartsToImages() {
        // Convert Canvas charts to images for better print quality
        document.querySelectorAll('canvas').forEach(canvas => {
            const container = canvas.closest('.chart-container');
            if (container) {
                const img = document.createElement('img');
                img.className = 'chart-print-image print-only';
                img.src = canvas.toDataURL('image/png', 1.0);
                img.alt = 'Chart Visualization';
                img.style.width = '100%';
                img.style.height = 'auto';
                container.appendChild(img);
            }
        });
    }

    hideInteractiveElements() {
        // Hide form inputs that shouldn't be printed
        document.querySelectorAll('input:not([readonly]):not([disabled]), select:not([readonly]):not([disabled])').forEach(el => {
            el.classList.add('no-print');
        });
    }

    addWatermark(text) {
        const watermark = document.createElement('div');
        watermark.className = 'watermark print-only';
        watermark.textContent = text;
        watermark.style.position = 'fixed';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '80pt';
        watermark.style.color = 'rgba(0,0,0,0.1)';
        watermark.style.zIndex = '9999';
        watermark.style.pointerEvents = 'none';
        document.body.appendChild(watermark);
    }

    async generatePDF() {
        // This would use jsPDF or similar library
        // For now, show a message
        window.app.showAlert('PDF export feature coming soon!', 'info');
        
        // Example with jsPDF:
        /*
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add content to PDF
        doc.text('Portfolio Statement', 20, 20);
        // ... more PDF generation code
        
        doc.save('portfolio-statement.pdf');
        */
    }

    // Handle window print events
    handlePrintEvents() {
        window.addEventListener('beforeprint', () => {
            this.prepareForPrint();
        });

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
            
            // Remove chart images added for print
            document.querySelectorAll('.chart-print-image').forEach(img => {
                img.remove();
            });
            
            // Remove watermark
            document.querySelectorAll('.watermark').forEach(wm => {
                wm.remove();
            });
        });
    }
}

// Initialize print manager
if (document.querySelector('.print-page') || document.querySelector('.print-btn')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.printManager = new PrintManager();
        window.printManager.handlePrintEvents();
    });
}