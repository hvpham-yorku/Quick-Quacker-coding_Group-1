document.addEventListener('DOMContentLoaded', function () {
    // Initialize the sidebar and its toggle button
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.querySelector('.sidebar-close');

    // Toggle sidebar on menu button click
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
    });

    // Close sidebar on close button click
    sidebarClose.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the toggle event 
        sidebar.classList.remove('expanded');
    });

    // To-Do List functionality with rewards system
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const progressSelect = document.getElementById('progressSelect');
    const typeSelect = document.getElementById('typeSelect');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const addTodoBtn = document.getElementById('addTodo');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const todoList = document.getElementById('todoList');

    let taskCount = 0; // Initialize task count

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

    // Load existing tasks from localStorage
    loadTasks();

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        todoList.innerHTML = '';
        
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }

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

    addTodoBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    function addTask() {
        const taskText = todoInput.value.trim();
        const taskDate = dateInput.value;
        const taskTime = timeInput.value;
        
        if (taskText === '' || taskDate === '') return;

        taskCount++;
        const priority = prioritySelect.value;
        const progress = progressSelect.value;
        const type = typeSelect.value;
        const taskId = 'task-' + Date.now(); // Create unique ID for this task

        // Create task object
        const task = {
            id: taskId,
            text: taskText,
            priority: priority,
            type: type,
            date: taskDate,
            time: taskTime,
            progress: progress,
            completed: progress === 'Completed'
        };

        // Save task to localStorage
        saveTask(task);
        
        // Create task element
        createTaskElement(task);

        // Clear inputs
        todoInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
    }

    function createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${task.priority}`;
        if (task.completed) {
            taskCard.classList.add('completed');
        }
        taskCard.dataset.taskId = task.id;

        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <span class="task-type">${task.type}</span>
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date} ${task.time}</span>
                <select class="task-progress">
                    <option value="Not Started" ${task.progress === 'Not Started' ? 'selected' : ''}>Not Started</option>
                    <option value="In Progress" ${task.progress === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.progress === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <button class="icon-button check-icon" title="Mark as done">
                <i class="fas fa-check"></i>
            </button>
            <button class="icon-button trash-icon" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        `;

        todoList.appendChild(taskCard);

        // Add change event listener to progress select
        const progressSelect = taskCard.querySelector('.task-progress');
        progressSelect.addEventListener('change', function() {
            updateTaskProgress(task.id, this.value);
            
            if (this.value === 'Completed') {
                completeTask(taskCard, task.priority);
            } else {
                // Remove completed class if task is not completed
                taskCard.classList.remove('completed');
            }
        });

        // Toggle completed state and give rewards when completed
        const checkButton = taskCard.querySelector('.check-icon');
        checkButton.addEventListener('click', function () {
            completeTask(taskCard, task.priority);
        });

        // Delete task
        const deleteBtn = taskCard.querySelector('.trash-icon');
        deleteBtn.addEventListener('click', function () {
            deleteTask(task.id, taskCard);
        });
    }

    function completeTask(taskCard, priority) {
        // Add completed class
        taskCard.classList.add('completed');
        
        // Update progress select to "Completed"
        const progressSelect = taskCard.querySelector('.task-progress');
        progressSelect.value = 'Completed';
        
        // Update task in localStorage
        const taskId = taskCard.dataset.taskId;
        updateTaskProgress(taskId, 'Completed');
        
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

        // Show reward notification with coins
        showRewardNotification(foodReward, waterReward, coinsToAdd);
    }

    function updateTaskProgress(taskId, progress) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].progress = progress;
            tasks[taskIndex].completed = progress === 'Completed';
            localStorage.setItem('taskList', JSON.stringify(tasks));
        }
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        tasks.push(task);
        localStorage.setItem('taskList', JSON.stringify(tasks));
    }

    function deleteTask(taskId, taskCard) {
        // Add a fade-out animation before removing
        taskCard.style.transition = 'opacity 0.3s ease';
        taskCard.style.opacity = '0';
        
        setTimeout(() => {
            taskCard.remove();
            
            // Remove from localStorage
            const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('taskList', JSON.stringify(updatedTasks));
        }, 300);
    }

    function clearCompletedTasks() {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const updatedTasks = tasks.filter(task => !task.completed);
        localStorage.setItem('taskList', JSON.stringify(updatedTasks));
        
        // Remove completed tasks from UI with animation
        const completedTaskCards = document.querySelectorAll('.task-card.completed');
        completedTaskCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
            }, 300);
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

    // Setup logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Clear any stored login state or user data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('username');
            
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // Add CSS styles for reward notification if not already in your CSS file
    const style = document.createElement('style');
    style.innerHTML = `
        .reward-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .reward-icon {
            font-size: 1.2em;
            margin: 0 3px;
        }
    `;
    document.head.appendChild(style);
});
