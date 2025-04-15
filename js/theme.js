// Create a theme toggle button
const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '☀️';
document.body.appendChild(themeToggle);

// Track the current theme state
let darkMode = false;

// Add event listener for the theme toggle button
themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;

    if (darkMode) {
        // Apply dark mode styles
        document.documentElement.style.setProperty('--background', '#121212');
        document.documentElement.style.setProperty('--surface', '#1e1e1e');
        document.documentElement.style.setProperty('--text', '#e0e0e0');
        document.documentElement.style.setProperty('--text-light', '#a0a0a0');
        document.documentElement.style.setProperty('--primary', '#bb86fc');
        document.documentElement.style.setProperty('--secondary', '#ff79b0');
        document.documentElement.style.setProperty('--success', '#03dac6');
        document.documentElement.style.setProperty('--danger', '#cf6679');
        themeToggle.innerHTML = '🌙';
    } else {
        // Revert to light mode styles
        document.documentElement.style.setProperty('--background', '#f8f9fa');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--text', '#212529');
        document.documentElement.style.setProperty('--text-light', '#6c757d');
        document.documentElement.style.setProperty('--primary', '#3a86ff');
        document.documentElement.style.setProperty('--secondary', '#ff006e');
        document.documentElement.style.setProperty('--success', '#38b000');
        document.documentElement.style.setProperty('--danger', '#d00000');
        themeToggle.innerHTML = '☀️';
    }
});

