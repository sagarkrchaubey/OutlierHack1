// DOM Elements for Stopwatch
const startStopBtn = document.getElementById('start-stop');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const hourDisplay = document.getElementById('hours');
const minuteDisplay = document.getElementById('minutes');
const secondDisplay = document.getElementById('seconds');
const millisecondDisplay = document.getElementById('milliseconds');
const lapList = document.getElementById('lap-list');
const clearLapsBtn = document.getElementById('clear-laps');

// Stopwatch Variables
let stopwatchInterval;
let startTime;
let elapsedTime = 0;
let running = false;
let laps = [];
let lapCounter = 1;

// Format time into hours, minutes, seconds, and milliseconds
function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: milliseconds.toString().padStart(3, '0')
    };
}

// Update the stopwatch display
function updateStopwatchDisplay() {
    const timeNow = Date.now();
    const timeToDisplay = elapsedTime + (running ? timeNow - startTime : 0);
    const formattedTime = formatTime(timeToDisplay);

    hourDisplay.textContent = formattedTime.hours;
    minuteDisplay.textContent = formattedTime.minutes;
    secondDisplay.textContent = formattedTime.seconds;
    millisecondDisplay.textContent = formattedTime.milliseconds;
}

// Start or pause the stopwatch
function startStopwatch() {
    if (!running) {
        startTime = Date.now();
        stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
        startStopBtn.textContent = 'Pause';
        startStopBtn.classList.remove('btn-primary');
        startStopBtn.classList.add('btn-success');
        running = true;
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    } else {
        clearInterval(stopwatchInterval);
        elapsedTime += Date.now() - startTime;
        startStopBtn.textContent = 'Resume';
        startStopBtn.classList.remove('btn-success');
        startStopBtn.classList.add('btn-primary');
        running = false;
    }
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(stopwatchInterval);
    elapsedTime = 0;
    startTime = 0;
    running = false;
    updateStopwatchDisplay();
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('btn-success');
    startStopBtn.classList.add('btn-primary');
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    clearLaps();
}

// Record a lap
function recordLap() {
    if (running) {
        const timeNow = Date.now();
        const lapTime = elapsedTime + (timeNow - startTime);
        laps.push(lapTime);

        const formattedTime = formatTime(lapTime);
        const lapTimeString = `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}.${formattedTime.milliseconds}`;

        // Calculate difference from previous lap
        let diffString = '';
        if (laps.length > 1) {
            const timeDiff = lapTime - laps[laps.length - 2];
            const formattedDiff = formatTime(Math.abs(timeDiff));
            const sign = timeDiff >= 0 ? '+' : '-';
            diffString = `<span class="lap-diff ${timeDiff >= 0 ? 'slower' : 'faster'}">${sign}${formattedDiff.minutes}:${formattedDiff.seconds}.${formattedDiff.milliseconds}</span>`;
        }

        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <div class="lap-number">Lap ${lapCounter}</div>
            <div class="lap-times">
                <div class="lap-time">${lapTimeString}</div>
                ${diffString}
            </div>
        `;

        lapList.prepend(lapItem);
        lapCounter++;

        clearLapsBtn.style.display = 'block';
    }
}

// Clear all laps
function clearLaps() {
    lapList.innerHTML = '';
    laps = [];
    lapCounter = 1;
    clearLapsBtn.style.display = 'none';
}

// Event Listeners for Stopwatch
startStopBtn.addEventListener('click', startStopwatch);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetStopwatch);
clearLapsBtn.querySelector('button').addEventListener('click', clearLaps);

// Initialize the stopwatch display
updateStopwatchDisplay();

