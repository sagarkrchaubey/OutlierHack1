// Create a theme toggle button
const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '☀️';
document.body.appendChild(themeToggle);

// Initialize theme from localStorage
let darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) {
    applyDarkMode();
}

// Add event listener for the theme toggle button
themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        applyDarkMode();
    } else {
        applyLightMode();
    }
});

function applyDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('--background', '#1a1b1e');
    document.documentElement.style.setProperty('--surface', '#262830');
    document.documentElement.style.setProperty('--text', '#ecedef');
    document.documentElement.style.setProperty('--text-light', '#9ba1a6');
    document.documentElement.style.setProperty('--primary', '#90b4ff');
    document.documentElement.style.setProperty('--primary-dark', '#7495dd');
    document.documentElement.style.setProperty('--secondary', '#ff9ebd');
    document.documentElement.style.setProperty('--success', '#6bdfb8');
    document.documentElement.style.setProperty('--danger', '#ff9b9b');
    themeToggle.innerHTML = '🌙';
}

function applyLightMode() {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.setProperty('--background', '#f8f9fa');
    document.documentElement.style.setProperty('--surface', '#ffffff');
    document.documentElement.style.setProperty('--text', '#212529');
    document.documentElement.style.setProperty('--text-light', '#6c757d');
    document.documentElement.style.setProperty('--primary', '#3a86ff');
    document.documentElement.style.setProperty('--primary-dark', '#0a66c2');
    document.documentElement.style.setProperty('--secondary', '#ff006e');
    document.documentElement.style.setProperty('--success', '#38b000');
    document.documentElement.style.setProperty('--danger', '#d00000');
    themeToggle.innerHTML = '☀️';
}

