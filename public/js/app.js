/**
 * Main Chat Application
 * Handles chat UI and functionality
 */

// Get API base URL dynamically
const getAPIBaseURL = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:5000/api";
  }
  return "/api";
};

// DOM Elements
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const sidebar = document.querySelector(".sidebar");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");

// State
let currentConversationId = null;
let isLoading = false;
let token = localStorage.getItem("token");

/**
 * Get authorization headers
 */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Initialize app
 */
async function initializeApp() {
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  try {
    // Check if user is authenticated
    const response = await fetch(`${getAPIBaseURL()}/health`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    setupEventListeners();
    showToast("Welcome! Start chatting with Gemini Clone", "success");
  } catch (error) {
    console.error("Initialization error:", error);
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  sendBtn.addEventListener("click", sendMessage);
  newChatBtn.addEventListener("click", newChat);
  logoutBtn.addEventListener("click", logout);

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
  });
}

/**
 * Send message to backend
 */
async function sendMessage() {
  const message = messageInput.value.trim();

  if (!message || isLoading) return;

  // Display user message
  displayMessage(message, "user");
  messageInput.value = "";
  messageInput.style.height = "auto";

  isLoading = true;

  try {
    // Show loading spinner
    const loadingEl = displayMessage("Generating response...", "loading");

    // Send message to backend
    const response = await fetch(`${getAPIBaseURL()}/chat/message`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        conversationId: currentConversationId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message");
    }

    const data = await response.json();

    // Remove loading message
    if (loadingEl) loadingEl.remove();

    // Update conversation ID if new
    if (!currentConversationId) {
      currentConversationId = data.conversationId;
    }

    // Display AI response
    displayMessage(data.message.content, "assistant");
    showToast("Message sent successfully", "success");
  } catch (error) {
    console.error("Error sending message:", error);
    displayMessage(`Error: ${error.message}`, "error");
    showToast(error.message, "error");
  } finally {
    isLoading = false;
  }
}

/**
 * Display message in chat
 */
function displayMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  if (sender === "loading") {
    const spinner = document.createElement("div");
    spinner.className = "spinner-small";
    contentDiv.appendChild(spinner);
  } else {
    const label = document.createElement("p");
    label.className = "message-label";
    label.textContent = sender === "user" ? "You" : "Gemini";
    contentDiv.appendChild(label);
  }

  const textEl = document.createElement("p");
  textEl.className = "message-text";
  textEl.textContent = text;
  contentDiv.appendChild(textEl);

  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  return messageDiv;
}

/**
 * Start new chat
 */
function newChat() {
  currentConversationId = null;
  messagesContainer.innerHTML = `
    <div class="welcome-message">
      <h2>Welcome to Gemini Clone</h2>
      <p>Start a conversation to begin chatting with AI</p>
    </div>
  `;
  messageInput.value = "";
  messageInput.style.height = "auto";
  showToast("New chat started", "success");
}

/**
 * Logout
 */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
  toast.textContent = message;
  toast.className = `toast show`;

  // Set timeout to hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/**
 * Initialize app on page load
 */
window.addEventListener("load", initializeApp);

// Handle visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    isLoading = false;
  }
});
