document.addEventListener('DOMContentLoaded', function () {
    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    // Add close button to sidebar toggle
    sidebarToggle.innerHTML = '≡ <span class="sidebar-close">✕</span>';
    const sidebarClose = document.querySelector('.sidebar-close');
    
    // Toggle sidebar on hamburger menu click
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('expanded');
    });
    
    // Close sidebar when X button is clicked
    sidebarClose.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the toggle event
        sidebar.classList.remove('expanded');
    });

    // Logout button functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            // Clear any stored login state or user data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('username');
            
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // Duck Pet Section - Redirect to duck pet HTML on click
    const duckPetSection = document.getElementById('duckPetSection');
    duckPetSection.addEventListener('click', function () {
        window.location.href = 'virtualpet.html';
    });

    // Duck Animation
    const duck = document.querySelector('.duck');
    let direction = 1;
    let position = 0;

    function animateDuck() {
        position += direction * 0.5;

        if (position > 100 || position < 0) {
            direction *= -1;
            // Flip the duck when changing direction
            duck.style.transform = direction > 0 ? 'scaleX(1)' : 'scaleX(-1)';
        }

        duck.style.left = `${position}px`;
        requestAnimationFrame(animateDuck);
    }

    animateDuck();

    // Calendar functionality
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthDisplay = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    function renderCalendar() {
        // Clear previous calendar days
        calendarDays.innerHTML = '';

        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Get first day of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Get number of days in the month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }

        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Add data attribute for the date
            const dateStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(day)}`;
            dayElement.dataset.date = dateStr;

            // Highlight current day
            if (day === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()) {
                dayElement.classList.add('current-day');
            }

            calendarDays.appendChild(dayElement);
        }
        
        // After rendering, mark calendar with streak data
        markCalendarWithStreak();
    }

    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // To-Do List functionality with rewards system
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');

    let taskCount = 0;

    // Initialize or get duck rewards from localStorage
    let duckRewards = JSON.parse(localStorage.getItem('duckRewards')) || {
        feedCount: 0,
        drinkCount: 0
    };

    // Get duck game state for coins - ensure it has required properties
    let gameState = JSON.parse(localStorage.getItem('duckPetGame')) || {
        quackerCoins: 0,
        xp: 0,
        xpToNextLevel: 100,
        level: 1
    };

    // Function to update duck rewards in localStorage
    function updateDuckRewards() {
        localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
    }

    // Function to update duck game state in localStorage
    function updateGameState() {
        // Get the current full game state from localStorage
        const currentGameState = JSON.parse(localStorage.getItem('duckPetGame')) || {
            duckName: "Mr. Quackers",
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            mood: "happy",
            feedCount: 0,
            waterCount: 0,
            playCount: 0,
            quackerCoins: 0,
            lastInteraction: Date.now(),
            achievements: {
                reachedLevel2: false,
                fed10Times: false,
                watered10Times: false,
                playedWithDuck20Times: false,
                reachedLevel5: false
            }
        };
        
        // Only update the quackerCoins property
        currentGameState.quackerCoins = gameState.quackerCoins;
        
        // Save the updated state back to localStorage
        localStorage.setItem('duckPetGame', JSON.stringify(currentGameState));
    }

    // Attach event listeners for adding tasks
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTask);
    }
    
    if (todoInput) {
        todoInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }

    // First, let's create a new function to save tasks with proper date structure
    function saveTask(taskText, priority, date = new Date()) {
        // Get existing tasks or initialize empty array
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        
        // Create a new task object
        const newTask = {
            id: Date.now(),
            text: taskText,
            priority: priority,
            date: formatDateForDataset(date), // Format: YYYY-MM-DD
            completed: false,
            createdAt: Date.now()
        };
        
        // Add the new task to the array
        tasks.push(newTask);
        
        // Save back to localStorage
        localStorage.setItem('taskList', JSON.stringify(tasks));
        
        return newTask;
    }
    
    // Helper function to format date for dataset (YYYY-MM-DD)
    function formatDateForDataset(date) {
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    }
    
    // Helper function to pad numbers with leading zero
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    // Function to add a task
    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') return;
    
        const priority = prioritySelect.value;
        
        // Save task to localStorage and get the task object
        const task = saveTask(taskText, priority);
        const taskId = task.id;
    
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${priority}`;
        taskCard.dataset.taskId = taskId;
    
        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-priority priority-${priority}">${priority}</span>
                <span class="task-text">${taskText}</span>
            </div>
            <button class="icon-button check-icon" title="Mark as done">
                <i class="fas fa-check"></i>
            </button>
            <button class="icon-button trash-icon" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        `;
    
        todoList.appendChild(taskCard);
        todoInput.value = '';
    
        // Toggle completed state and give rewards when completed
        const checkButton = taskCard.querySelector('.check-icon');
        checkButton.addEventListener('click', function () {
            if (!taskCard.classList.contains('completed')) {
                taskCard.classList.add('completed');
                
                // Update the task's completed status in localStorage
                updateTaskCompletionStatus(taskId, true);
    
                // Add rewards - food and water based on priority
                let foodReward = 1;
                let waterReward = 1;
                let coinsToAdd = 1;
    
                // Higher priority tasks give more rewards
                switch (priority) {
                    case 'low':
                        foodReward = 1;
                        waterReward = 1;
                        coinsToAdd = 1;
                        break;
                    case 'medium':
                        foodReward = 2;
                        waterReward = 2;
                        coinsToAdd = 3;
                        break;
                    case 'high':
                        foodReward = 3;
                        waterReward = 3;
                        coinsToAdd = 5;
                        break;
                }
    
                // Update duck rewards
                duckRewards.feedCount += foodReward;
                duckRewards.drinkCount += waterReward;
                updateDuckRewards();
    
                // Update coins in game state
                gameState.quackerCoins = (gameState.quackerCoins || 0) + coinsToAdd;
                updateGameState();
    
                // Update streak system
                updateStreak();
    
                // Show reward notification with coins
                showRewardNotification(foodReward, waterReward, coinsToAdd);
            }
        });
    
        // Delete task
        const deleteBtn = taskCard.querySelector('.trash-icon');
        deleteBtn.addEventListener('click', function () {
            // Remove task from localStorage
            removeTask(taskId);
            
            // Add a fade-out animation before removing
            taskCard.style.transition = 'opacity 0.3s ease';
            taskCard.style.opacity = '0';
            setTimeout(() => {
                taskCard.remove();
            }, 300);
        });
    }
    
    // Function to update task completion status
    function updateTaskCompletionStatus(taskId, completed) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId, 10));
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem('taskList', JSON.stringify(tasks));
        }
    }
    
    // Function to remove a task from localStorage
    function removeTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const updatedTasks = tasks.filter(task => task.id !== parseInt(taskId, 10));
        localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    }
    
    // When the page loads, load existing tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        
        // Filter for today's tasks
        const today = formatDateForDataset(new Date());
        const todaysTasks = tasks.filter(task => task.date === today);
        
        // Clear the existing tasks in the list
        if (todoList) {
            todoList.innerHTML = '';
        }
        
        todaysTasks.forEach(task => {
            if (!todoList) return; // Safety check
            
            const taskCard = document.createElement('div');
            taskCard.className = `task-card priority-${task.priority}`;
            if (task.completed) {
                taskCard.classList.add('completed');
            }
            taskCard.dataset.taskId = task.id;
    
            taskCard.innerHTML = `
                <div class="task-content">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="icon-button check-icon" title="Mark as done">
                    <i class="fas fa-check"></i>
                </button>
                <button class="icon-button trash-icon" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            `;
    
            todoList.appendChild(taskCard);
            
            // Add event listeners for check and delete buttons
            const checkButton = taskCard.querySelector('.check-icon');
            checkButton.addEventListener('click', function () {
                if (!taskCard.classList.contains('completed')) {
                    taskCard.classList.add('completed');
                    updateTaskCompletionStatus(task.id, true);
                    
                    // Add appropriate rewards
                    let foodReward = 1;
                    let waterReward = 1;
                    let coinsToAdd = 1;
    
                    switch (task.priority) {
                        case 'low':
                            foodReward = 1;
                            waterReward = 1;
                            coinsToAdd = 1;
                            break;
                        case 'medium':
                            foodReward = 2;
                            waterReward = 2;
                            coinsToAdd = 3;
                            break;
                        case 'high':
                            foodReward = 3;
                            waterReward = 3;
                            coinsToAdd = 5;
                            break;
                    }
    
                    duckRewards.feedCount += foodReward;
                    duckRewards.drinkCount += waterReward;
                    updateDuckRewards();
    
                    gameState.quackerCoins = (gameState.quackerCoins || 0) + coinsToAdd;
                    updateGameState();
    
                    updateStreak();
                    showRewardNotification(foodReward, waterReward, coinsToAdd);
                }
            });
    
            const deleteBtn = taskCard.querySelector('.trash-icon');
            deleteBtn.addEventListener('click', function () {
                removeTask(task.id);
                taskCard.style.transition = 'opacity 0.3s ease';
                taskCard.style.opacity = '0';
                setTimeout(() => {
                    taskCard.remove();
                }, 300);
            });
        });
    }
    
    function showRewardNotification(foodReward, waterReward, coinsAwarded) {
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div>Task Completed!</div>
            <div>Reward: <span class="reward-icon">🍞</span> +${foodReward} <span class="reward-icon">💧</span> +${waterReward} <span class="reward-icon">🪙</span> +${coinsAwarded}</div>
        `;

        document.body.appendChild(notification);

        // Animate notification appearance
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove notification after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Duck interactivity
    duckPetSection.addEventListener('click', function (e) {
        // Make duck "jump" with animation
        duck.style.transition = 'transform 0.3s ease-out';
        duck.style.transform = 'translateY(-20px)';

        // Create ripple effect in the pond
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '40px';
        ripple.style.height = '40px';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.zIndex = '1';
        ripple.style.animation = 'ripple 1s ease-out';

        // Position ripple near the duck
        const duckRect = duck.getBoundingClientRect();
        const sectionRect = duckPetSection.getBoundingClientRect();
        ripple.style.left = `${(duckRect.left + duckRect.width / 2) - sectionRect.left - 20}px`;
        ripple.style.top = `${(duckRect.bottom) - sectionRect.top - 10}px`;

        duckPetSection.appendChild(ripple);

        // Return duck to original position
        setTimeout(() => {
            duck.style.transform = 'translateY(0)';
        }, 300);

        // Remove ripple after animation
        setTimeout(() => {
            duckPetSection.removeChild(ripple);
        }, 1000);
    });

    // Streak tracking system
    let streakData = JSON.parse(localStorage.getItem('taskStreakData')) || {
        currentStreak: 0,
        lastCompletedDate: null,
        streakHistory: {},  // Format: { "YYYY-MM-DD": tasksCompleted }
    };

    // Function to update streak when task is completed
    function updateStreak() {
        const today = new Date();
        const formattedDate = formatDateString(today);
        
        // Initialize today's count if it doesn't exist
        if (!streakData.streakHistory[formattedDate]) {
            streakData.streakHistory[formattedDate] = 0;
        }
        
        // Increment today's completion count
        streakData.streakHistory[formattedDate]++;
        
        // Check if this is the first completion today
        if (streakData.streakHistory[formattedDate] === 1) {
            // If we have a last completed date
            if (streakData.lastCompletedDate) {
                const lastDate = new Date(streakData.lastCompletedDate);
                const dayDifference = getDayDifference(lastDate, today);
                
                // If yesterday's tasks were completed, increment streak
                if (dayDifference === 1) {
                    streakData.currentStreak++;
                } 
                // If today's date (already completed some tasks today)
                else if (dayDifference === 0) {
                    // Streak already counted, do nothing
                } 
                // If more than one day has passed, reset streak
                else {
                    streakData.currentStreak = 1; // Starting new streak
                }
            } else {
                // First ever task completion
                streakData.currentStreak = 1;
            }
            
            // Update last completed date to today
            streakData.lastCompletedDate = formattedDate;
        }
        
        // Save updated streak data
        localStorage.setItem('taskStreakData', JSON.stringify(streakData));
        
        // Update UI to show current streak
        updateStreakDisplay();
        
        // Update calendar to show streak
        markCalendarWithStreak();
    }
    
    // Helper function to calculate days between two dates
    function getDayDifference(date1, date2) {
        // Convert both dates to midnight UTC to compare just the days
        const d1 = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()));
        const d2 = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()));
        
        // Calculate the difference in milliseconds and convert to days
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    // Helper function to format date as YYYY-MM-DD
    function formatDateString(date) {
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    }
    
    // Function to update streak display in UI
    function updateStreakDisplay() {
        // Create streak display if it doesn't exist
        let streakDisplay = document.getElementById('streakDisplay');
        
        if (!streakDisplay) {
            streakDisplay = document.createElement('div');
            streakDisplay.id = 'streakDisplay';
            streakDisplay.className = 'streak-display';
            
            // Insert after duck-header
            const duckHeader = document.querySelector('.duck-header');
            if (duckHeader) {
                duckHeader.parentNode.insertBefore(streakDisplay, duckHeader.nextSibling);
            }
        }
        
        // Update streak display content
        if (streakDisplay) {
            streakDisplay.innerHTML = `
                <div class="streak-count">
                    <i class="fas fa-fire"></i> 
                    <span>${streakData.currentStreak}</span> day streak
                </div>
            `;
        }
    }
    
    // Function to mark calendar days with streak information
    function markCalendarWithStreak() {
        const calendarDays = document.querySelectorAll('.calendar-days div');
        
        // Add streak markers to calendar
        calendarDays.forEach(dayElement => {
            // Only process elements that have a date attribute
            if (dayElement.dataset && dayElement.dataset.date) {
                const dateString = dayElement.dataset.date;
                
                // Check if this date has completed tasks
                if (streakData.streakHistory[dateString] && streakData.streakHistory[dateString] > 0) {
                    // If no streak indicator exists, create one
                    let streakIndicator = dayElement.querySelector('.streak-indicator');
                    
                    if (!streakIndicator) {
                        streakIndicator = document.createElement('div');
                        streakIndicator.className = 'streak-indicator';
                        dayElement.appendChild(streakIndicator);
                    }
                    
                    // Set completion count
                    streakIndicator.textContent = streakData.streakHistory[dateString];
                }
            }
        });
    }
    
    // Function to check if streak is broken
    function checkStreakBreak() {
        if (!streakData.lastCompletedDate) return; // No streak to break
        
        const today = new Date();
        const lastDate = new Date(streakData.lastCompletedDate);
        const formattedToday = formatDateString(today);
        
        // Don't check for the current day
        if (formatDateString(lastDate) === formattedToday) return;
        
        // Check if we missed a day (more than 1 day since last completion)
        const dayDifference = getDayDifference(lastDate, today);
        
        if (dayDifference > 1 && streakData.currentStreak > 0) {
            // Streak is broken
            showStreakBrokenNotification(streakData.currentStreak);
            
            // Reset streak
            streakData.currentStreak = 0;
            
            // Save updated streak data
            localStorage.setItem('taskStreakData', JSON.stringify(streakData));
            
            // Update UI
            updateStreakDisplay();
        }
    }
    
    // Function to show streak broken notification
    function showStreakBrokenNotification(brokenStreak) {
        const notification = document.createElement('div');
        notification.className = 'streak-notification';
        notification.innerHTML = `
            <div>Streak Broken!</div>
            <div>Your ${brokenStreak} day streak has been reset. Complete a task today to start a new streak!</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification appearance
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Initialize calendar
    renderCalendar();
    
    // Update UI when the page loads
    updateStreakDisplay();
    checkStreakBreak();
    
    // Load tasks when page loads
    loadTasks();
});
