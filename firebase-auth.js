import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBujdwsjRa1XTsuhgGtMUCX-c0wTNz7FCI",
  authDomain: "quick-quacker.firebaseapp.com",
  projectId: "quick-quacker",
  storageBucket: "quick-quacker.firebasestorage.app",
  messagingSenderId: "317713086750",
  appId: "1:317713086750:web:3fd0a06bea23973cac310f",
  measurementId: "G-CC93V25X8M"
};
firebase.initializeApp(firebaseConfig);
// Initialize Firebase
const auth = firebase.auth();

// Check if user is already logged in and redirect them to homepage
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "homepage.html"; // Redirect to homepage if logged in
  }
});

// Handle login
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Check if email and password fields are empty
      if (!email || !password) {
        showNotification("Please enter email and password.", "error");
        return;
      }

      // Firebase Authentication
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          showNotification("Login successful!", "success");
          setTimeout(() => {
            window.location.href = "homepage.html";
          }, 1000);
        })
        .catch((error) => {
          let errorMessage = "Login failed. Check your email and password.";
          if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            errorMessage = "Invalid email or password.";
          } else if (error.code === "auth/too-many-requests") {
            errorMessage = "Too many failed login attempts. Try again later.";
          }
          showNotification(errorMessage, "error");
        });
    });
  }
});

// Function to show notification messages
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = "notification " + type;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    notification.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    notification.style.transform = "translateY(-10px)";
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}