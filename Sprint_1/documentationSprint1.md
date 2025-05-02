# Quick Quacker 🦆

A fun and interactive productivity app with a virtual duck pet! Users can log in, manage tasks, and earn rewards to take care of their pet duck.

---

## 📁 Project Structure & File Documentation

### `firebase_config.js`
**Purpose:** Initializes Firebase for the application.

**Key Functions:**
- `initializeApp(firebaseConfig)`: Starts Firebase services using provided config.
- `getAnalytics(app)`: Enables Firebase Analytics.

---

### `firebase-auth.js`
**Purpose:** Manages Firebase Authentication and login flow.

**Key Functions:**
- `getAuth(app)`: Initializes Firebase Authentication.
- `signInWithEmailAndPassword(auth, email, password)`: Authenticates users.
- `onAuthStateChanged(auth, callback)`: Checks login state and redirects.
- `showNotification(message, type)`: Displays status messages.

---

### `login.js`
**Purpose:** Handles login page UI and animations.

**Key Features:**
- Toggles password visibility.
- Simulates login with loading animation.
- Triggers duck “quack” interaction.
- Displays success/error notifications.

---

### `signup.js`
**Purpose:** Handles user registration and password reset.

**Key Features:**
- `registerUser(email, password, username)`: Registers new user via Firebase.
- Validates inputs and confirms password.
- Provides “Forgot Password” functionality.
- `showNotification(message, type)`: Shows feedback.

---

### `Homepage.js`
**Purpose:** Controls homepage UI features and productivity tools.

**Key Features:**
- Sidebar navigation toggle.
- Duck animation and interaction.
- Dynamic calendar rendering.
- To-do list system with priorities.
- Rewards for task completion (food, water, coins).
- LocalStorage management for XP and rewards.

---

### `Virtual_Pet.js`
**Purpose:** Manages virtual duck pet game.

**Key Features:**
- Feed, water, and play with your duck.
- Earn XP and level up.
- Track achievements (Level 2, Level 5, etc.).
- Game state saved with `localStorage`.
- Duck animations (wing flap, bounce, mood).
- Responsive sidebar and settings.

---

## 🛠️ Technologies Used

- JavaScript (ES6+)
- HTML/CSS
- Firebase Authentication & Analytics
- LocalStorage for game state

---

## 🧪 Features

- Interactive login and signup flow
- Custom duck animation and rewards system
- Task-based productivity with real incentives
- Persistent pet care and XP tracking

---

## 🚀 Getting Started

1. Clone this repo.
2. Set up Firebase and update your config in `firebase_config.js`.
3. Open `index.html` or `login.html` in your browser.
4. Enjoy your journey with Mr. Quackers! 🦆

