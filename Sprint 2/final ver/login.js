document.addEventListener('DOMContentLoaded', function() {
    // Toggle between login and register forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formToggle = document.getElementById('formToggle');
    const formToggleText = document.getElementById('formToggleText');
    
    formToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (loginForm.classList.contains('active')) {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            formToggle.textContent = 'Sign In';
            formToggleText.innerHTML = 'Already have an account? <a href="#" id="formToggle">Sign In</a>';
            document.querySelector('.login-container h2').textContent = 'Create Account';
            document.querySelector('.login-subtitle').textContent = 'Join the quacking community';
        } else {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            formToggle.textContent = 'Sign Up';
            formToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="formToggle">Sign Up</a>';
            document.querySelector('.login-container h2').textContent = 'Welcome Back!';
            document.querySelector('.login-subtitle').textContent = 'Sign in to continue your quacking journey';
        }
        
        // Reattach event listener since we're replacing the HTML content
        document.getElementById('formToggle').addEventListener('click', arguments.callee);
    });
    
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });
    
    // Password validation
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', validatePassword);
        
        // Initial validation state
        validatePassword();
    }
    
    // Add animation to the duck
    animateDuck();
    
    // Make the duck "quack" when clicked
    const duck = document.querySelector('.duck');
    duck.addEventListener('click', function() {
        // Create quack bubble
        const quack = document.createElement('div');
        quack.className = 'quack-bubble';
        quack.textContent = 'Quack!';
        
        // Position the bubble above the duck
        document.querySelector('.duck-display').appendChild(quack);
        
        // Make duck jump
        duck.style.transform = 'translateY(-15px)';
        setTimeout(() => {
            duck.style.transform = '';
        }, 300);
        
        // Remove the bubble after animation
        setTimeout(() => {
            quack.remove();
        }, 1500);
    });
    
    // Handle form submissions
    loginForm.addEventListener('submit', function() {
        const loginButton = this.querySelector('.login-button');
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        loginButton.disabled = true;
    });
    
    registerForm.addEventListener('submit', function(e) {
        // Validate password before submission
        if (!isPasswordValid()) {
            e.preventDefault();
            showNotification('Password does not meet all requirements!', 'error');
            return false;
        }
        
        const registerButton = this.querySelector('.login-button');
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        registerButton.disabled = true;
    });
    
    // Check URL parameters
    checkUrlParameters();
});

// Password validation function
function validatePassword() {
    const password = document.getElementById('registerPassword').value;
    
    // Check each requirement
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    
    // Update UI for each requirement
    updateRequirement('length-check', hasMinLength);
    updateRequirement('uppercase-check', hasUppercase);
    updateRequirement('lowercase-check', hasLowercase);
    updateRequirement('number-check', hasNumber);
    updateRequirement('symbol-check', hasSymbol);
    
    return hasUppercase && hasLowercase && hasNumber && hasSymbol && hasMinLength;
}

// Helper function to update requirement UI
function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (isValid) {
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
    }
}

// Check if password is valid
function isPasswordValid() {
    return validatePassword();
}

// Function to show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(-10px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Duck animation function
function animateDuck() {
    const duck = document.querySelector('.duck');
    
    // Random wing flap
    function flapWings() {
        const wing = document.querySelector('.duck-wing');
        wing.style.transition = 'transform 0.2s ease-in-out';
        wing.style.transform = 'rotate(35deg)';
        
        setTimeout(() => {
            wing.style.transform = 'rotate(20deg)';
        }, 200);
        
        // Schedule next flap randomly
        setTimeout(flapWings, Math.random() * 5000 + 3000);
    }
    
    // Start wing flapping
    setTimeout(flapWings, 2000);
}

// Function to check URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we should show the registration form
    if (urlParams.has('action') && urlParams.get('action') === 'register') {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('formToggle').textContent = 'Sign In';
        document.getElementById('formToggleText').innerHTML = 'Already have an account? <a href="#" id="formToggle">Sign In</a>';
        document.querySelector('.login-container h2').textContent = 'Create Account';
        document.querySelector('.login-subtitle').textContent = 'Join the quacking community';
        
        // Reattach event listener
        document.getElementById('formToggle').addEventListener('click', function(e) {
            e.preventDefault();
            location.href = location.pathname; // Redirect to same page without parameters
        });
    }
    
    // Handle error and success messages
    if (urlParams.has('error')) {
        const error = urlParams.get('error');
        if (error === 'invalidpassword') {
            showNotification('Invalid password', 'error');
        } else if (error === 'usernotfound') {
            showNotification('User not found', 'error');
        } else if (error === 'usernametaken') {
            showNotification('Username already taken', 'error');
        } else if (error === 'emailtaken') {
            showNotification('Email already in use', 'error');
        } else if (error === 'dberror') {
            showNotification('Database error. Please try again.', 'error');
        } else if (error === 'password_requirements') {
            showNotification('Password does not meet requirements', 'error');
        }
    } else if (urlParams.has('registration') && urlParams.get('registration') === 'success') {
        showNotification('Registration successful! Please login.', 'success');
    }
}
