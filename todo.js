const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

//Add close button to sidebar toggle
sidebarToggle.innerHTML = '<span class="sidebar-close">X</span>';
const sidebarClose = document.querySelector('.sidebar-close');

//Toggle sidebar on menu button click
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
});

//Close sidebar on close button click
sidebarClose.addEventListener('click', () => {
  e.stopPropagation();// Prevent triggering the toggle event 
  sidebar.classList.remove('expanded');
});

 // To-Do List functionality with rewards system
 const todoInput = document.getElementById('todoInput');
 const prioritySelect = document.getElementById('prioritySelect');
 const addTodoBtn = document.getElementById('addTodo');
 const todoList = document.getElementById('todoList');

 function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === '') return;

  taskCount++;
  const priority = prioritySelect.value;
  const taskId = 'task-' + Date.now(); // Create unique ID for this task

  const taskCard = document.createElement('div');
  taskCard.className = `task-card priority-${priority}`;
  taskCard.dataset.taskId = taskId; // Store task ID in the DOM element

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

  document.getElementsById('sortTodo').addEventListener('click', function () {
    // Example tasks array (replace with your actual task data structure))
    const tasks = Array.from(todoList.children).map(task => ({
        element: task,
        priority: task.querySelector('.task-priority').innerText
    }));

    // Sort tasks based on priority (you can customize the sorting logic)
    tasks.sort((a, b) => {
        const priorityOrder = ['low', 'medium', 'high'];
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });

    // Sort tasks based on date added (you can customize the sorting logic)
    tasks.sort((a, b) => {
        return new Date(a.element.dataset.taskId) - new Date(b.element.dataset.taskId);
    });

    // Sort tasks based on completion status (you can customize the sorting logic)
    tasks.sort((a, b) => {
        return a.element.classList.contains('completed') - b.element.classList.contains('completed');
    });

    // Update the todo list with sorted tasks
    console.log('Sorted tasks:', tasks);
  });
}

addTodoBtn.addEventListener('click', addTask);