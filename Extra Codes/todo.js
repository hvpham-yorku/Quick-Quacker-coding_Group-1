document.addEventListener('DOMContentLoaded', function () {
    // Initialize the sidebar and its toggle button
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    //Add close button to sidebar toggle
    sidebarToggle.innerHTML = '<span class="sidebar-close">X</span>';
    const sidebarClose = document.querySelector('.sidebar-close');

    //Toggle sidebar on menu button click
    sidebarToggle.addEventListener('click', function(){
        sidebar.classList.toggle('expanded');
    });

    //Close sidebar on close button click
    sidebarClose.addEventListener('click', function(){
        e.stopPropagation();// Prevent triggering the toggle event 
        sidebar.classList.remove('expanded');
    });

    // To-Do List functionality with rewards system
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const progressSelect = document.getElementById('progressSelect');
    const typeSelect = document.getElementById('typeSelect');
    const addTodoBtn = document.getElementById('addTodo');
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

    function addTask() {
        const taskText = todoInput.value.trim();
        const taskDate = document.getElementById('dateInput').value; // Get current date
        const taskTime = document.getElementById('timeInput').value; // Get current time
        if (taskText === '' || taskDate === '') return;

        taskCount++;
        const priority = prioritySelect.value;
        const progress = progressSelect.value;
        const type = typeSelect.value;
        const taskId = 'task-' + Date.now(); // Create unique ID for this task

        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${priority}`;
        taskCard.dataset.taskId = taskId; // Store task ID in the DOM element

        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-priority priority-${priority}">${priority}</span>
                <span class="task-type">${type}</span>
                <span class="task-text">${taskText}</span>
                <span class="task-date">${taskDate} ${taskTime}</span>
                <select class="task-progress">
                    <option value="Not-Started" ${progress === 'Not Started' ? 'selected' : ''}>Not Started</option>
                    <option value="in-Progress" ${progress === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${progress === 'Completed' ? 'selected' : ''}>Completed</option>
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
        todoInput.value = '';
        document.getElementById('dateInput').value = ''; // Clear the date input
        document.getElementById('timeInput').value = ''; // Clear the time input

        // Toggle completed state and give rewards when completed
        const checkButton = taskCard.querySelector('.check-icon');
        checkButton.addEventListener('click', function () {
            const progressDropdown = taskCard.querySelector('.task-progress');
            if (progressDropdown.value === 'Completed' && !taskCard.classList.contains('completed')) {
                // Mark task as completed
                taskCard.classList.add('completed');
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

                // Delete the task after marking it as completed
                setTimeout(() => {
                    taskCard.style.transition = 'opacity 0.3s ease';
                    taskCard.style.opacity = '0';
                    setTimeout(() => {
                        taskCard.remove();
                    }, 300);
                }, 1000); // Delay to allow the user to see the completed state

                
        }
    });

    // Delete task
    const deleteBtn = taskCard.querySelector('.trash-icon');
    deleteBtn.addEventListener('click', function () {
        // Add a fade-out animation before removing
        taskCard.style.transition = 'opacity 0.3s ease';
        taskCard.style.opacity = '0';
        setTimeout(() => {
            taskCard.remove();
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

    addTodoBtn.addEventListener('click', addTask);
});
