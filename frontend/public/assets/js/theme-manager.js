// Theme Manager
class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8f9fa',
                '--text-primary': '#212529',
                '--text-secondary': '#6c757d',
                '--border-color': '#dee2e6',
                '--card-bg': '#ffffff',
                '--nav-bg': '#ffffff',
                '--primary-color': '#0d6efd',
                '--hover-color': '#f8f9fa'
            },
            dark: {
                '--bg-primary': '#121212',
                '--bg-secondary': '#1e1e1e',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b0b0b0',
                '--border-color': '#333333',
                '--card-bg': '#1e1e1e',
                '--nav-bg': '#1a1a1a',
                '--primary-color': '#0d6efd',
                '--hover-color': '#2d2d2d'
            },
            blue: {
                '--bg-primary': '#e3f2fd',
                '--bg-secondary': '#bbdefb',
                '--text-primary': '#0d47a1',
                '--text-secondary': '#1976d2',
                '--border-color': '#90caf9',
                '--card-bg': '#ffffff',
                '--nav-bg': '#bbdefb',
                '--primary-color': '#1565c0',
                '--hover-color': '#e1f5fe'
            },
            green: {
                '--bg-primary': '#e8f5e9',
                '--bg-secondary': '#c8e6c9',
                '--text-primary': '#1b5e20',
                '--text-secondary': '#388e3c',
                '--border-color': '#a5d6a7',
                '--card-bg': '#ffffff',
                '--nav-bg': '#c8e6c9',
                '--primary-color': '#2e7d32',
                '--hover-color': '#f1f8e9'
            }
        };
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
        this.setTheme(savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Apply theme variables
        for (const [property, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(property, value);
        }

        // Save to localStorage
        localStorage.setItem('portfolioTheme', themeName);
        this.updateThemeIcon(themeName);
    }

    updateThemeIcon(themeName) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (themeName === 'dark') {
            icon.className = 'fas fa-sun';
            icon.style.color = '#ffd700';
        } else {
            icon.className = 'fas fa-moon';
            icon.style.color = '';
        }
    }

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('portfolioTheme') || 'light';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(nextTheme);
            });
        }

        // Theme modal functionality
        const themeModal = document.getElementById('themeModal');
        const closeModal = document.getElementById('closeThemeModal');
        const themeOptions = document.querySelectorAll('.theme-option');

        // Double-click theme toggle to open modal
        if (themeToggle) {
            let clickCount = 0;
            let timer;
            
            themeToggle.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 2) {
                    this.openThemeModal();
                    clickCount = 0;
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    clickCount = 0;
                }, 500);
            });
        }

        // Theme options selection
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.closeThemeModal();
            });
        });

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeThemeModal();
            });
        }

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (themeModal && e.target === themeModal) {
                this.closeThemeModal();
            }
        });
    }

    openThemeModal() {
        const modal = document.getElementById('themeModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }

    closeThemeModal() {
        const modal = document.getElementById('themeModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
}

// Initialize Theme Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});