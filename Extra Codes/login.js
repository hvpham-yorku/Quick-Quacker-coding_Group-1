document.addEventListener("DOMContentLoaded", function () {
    // Toggle password visibility
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);

            // Toggle eye icon
            this.querySelector("i").classList.toggle("fa-eye");
            this.querySelector("i").classList.toggle("fa-eye-slash");
        });
    } else {
        console.error("Toggle password button or password input not found.");
    }

    // Add animation to the duck if exists
    if (document.querySelector(".duck")) {
        animateDuck();
    } else {
        console.warn("Duck animation element not found.");
    }

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username")?.value || "";
            const password = document.getElementById("password")?.value || "";

            // Add simple validation
            if (username.trim() === "" || password.trim() === "") {
                showNotification("Please fill in all fields", "error");
                return;
            }

            // Show loading state
            const loginButton = document.querySelector(".login-button");
            if (loginButton) {
                const originalText = loginButton.textContent;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                loginButton.disabled = true;

                // Simulate login process (replace with actual login logic)
                setTimeout(function () {
                    window.location.href = "homepage.html";
                }, 1500);
            } else {
                console.error("Login button not found.");
            }
        });
    } else {
        console.error("Login form not found.");
    }

    // Make the duck "quack" when clicked
    const duck = document.querySelector(".duck");
    if (duck) {
        duck.addEventListener("click", function () {
            // Create quack bubble
            const quack = document.createElement("div");
            quack.className = "quack-bubble";
            quack.textContent = "Quack!";

            // Ensure the duck display exists
            const duckDisplay = document.querySelector(".duck-display");
            if (duckDisplay) {
                duckDisplay.appendChild(quack);
            } else {
                console.warn("Duck display not found.");
                return;
            }

            // Make duck jump
            duck.style.transform = "translateY(-15px)";
            setTimeout(() => {
                duck.style.transform = "";
            }, 300);

            // Remove the bubble after animation
            setTimeout(() => {
                quack.remove();
            }, 1500);
        });
    } else {
        console.warn("Duck element not found.");
    }
});

// Function to show notification
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = "notification " + type;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.style.transform = "translateY(0)";
        notification.style.opacity = "1";
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = "translateY(-10px)";
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Duck animation function for gentle floating effect
function animateDuck() {
    const duck = document.querySelector(".duck");
    if (!duck) return; // Ensure the duck element exists

    let floatY = 0;
    let floatDirection = 1;

    function flapWings() {
        const wing = document.querySelector(".duck-wing");
        if (!wing) return;

        wing.style.transition = "transform 0.2s ease-in-out";
        wing.style.transform = "rotate(35deg)";

        setTimeout(() => {
            wing.style.transform = "rotate(20deg)";
        }, 200);

        // Schedule next flap randomly
        setTimeout(flapWings, Math.random() * 5000 + 3000);
    }

    // Start wing flapping
    setTimeout(flapWings, 2000);
}

// Add these styles programmatically
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

    .notification.error {
        background-color: #ff6b6b;
    }

    .notification.success {
        background-color: #4CAF50;
    }

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

    .quack-bubble:after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
    }

    @keyframes bubble {
        0% {
            opacity: 0;
            transform: translate(-50%, 10px);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);
