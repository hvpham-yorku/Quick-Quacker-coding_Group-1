document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    // If already logged in (e.g. user navigates back to signup), redirect to homepage
    auth.onAuthStateChanged(function(user) {
      if (user) {
        window.location.href = "homepage.html";
      }
    });
  
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
          showNotification("Please fill in all fields.", "error");
          return;
        }
        if (password !== confirmPassword) {
          showNotification("Passwords do not match.", "error");
          return;
        }
  
        // Show loading state on the sign-up button
        const signupButton = document.querySelector(".signup-button");
        if (signupButton) {
          const originalText = signupButton.textContent;
          signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
          signupButton.disabled = true;
  
          // Firebase user creation
          auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Set the new user's display name to the chosen username
              return userCredential.user.updateProfile({ displayName: username });
            })
            .then(() => {
              // Account successfully created and profile updated
              showNotification("Account created successfully!", "success");
              setTimeout(() => {
                window.location.href = "homepage.html";
              }, 1500);
            })
            .catch((error) => {
              // Restore button state on error
              signupButton.innerHTML = originalText;
              signupButton.disabled = false;
              // Determine error message
              let errorMessage = "Registration failed. Please try again.";
              if (error.code === "auth/email-already-in-use") {
                errorMessage = "This email is already registered.";
              } else if (error.code === "auth/weak-password") {
                errorMessage = "Password is too weak. Use at least 6 characters.";
              } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
              }
              showNotification(errorMessage, "error");
            });
        }
      });
    }
  });