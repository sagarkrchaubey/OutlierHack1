// DOM Elements
const addTrainBtn = document.getElementById('add-train');
const trainsContainer = document.getElementById('trains-container');
const coachModal = document.getElementById('coach-modal');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const saveCoachBtn = document.getElementById('save-coach');
const cancelCoachBtn = document.getElementById('cancel-coach');

// Train Timer Variables
let trainCounter = 1;  // Start with 1 since we have one train in HTML
const trainTimers = {};

// Ensure the first train has data-train-id="1"
const firstTrain = document.querySelector('.train-container');
if (firstTrain && !firstTrain.dataset.trainId) {
    firstTrain.dataset.trainId = "1";
}

// Create a new coach
function createCoach(trainId, hours = 0, minutes = 5, seconds = 0) {
    const train = document.querySelector(`.train-container[data-train-id="${trainId}"] .train`);
    const addCoachBtn = train.querySelector('.add-coach');

    const coach = document.createElement('div');
    coach.className = 'coach';

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    coach.dataset.totalSeconds = totalSeconds;
    coach.dataset.initialSeconds = totalSeconds;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    coach.innerHTML = `
        <div class="coach-time">${formattedHours}:${formattedMinutes}:${formattedSeconds}</div>
        <div class="coach-label">Coach ${train.querySelectorAll('.coach').length + 1}</div>
        <div class="remove-coach">×</div>
        <div class="edit-coach-time">✎</div>
    `;

    train.insertBefore(coach, addCoachBtn);

    // Add event listeners for the coach
    const removeBtn = coach.querySelector('.remove-coach');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        coach.remove();
        updateCoachLabels(trainId);
    });

    const editBtn = coach.querySelector('.edit-coach-time');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCoachModal(coach);
    });

    updateCoachLabels(trainId);
}

// Update coach labels
function updateCoachLabels(trainId) {
    const train = document.querySelector(`.train-container[data-train-id="${trainId}"] .train`);
    const coaches = train.querySelectorAll('.coach');

    coaches.forEach((coach, index) => {
        const label = coach.querySelector('.coach-label');
        label.textContent = `Coach ${index + 1}`;
    });
}

// Format time from seconds
function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
    };
}

// Update coach display
function updateCoachDisplay(coach, totalSeconds) {
    const time = formatTimeFromSeconds(totalSeconds);
    coach.querySelector('.coach-time').textContent = `${time.hours}:${time.minutes}:${time.seconds}`;
    coach.dataset.totalSeconds = totalSeconds;
}

// Start train timer
function startTrainTimer(trainId) {
    const trainContainer = document.querySelector(`.train-container[data-train-id="${trainId}"]`);
    const startBtn = trainContainer.querySelector('.start-train');
    const coaches = Array.from(trainContainer.querySelectorAll('.coach'));

    if (coaches.length === 0) {
        alert('Please add at least one coach to start the timer!');
        return;
    }

    if (trainTimers[trainId]?.running) {
        // Pause the timer
        clearInterval(trainTimers[trainId].interval);
        trainTimers[trainId].running = false;
        startBtn.textContent = 'Resume';
        startBtn.classList.remove('btn-success');
        startBtn.classList.add('btn-primary');
    } else {
        let currentCoachIndex = trainTimers[trainId]?.currentCoachIndex || 0;

        // Initialize timer state
        if (!trainTimers[trainId]) {
            trainTimers[trainId] = {
                running: false,
                currentCoachIndex: 0,
                loopEnabled: isLoopEnabled(trainId)
            };
        }

        // Reset coaches if starting fresh
        if (!trainTimers[trainId].running && currentCoachIndex === 0) {
            coaches.forEach(coach => {
                coach.classList.remove('active', 'completed');
                coach.dataset.totalSeconds = coach.dataset.initialSeconds;
                updateCoachDisplay(coach, parseInt(coach.dataset.initialSeconds));
            });
            coaches[0].classList.add('active');
        }

        const updateTimer = () => {
            const currentCoach = coaches[currentCoachIndex];
            if (!currentCoach) {
                if (trainTimers[trainId].loopEnabled) {
                    // Reset and loop
                    coaches.forEach(coach => {
                        coach.classList.remove('active', 'completed');
                        const initialSeconds = parseInt(coach.dataset.initialSeconds);
                        coach.dataset.totalSeconds = initialSeconds;
                        updateCoachDisplay(coach, initialSeconds);
                    });
                    currentCoachIndex = 0;
                    coaches[0].classList.add('active');
                } else {
                    // Stop timer
                    clearInterval(trainTimers[trainId].interval);
                    trainTimers[trainId].running = false;
                    startBtn.textContent = 'Start';
                    startBtn.classList.remove('btn-success');
                    startBtn.classList.add('btn-primary');
                    return;
                }
            }

            let remainingSeconds = parseInt(currentCoach.dataset.totalSeconds);

            if (remainingSeconds <= 0) {
                // Current coach complete
                currentCoach.classList.remove('active');
                currentCoach.classList.add('completed');
                currentCoachIndex++;
                trainTimers[trainId].currentCoachIndex = currentCoachIndex;

                if (currentCoachIndex < coaches.length) {
                    coaches[currentCoachIndex].classList.add('active');
                }
                return;
            }

            // Update time
            remainingSeconds--;
            currentCoach.dataset.totalSeconds = remainingSeconds;
            updateCoachDisplay(currentCoach, remainingSeconds);
        };

        // Start interval
        trainTimers[trainId] = {
            ...trainTimers[trainId],
            interval: setInterval(updateTimer, 1000),
            running: true,
            currentCoachIndex: currentCoachIndex,
            loopEnabled: isLoopEnabled(trainId)
        };

        startBtn.textContent = 'Pause';
        startBtn.classList.remove('btn-primary');
        startBtn.classList.add('btn-success');

        // Initial update
        updateTimer();
    }
}

// Reset train timer
function resetTrainTimer(trainId) {
    const trainContainer = document.querySelector(`.train-container[data-train-id="${trainId}"]`);
    const startBtn = trainContainer.querySelector('.start-train');
    const coaches = Array.from(trainContainer.querySelectorAll('.coach'));

    // Clear interval if running
    if (trainTimers[trainId]?.interval) {
        clearInterval(trainTimers[trainId].interval);
    }

    // Reset all coaches
    coaches.forEach(coach => {
        coach.classList.remove('active', 'completed');
        const initialSeconds = parseInt(coach.dataset.initialSeconds);
        coach.dataset.totalSeconds = initialSeconds;
        updateCoachDisplay(coach, initialSeconds);
    });

    // Reset timer state while preserving loop state
    trainTimers[trainId] = {
        running: false,
        currentCoachIndex: 0,
        loopEnabled: isLoopEnabled(trainId)  // Preserve loop state
    };

    // Reset button state
    startBtn.textContent = 'Start';
    startBtn.classList.remove('btn-success');
    startBtn.classList.add('btn-primary');

    // Set first coach as active if exists
    if (coaches.length > 0) {
        coaches[0].classList.add('active');
    }
}

// Create a new train timer
function createTrainTimer() {
    trainCounter++;

    const trainContainer = document.createElement('div');
    trainContainer.className = 'train-container';
    trainContainer.dataset.trainId = trainCounter;

    trainContainer.innerHTML = `
        <div class="train-name">Time Train #${trainCounter}</div>
        <div class="remove-train">×</div>
        <div class="train">
            <div class="engine">ENGINE</div>
            <div class="add-coach">+</div>
        </div>
        <div class="train-options">
            <button class="loop-button">Enable Loop</button>
        </div>
        <div class="train-controls">
            <button class="btn btn-primary start-train">Start</button>
            <button class="btn btn-danger reset-train">Reset</button>
        </div>
    `;

    trainsContainer.appendChild(trainContainer);

    // Add event listeners for the new train
    setupTrainEventListeners(trainContainer);
}

// Setup event listeners for a train
function setupTrainEventListeners(trainContainer) {
    const trainId = trainContainer.dataset.trainId;
    const addCoachBtn = trainContainer.querySelector('.add-coach');
    const startBtn = trainContainer.querySelector('.start-train');
    const resetBtn = trainContainer.querySelector('.reset-train');
    const removeTrainBtn = trainContainer.querySelector('.remove-train');
    const loopBtn = trainContainer.querySelector('.loop-button');

    // Add coach button
    addCoachBtn.addEventListener('click', () => {
        openCoachModal(null, trainId);
    });

    // Start button
    startBtn.addEventListener('click', () => {
        startTrainTimer(trainId);
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        resetTrainTimer(trainId);
    });

    // Remove train button
    removeTrainBtn?.addEventListener('click', () => {
        if (trainTimers[trainId]?.interval) {
            clearInterval(trainTimers[trainId].interval);
            delete trainTimers[trainId];
        }
        trainContainer.remove();
    });

    // Loop button
    loopBtn.addEventListener('click', () => {
        loopBtn.classList.toggle('active');
        const isActive = loopBtn.classList.contains('active');
        loopBtn.textContent = isActive ? 'Disable Loop' : 'Enable Loop';
        
        if (trainTimers[trainId]) {
            trainTimers[trainId].loopEnabled = isActive;
        }
    });
}

// Check if loop is enabled
function isLoopEnabled(trainId) {
    const trainContainer = document.querySelector(`.train-container[data-train-id="${trainId}"]`);
    const loopButton = trainContainer.querySelector('.loop-button');
    return loopButton.classList.contains('active');
}

// Open coach modal
function openCoachModal(coach = null, trainId = null) {
    coachModal.dataset.coach = coach ? coach.outerHTML : '';
    coachModal.dataset.trainId = trainId || (coach ? coach.closest('.train-container').dataset.trainId : '');

    if (coach) {
        const totalSeconds = parseInt(coach.dataset.totalSeconds);
        const time = formatTimeFromSeconds(totalSeconds);
        hoursInput.value = parseInt(time.hours);
        minutesInput.value = parseInt(time.minutes);
        secondsInput.value = parseInt(time.seconds);
    } else {
        hoursInput.value = 0;
        minutesInput.value = 0;
        secondsInput.value = 0;
    }

    coachModal.classList.add('active');
}

// Close coach modal
function closeCoachModal() {
    coachModal.classList.remove('active');
}

// Save coach time
function saveCoachTime() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    const trainId = coachModal.dataset.trainId;
    const coachHTML = coachModal.dataset.coach;

    if (coachHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = coachHTML;
        const originalCoach = tempDiv.querySelector('.coach');
        const allCoaches = document.querySelectorAll(`.train-container[data-train-id="${trainId}"] .coach`);

        const coach = Array.from(allCoaches).find(c =>
            c.querySelector('.coach-label').textContent === originalCoach.querySelector('.coach-label').textContent
        );

        if (coach) {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            updateCoachDisplay(coach, totalSeconds);
            coach.dataset.initialSeconds = totalSeconds;
            coach.dataset.totalSeconds = totalSeconds;
        }
    } else {
        createCoach(trainId, hours, minutes, seconds);
    }

    closeCoachModal();
}

// Add quick time selection functionality
document.querySelectorAll('.quick-time').forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        hoursInput.value = Math.floor(minutes / 60);
        minutesInput.value = minutes % 60;
        secondsInput.value = 0;
    });
});

// Event listeners for modal
saveCoachBtn.addEventListener('click', saveCoachTime);
cancelCoachBtn.addEventListener('click', closeCoachModal);

// Event listener for add train button
addTrainBtn.addEventListener('click', createTrainTimer);

// Setup initial train event listeners
document.querySelectorAll('.train-container').forEach(trainContainer => {
    setupTrainEventListeners(trainContainer);
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === coachModal) {
        closeCoachModal();
    }
});

