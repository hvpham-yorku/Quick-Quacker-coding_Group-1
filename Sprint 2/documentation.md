# Quick Quacker

Quick Quacker is a gamified task manager that combines productivity with pet care. Complete tasks, earn in-game rewards, and care for your virtual duck by feeding, watering, and customizing it. Keep your streaks alive and watch your duck evolve with you.

TRY IT ---> https://82b9-70-30-141-96.ngrok-free.app/ 
---

## Overview

Quick Quacker is designed to help users stay organized and motivated with a touch of fun. With every completed task, your duck earns food, water, and coins. These rewards help your duck grow happier and more stylish over time.

---

## Features

### Tasks
- Create, complete, and delete tasks
- Tasks give points and in-game currency when completed

### Virtual Pet Duck
- Duck reacts to your productivity
- Evolves with XP and task streaks

### Calendar
- Visual layout of completed tasks
- Track activity with daily check-ins and consistency tracking

### Streak Tracker
- Tracks daily engagement
- Impacts duck's mood and boosts reward feedback

### Minigame
- "Duck Crossing" minigame with obstacles
- Earns in-game currency when completed successfully

### Duck Customization
- Can pick the ducks name
- Use in-game currency to choose duck color and gender
- Personalize your duck's appearance in the settings

### Feeding and Watering
- Earn food and water by completing tasks
- Feed and hydrate your duck to keep it happy

---

## Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | HTML, CSS, JavaScript |
| Backend     | PHP (hosted locally using XAMPP) |
| Database    | MariaDB (MySQL-compatible) |
| Deployment  | ngrok (local tunnel)

---

## Project Structure


| File               | Description                                  |
|--------------------|----------------------------------------------|
| `index.html`       | Login page                                   |
| `homepage.html`    | Main dashboard (calendar + task list)        |
| `Virtual_Pet.html` | Virtual duck pet UI                          |
| `profile.html`     | Profile view with stats and recent activity  |
| `game.html`        | Duck Crossing minigame                       |
| `Homepage.js`      | JavaScript logic for dashboard and tasks     |
| `Virtual_Pet.js`   | Duck interaction, state, XP, and feeding     |
| `profile.js`       | Streak calculations and profile updates      |
| `Homepage.css`     | Main dashboard styling                       |
| `Virtual_Pet.css`  | Duck and game styling                        |

---

## User Guide

1. Sign up or log in from the login page
2. Add tasks using the to-do list
3. Complete tasks to earn XP, food, water, and coins
4. Feed, water, and play with your duck
5. Track progress using the calendar and profile page
6. Earn coins through the minigame
7. Customize your duck's appearance with your rewards

---

## Database Schema

This project uses a single table to store user login information.

### Table: `users`

| Column Name | Data Type | Description                         |
|-------------|-----------|-------------------------------------|
| `id`        | INT       | Primary key, auto-incremented       |
| `username`  | VARCHAR   | Unique username for login           |
| `email`     | VARCHAR   | User's email address                |
| `password`  | VARCHAR   | Hashed password                     |
| `created_at`| TIMESTAMP | Time of registration (default now)  |

### Example SQL:

sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Installation & Local Setup

To run Quick Quacker locally on your machine:

### Prerequisites
- [XAMPP](https://www.apachefriends.org/index.html) installed (Apache + MySQL)
- [ngrok](https://ngrok.com/) installed (for public access)

### Steps

1. **Clone or Download the Project**

    git clone https://github.com/your-username/Quick-Quacker-coding_Group-1.git

2. Open XAMPP, start Apache and MySQL

3. Place the files in your `htdocs/` directory

4. Import the database into phpMyAdmin (if applicable)

5. Use ngrok to expose the site:

