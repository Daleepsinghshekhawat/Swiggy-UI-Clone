// User management
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function updateAuthButton() {
  const authBtn = document.querySelector(".btn.primary");
  if (currentUser) {
    authBtn.textContent = "Sign Out";
    authBtn.onclick = signOut;
  } else {
    authBtn.textContent = "Sign In";
    authBtn.onclick = showAuthModal;
  }
}

function showAuthModal() {
  const modal = document.getElementById("auth-modal");
  modal.style.display = "block";
  showSignInForm();
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  modal.style.display = "none";
  // Clear forms
  document.getElementById("signin-form-element").reset();
  document.getElementById("signup-form-element").reset();
}

function showSignInForm() {
  document.getElementById("signin-tab").classList.add("active");
  document.getElementById("signup-tab").classList.remove("active");
  document.getElementById("signin-form").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
}

function showSignUpForm() {
  document.getElementById("signup-tab").classList.add("active");
  document.getElementById("signin-tab").classList.remove("active");
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("signin-form").classList.add("hidden");
  // Reset password fields
  document.getElementById("signup-password").value = "";
  document.getElementById("signup-confirm-password").value = "";
  updatePasswordStrength();
}

function checkPasswordStrength(password) {
  let strength = 0;
  let feedback = [];

  if (password.length >= 8) strength++;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) strength++;
  else feedback.push("Lowercase letter");

  if (/[A-Z]/.test(password)) strength++;
  else feedback.push("Uppercase letter");

  if (/\d/.test(password)) strength++;
  else feedback.push("Number");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  else feedback.push("Special character");

  return { strength, feedback };
}

function updatePasswordStrength() {
  const password = document.getElementById("signup-password").value;
  const strengthFill = document.getElementById("strength-fill");
  const strengthText = document.getElementById("strength-text");
  const { strength, feedback } = checkPasswordStrength(password);

  let percentage = (strength / 5) * 100;
  strengthFill.style.width = `${percentage}%`;

  strengthFill.className = "strength-fill";
  if (strength <= 2) {
    strengthFill.classList.add("strength-weak");
    strengthText.textContent = "Weak password";
  } else if (strength <= 4) {
    strengthFill.classList.add("strength-medium");
    strengthText.textContent = "Medium password";
  } else {
    strengthFill.classList.add("strength-strong");
    strengthText.textContent = "Strong password";
  }

  if (password && strength < 5) {
    strengthText.textContent += ` - Missing: ${feedback.join(", ")}`;
  }
}

function validatePasswords() {
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password",
  ).value;
  const matchDiv = document.getElementById("password-match");
  const submitBtn = document.getElementById("signup-submit-btn");

  if (confirmPassword && password !== confirmPassword) {
    matchDiv.textContent = "Passwords do not match";
    matchDiv.className = "error-message";
    submitBtn.disabled = true;
  } else if (confirmPassword && password === confirmPassword) {
    matchDiv.textContent = "Passwords match ✓";
    matchDiv.className = "success-message";
    submitBtn.disabled = false;
  } else {
    matchDiv.textContent = "";
    submitBtn.disabled = true;
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((error) => error.remove());
}

function signIn(event) {
  event.preventDefault();
  const email = document
    .getElementById("signin-email")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("signin-password").value;

  clearErrors();

  if (!validateEmail(email) || !password) {
    showError("signin-email", "Please enter valid email and password");
    return;
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateAuthButton();
    closeAuthModal();
    alert(`Welcome back, ${user.name}!`);
  } else {
    showError("signin-email", "Invalid email or password");
  }
}

function signUp(event) {
  event.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password",
  ).value;

  // Clear previous errors
  clearErrors();

  let hasError = false;

  if (name.length < 2) {
    showError("signup-name", "Name must be at least 2 characters");
    hasError = true;
  }

  if (!validateEmail(email)) {
    showError("signup-email", "Please enter a valid email address");
    hasError = true;
  }

  const { strength } = checkPasswordStrength(password);
  if (strength < 5) {
    showError("signup-password", "Password does not meet requirements");
    hasError = true;
  }

  if (password !== confirmPassword) {
    showError("signup-confirm-password", "Passwords do not match");
    hasError = true;
  }

  if (hasError) return;

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (existingUser) {
    showError(
      "signup-email",
      "User with this email already exists. Please sign in instead.",
    );
    showSignInForm();
    return;
  }

  const newUser = { name, email: email.toLowerCase(), password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateAuthButton();
  closeAuthModal();
  alert(`Welcome, ${name}! Your account has been created.`);
}

function signOut() {
  if (confirm("Are you sure you want to sign out?")) {
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateAuthButton();
    alert("You have signed out.");
  }
}

function orderItem(restaurantName) {
  if (!currentUser) {
    alert("Please sign in to place an order.");
    showAuthModal();
    return;
  }
  alert(
    `${currentUser.name}, your order from ${restaurantName} has been placed!`,
  );
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  updateAuthButton();

  // Modal event listeners
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.querySelector(".close");

  closeBtn.onclick = closeAuthModal;
  window.onclick = function (event) {
    if (event.target == modal) {
      closeAuthModal();
    }
  };

  // Tab switching
  document.getElementById("signin-tab").onclick = showSignInForm;
  document.getElementById("signup-tab").onclick = showSignUpForm;

  // Password validation
  document
    .getElementById("signup-password")
    .addEventListener("input", updatePasswordStrength);
  document
    .getElementById("signup-confirm-password")
    .addEventListener("input", validatePasswords);

  // Password toggle
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const type = input.type === "password" ? "text" : "password";
      input.type = type;
      this.textContent = type === "password" ? "Show" : "Hide";
    });
  });

  // Form submissions
  document
    .getElementById("signin-form-element")
    .addEventListener("submit", signIn);
  document
    .getElementById("signup-form-element")
    .addEventListener("submit", signUp);
});
