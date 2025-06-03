const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

let timeLeft = WORK_TIME;
let timerId = null;
let isWorkTime = true;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('status');
const progressBar = document.getElementById('progress');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  const totalTime = isWorkTime ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.style.backgroundColor = isWorkTime ? '#4CAF50' : '#2196F3';
}

function updateStatus() {
  statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
}

function switchMode() {
  isWorkTime = !isWorkTime;
  timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
  updateStatus();
  updateDisplay();
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/tomato-128.png',
    title: 'Pomodoro Timer',
    message: isWorkTime ? 'Time to work!' : 'Time for a break!',
    priority: 2
  });
}

function startTimer() {
  if (timerId !== null) {
    // Timer is running, pause it
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'Start';
    return;
  }

  startBtn.textContent = 'Pause';
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      switchMode();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isWorkTime = true;
  timeLeft = WORK_TIME;
  startBtn.textContent = 'Start';
  updateStatus();
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display
updateStatus();
updateDisplay(); 