// DOM Elements
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.app-section');

// Tab functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active section
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`${tabId}-section`).classList.add('active');
    });
});

// Swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const currentTabIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));

    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next tab
        const nextTab = tabs[Math.min(currentTabIndex + 1, tabs.length - 1)];
        if (nextTab) nextTab.click();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous tab
        const prevTab = tabs[Math.max(currentTabIndex - 1, 0)];
        if (prevTab) prevTab.click();
    }
}

// Theme toggle (light/dark mode)
const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '☀️';
document.body.appendChild(themeToggle);

let darkMode = false;
themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    if (darkMode) {
        document.documentElement.style.setProperty('--background', '#121212');
        document.documentElement.style.setProperty('--surface', '#1e1e1e');
        document.documentElement.style.setProperty('--text', '#e0e0e0');
        document.documentElement.style.setProperty('--text-light', '#a0a0a0');
        themeToggle.innerHTML = '🌙';
    } else {
        document.documentElement.style.setProperty('--background', '#f8f9fa');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--text', '#212529');
        document.documentElement.style.setProperty('--text-light', '#6c757d');
        themeToggle.innerHTML = '☀️';
    }
});