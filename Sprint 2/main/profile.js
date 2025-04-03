const taskData = JSON.parse(localStorage.getItem('taskData')) || { completedTasks: [] };
const taskDates = JSON.parse(localStorage.getItem('taskDates')) || [];

document.getElementById('totalTasks').textContent = taskData.completedTasks.length;

function calculateStreaks(dates) {
  if (!dates.length) return 0;
  const uniqueDates = [...new Set(dates)].sort();
  let maxStreak = 1, currentStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = (curr - prev) / (1000 * 3600 * 24);
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

document.getElementById('longestStreak').textContent = calculateStreaks(taskDates) + ' days';

const recentTasksList = document.getElementById('recentTasks');
if (taskDates.length === 0) {
  recentTasksList.innerHTML = '<li>No activity yet.</li>';
} else {
  taskDates.slice(-7).reverse().forEach(date => {
    const li = document.createElement('li');
    li.textContent = `Tasks completed on ${new Date(date).toDateString()}`;
    recentTasksList.appendChild(li);
  });
}