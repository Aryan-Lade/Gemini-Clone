/**
 * Auth Page Script
 * Handles login and signup functionality
 */

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const signupToggle = document.getElementById("signup-toggle");
const loginToggle = document.getElementById("login-toggle");
const errorMessage = document.getElementById("error-message");
const signupErrorMessage = document.getElementById("signup-error-message");

// Toggle between login and signup
signupToggle.addEventListener("click", () => {
  document.querySelector(".auth-card").classList.add("hidden");
  document.getElementById("signup-container").classList.remove("hidden");
});

loginToggle.addEventListener("click", () => {
  document.getElementById("signup-container").classList.add("hidden");
  document.querySelector(".auth-card").classList.remove("hidden");
});

// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorMessage.style.display = "none";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      // Redirect to chat page
      window.location.href = "./index.html";
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = "block";
  }
});

// Handle signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm")
    .value.trim();

  signupErrorMessage.style.display = "none";

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      // Redirect to chat page
      window.location.href = "./index.html";
    }
  } catch (error) {
    signupErrorMessage.textContent = error.message;
    signupErrorMessage.style.display = "block";
  }
});

// Check if already logged in
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "./index.html";
}
