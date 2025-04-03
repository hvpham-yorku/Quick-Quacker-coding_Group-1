// Game state
let gameState = {
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

// Get duck rewards from localStorage
let duckRewards = JSON.parse(localStorage.getItem('duckRewards')) || {
    feedCount: 0,
    drinkCount: 0
};

// Get task completion data from localStorage
let taskData = JSON.parse(localStorage.getItem('taskData')) || {
    completedTasks: []
};

// Load game state from local storage if available
const savedState = localStorage.getItem('duckPetGame');
if (savedState) {
    try {
        const parsedState = JSON.parse(savedState);
        
        // Make sure new achievements are added to the loaded state
        if (parsedState.achievements && !parsedState.achievements.hasOwnProperty('playedWithDuck20Times')) {
            parsedState.achievements.playedWithDuck20Times = false;
        }
        if (parsedState.achievements && !parsedState.achievements.hasOwnProperty('reachedLevel5')) {
            parsedState.achievements.reachedLevel5 = false;
        }
        
        gameState = parsedState;
    } catch (e) {
        console.error("Error loading saved game:", e);
    }
}

// DOM Elements
const duckNameDisplay = document.getElementById('duckNameDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const xpDisplay = document.getElementById('xpDisplay');
const xpBar = document.getElementById('xpBar');
const duck = document.getElementById('duck');
const duckHead = document.getElementById('duckHead');
const duckWing = document.getElementById('duckWing');
const foodEmoji = document.getElementById('foodEmoji');
const waterEmoji = document.getElementById('waterEmoji');
const levelUp = document.getElementById('levelUp');
const mood = document.getElementById('mood');
const feedCountDisplay = document.getElementById('feedCount');
const waterCountDisplay = document.getElementById('waterCount');
const achievementsBtn = document.getElementById('achievementsBtn');
const gameArea = document.getElementById('gameArea');
const settingsBtn = document.querySelector('.settings');
const settingsModal = document.getElementById('settingsModal');
const achievementsModal = document.getElementById('achievementsModal');
const closeModalBtn = document.getElementById('closeModal');
const closeAchievementsBtn = document.getElementById('closeAchievements');
const duckNameInput = document.getElementById('duckName');
const saveSettingsBtn = document.getElementById('saveSettings');
const achievement1 = document.getElementById('achievement1');
const achievement2 = document.getElementById('achievement2');
const achievement3 = document.getElementById('achievement3');
const achievement4 = document.getElementById('achievement4');
const achievement5 = document.getElementById('achievement5');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const coinDisplay = document.getElementById('coinDisplay');

// Initialize the game
updateUI();
showMood();

// Auto-save every minute
setInterval(saveGame, 60000);

// Event Listeners
document.getElementById('feedBtn').addEventListener('click', feedDuck);
document.getElementById('waterBtn').addEventListener('click', giveDuckWater);
document.getElementById('playBtn').addEventListener('click', playWithDuck);
achievementsBtn.addEventListener('click', openAchievements);

settingsBtn.addEventListener('click', openSettings);
closeModalBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);
closeAchievementsBtn.addEventListener('click', closeAchievements);

// Sidebar toggle event listener
sidebarToggle.addEventListener('click', toggleSidebar);

// Navigation event listeners for active state
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Only prevent default if it's the Duck Pet link that's already active
        if (item.href.includes('Duck Virtual Pet.html') && item.classList.contains('active')) {
            e.preventDefault();
        }
        
        // Remove active class from all items
        navItems.forEach(ni => ni.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// Occasionally make the duck do something on its own
setInterval(() => {
    if (Math.random() < 0.3) {
        const actions = [moveRandomly, flapWings, nodHead];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
    }
}, 8000);

// Functions
function feedDuck() {
    if (duckRewards.feedCount <= 0) {
        showMood("No food available! Complete tasks to earn food.");
        return;
    }

    // Show and animate the falling bread emoji
    foodEmoji.style.opacity = '1';
    foodEmoji.style.animation = 'fallDown 1s forwards';
    duck.style.left = '30%';

    setTimeout(() => {
        duckHead.style.animation = 'bounce 0.5s';
        foodEmoji.style.opacity = '0';
        foodEmoji.style.animation = 'none';

        // Decrease feed count
        duckRewards.feedCount--;
        localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
        
        gameState.feedCount++;
        addXP(15); // Add XP for feeding

        checkAchievements();
        updateUI(); // Update UI immediately

        setTimeout(() => {
            duck.style.left = '50%';
            duckHead.style.animation = '';
            showMood("Yum!");
        }, 1000);
    }, 1000);

    gameState.lastInteraction = Date.now();
    saveGame();
}

function giveDuckWater() {
    if (duckRewards.drinkCount <= 0) {
        showMood("No water available! Complete tasks to earn water.");
        return;
    }

    // Show and animate the falling water drop emoji
    waterEmoji.style.opacity = '1';
    waterEmoji.style.animation = 'fallDown 1s forwards';
    duck.style.left = '70%';

    setTimeout(() => {
        duckHead.style.animation = 'bounce 0.5s';
        waterEmoji.style.opacity = '0';
        waterEmoji.style.animation = 'none';

        createRipple(70);

        // Decrease drink count
        duckRewards.drinkCount--;
        localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
        
        gameState.waterCount++;
        addXP(10); // Add XP for drinking

        checkAchievements();
        updateUI(); // Update UI immediately

        setTimeout(() => {
            duck.style.left = '50%';
            duckHead.style.animation = '';
            showMood("Refreshing!");
        }, 1000);
    }, 1000);

    gameState.lastInteraction = Date.now();
    saveGame();
}

function playWithDuck() {
    // Randomly choose an action
    const actions = [moveRandomly, flapWings, nodHead];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
    
    // Add XP
    addXP(5);
    
    // Update play count
    gameState.playCount++;
    
    // Update mood
    showMood("Whee! Fun!");
    
    // Check achievements
    checkAchievements();
    
    // Update UI
    updateUI();
    
    // Save game
    gameState.lastInteraction = Date.now();
    saveGame();
}

function addXP(amount) {
    gameState.xp += amount;
    
    // Check for level up
    if (gameState.xp >= gameState.xpToNextLevel) {
        levelUp.style.opacity = '1';
        levelUp.style.transform = 'translateX(-50%) translateY(-20px)';
        
        gameState.level++;
        gameState.xp = gameState.xp - gameState.xpToNextLevel;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
        
        // Check for achievements
        checkAchievements();
        
        setTimeout(() => {
            levelUp.style.opacity = '0';
            levelUp.style.transform = 'translateX(-50%)';
        }, 2000);
    }
    
    updateUI(); // Update UI to show XP changes
}


function updateUI() {
    // Update duck name
    duckNameDisplay.textContent = gameState.duckName;
    
    // Update level and XP
    levelDisplay.textContent = gameState.level;
    xpDisplay.textContent = `${gameState.xp}/${gameState.xpToNextLevel}`;
    xpBar.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;
    
    // Update feed and water counts from rewards
    feedCountDisplay.textContent = duckRewards.feedCount;
    waterCountDisplay.textContent = duckRewards.drinkCount;
    
    // Quacker Coins display
    coinDisplay.textContent = gameState.quackerCoins;

    // Update achievement indicators
    updateAchievementDisplay();
    
    // Make sure wings are visible
    duckWing.style.display = 'block';
    duckWing.style.opacity = '1';
}

function addQuackerCoins(priority) {
    let coinsToAdd = 0;
    
    switch(priority) {
        case 'low':
            coinsToAdd = 1;
            break;
        case 'medium':
            coinsToAdd = 3;
            break;
        case 'high':
            coinsToAdd = 5;
            break;
        default:
            coinsToAdd = 1;
    }
    
    gameState.quackerCoins += coinsToAdd;
    updateUI();
    showMood(`Earned ${coinsToAdd} Quacker Coins!`);
    saveGame();
}

function saveGame() {
    localStorage.setItem('duckPetGame', JSON.stringify(gameState));
}

function showMood(moodText) {
    if (moodText) {
        mood.textContent = moodText;
        mood.style.opacity = '1';
        
        setTimeout(() => {
            mood.style.opacity = '0';
        }, 2000);
    }
}

function createRipple(xPosition) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${xPosition}%`;
    gameArea.appendChild(ripple);
    
    // Trigger animation
    setTimeout(() => {
        ripple.style.animation = 'ripple 1.5s forwards';
        
        // Clean up after animation
        setTimeout(() => {
            gameArea.removeChild(ripple);
        }, 1500);
    }, 10);
}

function moveRandomly() {
    const currentPos = parseFloat(getComputedStyle(duck).left) / gameArea.offsetWidth * 100;
    const newPos = Math.min(Math.max(currentPos + (Math.random() * 40 - 20), 10), 90);
    
    duck.style.left = `${newPos}%`;
    duck.style.transition = 'left 1s ease';
    
    // Reset transition after movement
    setTimeout(() => {
        duck.style.transition = '';
    }, 1000);
}

function flapWings() {
    // Make sure wing is visible
    duckWing.style.display = 'block';
    duckWing.style.opacity = '1';
    
    // Apply the flapping animation
    duckWing.style.animation = 'flap 0.3s ease-in-out 3';
    
    // Clean up after animation
    setTimeout(() => {
        duckWing.style.animation = '';
    }, 900);
}

function nodHead() {
    duckHead.style.animation = 'bounce 0.5s ease-in-out 2';
    
    // Clean up after animation
    setTimeout(() => {
        duckHead.style.animation = '';
    }, 1000);
}

function checkAchievements() {
    // Check for Level 2 achievement
    if (gameState.level >= 2 && !gameState.achievements.reachedLevel2) {
        gameState.achievements.reachedLevel2 = true;
        showMood("Achievement: First Steps!");
    }
    
    // Check for Level 5 achievement
    if (gameState.level >= 5 && !gameState.achievements.reachedLevel5) {
        gameState.achievements.reachedLevel5 = true;
        showMood("Achievement: Master Caretaker!");
    }
    
    // Check for fed 10 times achievement
    if (gameState.feedCount >= 10 && !gameState.achievements.fed10Times) {
        gameState.achievements.fed10Times = true;
        showMood("Achievement: Well Fed!");
    }
    
    // Check for watered 10 times achievement
    if (gameState.waterCount >= 10 && !gameState.achievements.watered10Times) {
        gameState.achievements.watered10Times = true;
        showMood("Achievement: Hydrated!");
    }
    
    // Check for played 20 times achievement
    if (gameState.playCount >= 20 && !gameState.achievements.playedWithDuck20Times) {
        gameState.achievements.playedWithDuck20Times = true;
        showMood("Achievement: Duck Whisperer!");
    }
    
    // Update achievement display
    updateAchievementDisplay();
}

function updateAchievementDisplay() {
    // Update the visual state of achievement elements
    if (gameState.achievements.reachedLevel2) {
        achievement1.classList.add('unlocked');
    }
    if (gameState.achievements.fed10Times) {
        achievement2.classList.add('unlocked');
    }
    if (gameState.achievements.watered10Times) {
        achievement3.classList.add('unlocked');
    }
    if (gameState.achievements.playedWithDuck20Times) {
        achievement4.classList.add('unlocked');
    }
    if (gameState.achievements.reachedLevel5) {
        achievement5.classList.add('unlocked');
    }
}

function openSettings() {
    settingsModal.style.display = 'flex';
    duckNameInput.value = gameState.duckName;
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function saveSettings() {
    // Update duck name
    gameState.duckName = duckNameInput.value.trim() || "Mr. Quackers";
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
    
    // Close modal
    closeSettings();
    
    // Show confirmation
    showMood("Settings saved!");
}

function openAchievements() {
    achievementsModal.style.display = 'flex';
}

function closeAchievements() {
    achievementsModal.style.display = 'none';
}

function toggleSidebar() {
    sidebar.classList.toggle('expanded');
    
    // Adjust main content margin if needed
    if (sidebar.classList.contains('expanded')) {
        document.querySelector('.game-container').style.marginLeft = '240px';
    } else {
        document.querySelector('.game-container').style.marginLeft = '60px';
    }
    
    // Fix for sidebar display issues
    sidebar.style.display = 'block';
    
    // Show sidebar header when expanded
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.style.display = sidebar.classList.contains('expanded') ? 'block' : 'none';
    }
    
    // Show nav text when expanded
    const navTexts = document.querySelectorAll('.nav-text');
    navTexts.forEach(text => {
        text.style.display = sidebar.classList.contains('expanded') ? 'inline' : 'none';
    });
}

// Initialize the sidebar state
function initializeSidebar() {
    // Start with collapsed sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('expanded');
        document.querySelector('.game-container').style.marginLeft = '50px';
    }
    
    // Ensure sidebar is visible
    sidebar.style.display = 'block';
    
    // Show/hide sidebar header based on expanded state
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.style.display = sidebar.classList.contains('expanded') ? 'block' : 'none';
    }
    
    // Show/hide nav text based on expanded state
    const navTexts = document.querySelectorAll('.nav-text');
    navTexts.forEach(text => {
        text.style.display = sidebar.classList.contains('expanded') ? 'inline' : 'none';
    });
}

// Call initialize sidebar on load
initializeSidebar();

// Handle window resize for responsive sidebar
window.addEventListener('resize', initializeSidebar);

// Add a function to add food/water rewards (for demonstration/testing)
function addRewards(foodAmount, waterAmount) {
    duckRewards.feedCount += foodAmount;
    duckRewards.drinkCount += waterAmount;
    localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
    updateUI();
    showMood("Rewards added!");
}

// Function to handle task completion
function completeTask(taskId, priority) {
    // Only process if the task isn't already completed
    if (!taskData.completedTasks.includes(taskId)) {
        // Add task to completed tasks
        taskData.completedTasks.push(taskId);
        
        // Add rewards based on priority
        let foodReward = 1;
        let waterReward = 1;
        
        // Higher priority tasks give more rewards
        if (priority === 'medium') {
            foodReward = 2;
            waterReward = 2;
        } else if (priority === 'high') {
            foodReward = 3;
            waterReward = 3;
        }
        
        // Add food and water rewards
        duckRewards.feedCount += foodReward;
        duckRewards.drinkCount += waterReward;
        
        // Add Quacker Coins based on priority
        addQuackerCoins(priority);
        
        // Save to localStorage
        localStorage.setItem('taskData', JSON.stringify(taskData));
        localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
        
        // Update UI
        updateUI();
        
        return true;
    }
    return false;
}

// Function to reset completed tasks (for a new day)
function resetCompletedTasks() {
    taskData.completedTasks = [];
    localStorage.setItem('taskData', JSON.stringify(taskData));
}

// Check for day change and reset tasks if needed
function checkDayChange() {
    const lastDate = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
        resetCompletedTasks();
        localStorage.setItem('lastActiveDate', today);
    }
}

// Run day change check on load
checkDayChange();

// Expose the completeTask function for other pages to use
window.duckRewardSystem = {
    completeTask: completeTask,
    addQuackerCoins: addQuackerCoins
};