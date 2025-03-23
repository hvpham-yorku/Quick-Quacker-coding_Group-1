document.addEventListener("DOMContentLoaded", function () {
    // Redirect to homepage if a user is already logged in
    auth.onAuthStateChanged(function(user) {
      if (user) {
        window.location.href = "homepage.html";
      }
    });
  
    // Toggle password visibility for password fields
    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach(button => {
      const passwordInput = button.previousElementSibling;
      if (!passwordInput) return;
      button.addEventListener("click", function () {
        const icon = this.querySelector("i");
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          passwordInput.type = "password";
          icon.classList.add("fa-eye");
          icon.classList.remove("fa-eye-slash");
        }
      });
    });
  
    // Initialize duck animation if the duck element exists
    const duck = document.querySelector(".duck");
    if (duck) {
      animateDuck();
      duck.addEventListener("click", function () {
        // Create a "Quack!" bubble on duck click
        const quack = document.createElement("div");
        quack.className = "quack-bubble";
        quack.textContent = "Quack!";
        const duckDisplay = document.querySelector(".duck-display");
        if (duckDisplay) {
          duckDisplay.appendChild(quack);
        }
        // Make the duck jump momentarily
        duck.style.transform = "translateY(-15px)";
        setTimeout(() => { duck.style.transform = ""; }, 300);
        // Remove the quack bubble after 1.5s
        setTimeout(() => { quack.remove(); }, 1500);
      });
    } else {
      console.warn("Duck element not found.");
    }
  
    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (email.trim() === "" || password.trim() === "") {
          showNotification("Please fill in all fields.", "error");
          return;
        }
        // Show loading state on the sign-in button
        const loginButton = document.querySelector(".login-button");
        if (loginButton) {
          const originalText = loginButton.textContent;
          loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
          loginButton.disabled = true;
          // Firebase email/password authentication
          auth.signInWithEmailAndPassword(email, password)
            .then(() => {
              showNotification("Login successful!", "success");
              setTimeout(() => {
                window.location.href = "homepage.html";
              }, 1000);
            })
            .catch((error) => {
              // Restore button state and show an error message
              loginButton.innerHTML = originalText;
              loginButton.disabled = false;
              let errorMessage = "Login failed. Check your credentials and try again.";
              if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                errorMessage = "Invalid email or password.";
              } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many failed attempts. Please try again later.";
              } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
              }
              showNotification(errorMessage, "error");
            });
        }
      });
    } else {
      console.error("Login form not found.");
    }
  
    // Google Sign-In button handler
    const googleBtn = document.getElementById("googleSignInBtn");
    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then(() => {
            // Successful Google login
            window.location.href = "homepage.html";
          })
          .catch((error) => {
            let errorMessage = "Google sign-in failed. Please try again.";
            if (error.code === "auth/popup-closed-by-user") {
              errorMessage = "Google sign-in was canceled.";
            } else if (error.code === "auth/popup-blocked") {
              errorMessage = "Popup was blocked. Please allow pop-ups and try again.";
            }
            showNotification(errorMessage, "error");
          });
      });
    }
  
    // "Forgot Password" link handler
    const forgotPasswordLink = document.querySelector(".forgot-password");
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", function (e) {
        e.preventDefault();
        const email = prompt("Enter your email address to reset your password:");
        if (email) {
          auth.sendPasswordResetEmail(email)
            .then(() => {
              showNotification("Password reset email sent! Check your inbox.", "success");
            })
            .catch((error) => {
              let errorMessage = "Failed to send password reset email.";
              if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with that email.";
              } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
              }
              showNotification(errorMessage, "error");
            });
        }
      });
    }
  });
  
  // Helper function to display notification messages
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = "notification " + type;
    notification.textContent = message;
    document.body.appendChild(notification);
    // Animate notification (fade-in)
    setTimeout(() => {
      notification.style.transform = "translateY(0)";
      notification.style.opacity = "1";
    }, 10);
    // Hide and remove after a few seconds
    setTimeout(() => {
      notification.style.transform = "translateY(-10px)";
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Duck animation function (gentle floating effect)
  function animateDuck() {
    const duck = document.querySelector(".duck");
    if (!duck) return;
    // Wing flapping animation
    function flapWings() {
      const wing = document.querySelector(".duck-wing");
      if (!wing) return;
      wing.style.transition = "transform 0.2s ease-in-out";
      wing.style.transform = "rotate(35deg)";
      setTimeout(() => {
        wing.style.transform = "rotate(20deg)";
      }, 200);
      // Schedule the next flap randomly between 3s and 8s
      setTimeout(flapWings, Math.random() * 5000 + 3000);
    }
    // Start flapping after a short delay
    setTimeout(flapWings, 2000);
  }
  
  // Inject CSS for notification messages and quack bubble
  const style = document.createElement("style");
  style.innerHTML = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    .notification.error { background-color: #ff6b6b; }
    .notification.success { background-color: #4CAF50; }
    .quack-bubble {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background-color: white;
      padding: 8px 15px;
      border-radius: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-weight: bold;
      animation: bubble 1.5s ease-out forwards;
      z-index: 10;
    }
    .quack-bubble::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }
    @keyframes bubble {
      0%   { opacity: 0; transform: translate(-50%, 10px); }
      20%  { opacity: 1; transform: translate(-50%, 0);   }
      80%  { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }
  `;
  document.head.appendChild(style);