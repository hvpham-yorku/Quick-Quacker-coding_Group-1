document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    // Toggle sidebar on hamburger menu click
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
    });
    
    // Close sidebar when X button is clicked
    sidebarClose.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the toggle event
        sidebar.classList.remove('expanded');
    });

    // Calendar functionality
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthDisplay = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const selectedDateDisplay = document.getElementById('selectedDate');
    const eventsList = document.getElementById('eventsList');
    
    // Get current date and set it as initial selected date
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let selectedDate = new Date(currentDate);

    // Load events from localStorage
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Clean expired tasks
    cleanExpiredTasks();

    // Initialize the calendar
    renderCalendar();
    updateSelectedDate();
    displayEvents();

    // Event listeners for navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Function to clean expired tasks
    function cleanExpiredTasks() {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const today = formatDateForDataset(new Date());
        
        // Filter out tasks with dates before today
        const currentTasks = tasks.filter(task => {
            return task.date >= today;
        });
        
        // Update localStorage with current tasks only
        localStorage.setItem('taskList', JSON.stringify(currentTasks));
    }
    
    // Function to render the calendar
    function renderCalendar() {
        calendarDays.innerHTML = '';
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        // Get number of days in the month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Get number of days in previous month
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // Calculate total cells needed (previous month days + current month days + next month days)
        const totalCells = 42; // 6 rows of 7 days
        
        // Create cells for days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayElement = document.createElement('div');
            const prevMonthDay = daysInPrevMonth - firstDayOfMonth + i + 1;
            dayElement.textContent = prevMonthDay;
            dayElement.className = 'calendar-day different-month';
            
            // Calculate the date for this cell
            const cellDate = new Date(currentYear, currentMonth - 1, prevMonthDay);
            dayElement.dataset.date = formatDateForDataset(cellDate);
            
            // Check if this day has events
            if (hasEvents(cellDate)) {
                const indicator = document.createElement('div');
                indicator.className = 'day-event-indicator';
                dayElement.appendChild(indicator);
            }
            
            // Add task indicators with priority colors
            addTaskIndicators(dayElement, cellDate);
            
            dayElement.addEventListener('click', function() {
                selectDate(cellDate);
            });
            
            calendarDays.appendChild(dayElement);
        }
        
        // Create cells for days in current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'calendar-day';
            
            // Calculate the date for this cell
            const cellDate = new Date(currentYear, currentMonth, day);
            dayElement.dataset.date = formatDateForDataset(cellDate);
            
            // Highlight current day
            if (day === currentDate.getDate() && 
                currentMonth === currentDate.getMonth() && 
                currentYear === currentDate.getFullYear()) {
                dayElement.classList.add('current-day');
            }
            
            // Highlight selected day
            if (day === selectedDate.getDate() && 
                currentMonth === selectedDate.getMonth() && 
                currentYear === selectedDate.getFullYear()) {
                dayElement.classList.add('selected');
            }
            
            // Check if this day has events
            if (hasEvents(cellDate)) {
                const indicator = document.createElement('div');
                indicator.className = 'day-event-indicator';
                dayElement.appendChild(indicator);
            }
            
            // Add task indicators with priority colors
            addTaskIndicators(dayElement, cellDate);
            
            dayElement.addEventListener('click', function() {
                selectDate(cellDate);
            });
            
            calendarDays.appendChild(dayElement);
        }
        
        // Calculate how many next month days to show
        const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
        
        // Create cells for days from next month
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.className = 'calendar-day different-month';
            
            // Calculate the date for this cell
            const cellDate = new Date(currentYear, currentMonth + 1, i);
            dayElement.dataset.date = formatDateForDataset(cellDate);
            
            // Check if this day has events
            if (hasEvents(cellDate)) {
                const indicator = document.createElement('div');
                indicator.className = 'day-event-indicator';
                dayElement.appendChild(indicator);
            }
            
            // Add task indicators with priority colors
            addTaskIndicators(dayElement, cellDate);
            
            dayElement.addEventListener('click', function() {
                selectDate(cellDate);
            });
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Function to add task indicators with priority colors
    function addTaskIndicators(dayElement, date) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const dateString = formatDateForDataset(date);
        const dayTasks = tasks.filter(task => task.date === dateString);
        
        if (dayTasks.length > 0) {
            // Group tasks by priority
            const priorities = ["low", "medium", "high"];
            const tasksByPriority = {};
            
            // Initialize priority groups
            priorities.forEach(priority => {
                tasksByPriority[priority] = [];
            });
            
            // Group tasks by priority
            dayTasks.forEach(task => {
                if (tasksByPriority[task.priority]) {
                    tasksByPriority[task.priority].push(task);
                }
            });
            
            // Create indicator container
            const indicatorContainer = document.createElement('div');
            indicatorContainer.className = 'task-indicators-container';
            indicatorContainer.style.display = 'flex';
            indicatorContainer.style.justifyContent = 'center';
            indicatorContainer.style.gap = '2px';
            indicatorContainer.style.marginTop = '2px';
            
            // Add indicators for each priority that has tasks
            priorities.forEach(priority => {
                if (tasksByPriority[priority].length > 0) {
                    const indicator = document.createElement('div');
                    indicator.className = `task-indicator ${priority}`;
                    // Use color classes from CSS
                    indicator.classList.add(`priority-${priority}`);
                    indicatorContainer.appendChild(indicator);
                }
            });
            
            dayElement.appendChild(indicatorContainer);
        }
    }
    
    // Function to select a date
    function selectDate(date) {
        // Update selected date
        selectedDate = date;
        
        // Remove 'selected' class from all days
        const days = document.querySelectorAll('.calendar-day');
        days.forEach(day => day.classList.remove('selected'));
        
        // Add 'selected' class to the selected day
        const selectedDay = document.querySelector(`.calendar-day[data-date="${formatDateForDataset(date)}"]`);
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
        
        // Update selected date display
        updateSelectedDate();
        
        // Display events for selected date
        displayEvents();
    }

    // Function to update selected date display
    function updateSelectedDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', options);
    }

    // Function to check if a date has events
    function hasEvents(date) {
        // Original event checking logic
        const hasCalendarEvents = events.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
        
        // Check for tasks
        const hasTaskEvents = hasTasks(date);
        
        // Return true if either calendar events or tasks exist for this date
        return hasCalendarEvents || hasTaskEvents;
    }

    // Function to check if a date has tasks
    function hasTasks(date) {
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const dateString = formatDateForDataset(date);
        
        return tasks.some(task => task.date === dateString);
    }

    // Function to display events for selected date
    function displayEvents() {
        eventsList.innerHTML = '';
        
        // Filter events for selected date
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === selectedDate.getDate() &&
                   eventDate.getMonth() === selectedDate.getMonth() &&
                   eventDate.getFullYear() === selectedDate.getFullYear();
        });
        
        // Get tasks for selected date
        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
        const dateString = formatDateForDataset(selectedDate);
        const dayTasks = tasks.filter(task => task.date === dateString);
        
        // Sort events by time
        dayEvents.sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
        });
        
        // If no events or tasks, show a message
        if (dayEvents.length === 0 && dayTasks.length === 0) {
            const noEvents = document.createElement('p');
            noEvents.textContent = 'No events or tasks for this day.';
            noEvents.style.padding = '15px';
            noEvents.style.textAlign = 'center';
            noEvents.style.color = '#555';
            eventsList.appendChild(noEvents);
            return;
        }
        
        // Show section header for tasks if there are any
        if (dayTasks.length > 0) {
            const tasksHeader = document.createElement('h3');
            tasksHeader.textContent = 'Tasks';
            tasksHeader.style.margin = '10px 0';
            tasksHeader.style.padding = '5px';
            tasksHeader.style.borderBottom = '1px solid #ddd';
            eventsList.appendChild(tasksHeader);
            
            // Create task cards
            dayTasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.className = `event-card task ${task.completed ? 'event-completed' : ''}`;
                
                const taskColor = document.createElement('div');
                // Use the task priority directly to set the color class
                const colorClass = task.completed ? `${task.priority}-completed` : task.priority;
                taskColor.className = `event-color ${colorClass}`;
                taskCard.appendChild(taskColor);
                
                const taskDetails = document.createElement('div');
                taskDetails.className = 'event-details';
                
                const taskTitle = document.createElement('div');
                taskTitle.className = 'event-title';
                taskTitle.textContent = task.text;
                taskDetails.appendChild(taskTitle);
                
                const taskPriority = document.createElement('div');
                taskPriority.className = 'task-priority';
                taskPriority.textContent = `Priority: ${task.priority}`;
                taskDetails.appendChild(taskPriority);
                
                taskCard.appendChild(taskDetails);
                
                // Add action buttons if needed
                if (!task.completed) {
                    const taskActions = document.createElement('div');
                    taskActions.className = 'event-actions';
                    
                    const completeBtn = document.createElement('button');
                    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
                    completeBtn.addEventListener('click', function() {
                        // Update task completion status
                        const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
                        const taskIndex = tasks.findIndex(t => t.id === task.id);
                        
                        if (taskIndex !== -1) {
                            tasks[taskIndex].completed = true;
                            localStorage.setItem('taskList', JSON.stringify(tasks));
                            
                            // Update UI
                            taskCard.classList.add('event-completed');
                            taskColor.className = `event-color ${task.priority}-completed`;
                            taskActions.remove(); // Remove action buttons
                            
                            // Re-render calendar to update indicators
                            renderCalendar();
                        }
                    });
                    taskActions.appendChild(completeBtn);
                    
                    taskCard.appendChild(taskActions);
                }
                
                eventsList.appendChild(taskCard);
            });
        }
        
        // Show section header for events if there are any
        if (dayEvents.length > 0) {
            const eventsHeader = document.createElement('h3');
            eventsHeader.textContent = 'Events';
            eventsHeader.style.margin = '10px 0';
            eventsHeader.style.padding = '5px';
            eventsHeader.style.borderBottom = '1px solid #ddd';
            eventsList.appendChild(eventsHeader);
            
            // Create event cards (read-only view)
            dayEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                
                const eventColor = document.createElement('div');
                eventColor.className = `event-color ${event.category}`;
                eventCard.appendChild(eventColor);
                
                const eventDetails = document.createElement('div');
                eventDetails.className = 'event-details';
                
                const eventTitle = document.createElement('div');
                eventTitle.className = 'event-title';
                eventTitle.textContent = event.title;
                eventDetails.appendChild(eventTitle);
                
                if (event.time) {
                    const eventTime = document.createElement('div');
                    eventTime.className = 'event-time';
                    eventTime.textContent = formatTime(event.time);
                    eventDetails.appendChild(eventTime);
                }
                
                if (event.description) {
                    const eventDescription = document.createElement('div');
                    eventDescription.className = 'event-description';
                    eventDescription.textContent = event.description;
                    eventDetails.appendChild(eventDescription);
                }
                
                eventCard.appendChild(eventDetails);
                eventsList.appendChild(eventCard);
            });
        }
    }

    // Helper function to format date for dataset
    function formatDateForDataset(date) {
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    }

    // Helper function to format time
    function formatTime(timeString) {
        if (!timeString) return '';
        
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (error) {
            return timeString;
        }
    }

    // Helper function to pad numbers with leading zero
    function padZero(num) {
        return num.toString().padStart(2, '0');
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

    // Add CSS styles for task indicators in calendar
    const style = document.createElement('style');
    style.innerHTML = `
        .task-indicators-container {
            display: flex;
            justify-content: center;
            gap: 2px;
            margin-top: 2px;
        }
        
        .task-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }
        
        .day-event-indicator {
            background-color: #3498db;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 2px;
            display: inline-block;
        }
        
        /* Priority colors for task indicators */
        .task-indicator.low, .priority-low {
            background-color: #8bc34a; /* Green */
        }
        
        .task-indicator.medium, .priority-medium {
            background-color: #ffc107; /* Yellow */
        }
        
        .task-indicator.high, .priority-high {
            background-color: #f44336; /* Red */
        }
        
        .event-completed {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
});