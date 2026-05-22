/**
 * Main Chat Application
 * Handles chat UI and functionality
 */

import api from "./api.js";

// DOM Elements
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const conversationsList = document.getElementById("conversations-list");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const sidebarToggle = document.getElementById("sidebar-toggle");
const userMenuBtn = document.getElementById("user-menu-btn");
const userMenu = document.getElementById("user-menu");
const profileMenu = document.getElementById("profile-menu");
const logoutMenu = document.getElementById("logout-menu");
const emptyState = document.getElementById("empty-state");
const chatTitle = document.getElementById("chat-title");
const userNameEl = document.getElementById("user-name");
const userAvatarEl = document.getElementById("user-avatar");

// State
let currentConversationId = null;
let isLoading = false;
let currentUser = null;

// Initialize app
async function initializeApp() {
  // Check authentication
  if (!api.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Load user profile
    const profileResponse = await api.getProfile();
    currentUser = profileResponse.user;
    userNameEl.textContent = currentUser.name;
    userAvatarEl.src = currentUser.avatar;

    // Load conversations
    await loadConversations();
  } catch (error) {
    console.error("Failed to initialize app:", error);
    handleError("Failed to load user data");
  }
}

/**
 * Load conversations from backend
 */
async function loadConversations() {
  try {
    const response = await api.getConversations();
    const conversations = response.conversations || [];

    conversationsList.innerHTML = "";

    if (conversations.length === 0) {
      conversationsList.innerHTML =
        '<p class="empty-conversations">No chats yet</p>';
      return;
    }

    conversations.forEach((conv) => {
      const item = createConversationItem(conv);
      conversationsList.appendChild(item);
    });
  } catch (error) {
    console.error("Failed to load conversations:", error);
  }
}

/**
 * Create conversation item element
 */
function createConversationItem(conversation) {
  const div = document.createElement("div");
  div.className = "conversation-item";
  div.innerHTML = `
    <div class="conversation-content">
      <p class="conversation-title">${escapeHtml(conversation.title)}</p>
      <p class="conversation-date">${formatDate(conversation.updatedAt)}</p>
    </div>
    <button class="conversation-delete" title="Delete">
      <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
      </svg>
    </button>
  `;

  div.addEventListener("click", (e) => {
    if (e.target.closest(".conversation-delete")) {
      deleteConversation(conversation.conversationId);
    } else {
      loadConversation(conversation.conversationId);
    }
  });

  return div;
}

/**
 * Load specific conversation
 */
async function loadConversation(conversationId) {
  try {
    isLoading = true;
    currentConversationId = conversationId;

    const response = await api.getConversation(conversationId);
    const conversation = response.conversation;

    // Update UI
    chatTitle.textContent = conversation.title;
    messagesContainer.innerHTML = "";
    emptyState.style.display = "none";

    // Display messages
    conversation.messages.forEach((msg) => {
      displayMessage(msg.content, msg.role === "user" ? "user" : "assistant");
    });

    // Highlight current conversation
    document.querySelectorAll(".conversation-item").forEach((item) => {
      item.classList.remove("active");
    });
    event.target.closest(".conversation-item")?.classList.add("active");
  } catch (error) {
    console.error("Failed to load conversation:", error);
    handleError(error.message);
  } finally {
    isLoading = false;
  }
}

/**
 * Delete conversation
 */
async function deleteConversation(conversationId) {
  if (!confirm("Are you sure you want to delete this conversation?")) {
    return;
  }

  try {
    await api.deleteConversation(conversationId);

    if (currentConversationId === conversationId) {
      currentConversationId = null;
      newChat();
    }

    await loadConversations();
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    handleError(error.message);
  }
}

/**
 * Start new chat
 */
function newChat() {
  currentConversationId = null;
  messagesContainer.innerHTML = "";
  messageInput.value = "";
  chatTitle.textContent = "Gemini Clone";
  emptyState.style.display = "block";

  document.querySelectorAll(".conversation-item").forEach((item) => {
    item.classList.remove("active");
  });
}

/**
 * Send message
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
    // Hide empty state
    emptyState.style.display = "none";

    // Show loading message
    const loadingEl = displayMessage("Generating response...", "loading");

    // Send message to backend
    const response = await api.sendMessage(message, currentConversationId);

    // Remove loading message
    loadingEl?.remove();

    // Update conversation ID if new
    if (!currentConversationId) {
      currentConversationId = response.conversationId;
    }

    // Display AI response
    displayMessage(response.message.content, "assistant");

    // Reload conversations to show updated list
    await loadConversations();
  } catch (error) {
    console.error("Failed to send message:", error);
    handleError(error.message);
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

  const label = document.createElement("p");
  label.className = "message-label";
  label.textContent =
    sender === "user" ? "You" : sender === "loading" ? "Gemini" : "Gemini";

  const textEl = document.createElement("p");
  textEl.className = "message-text";
  textEl.textContent = text;

  if (sender === "loading") {
    messageDiv.classList.add("loading");
    contentDiv.appendChild(createLoadingSpinner());
  } else {
    contentDiv.appendChild(label);
  }

  contentDiv.appendChild(textEl);
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  return messageDiv;
}

/**
 * Create loading spinner
 */
function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "spinner-small";
  return spinner;
}

/**
 * Handle error messages
 */
function handleError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "message error";
  errorDiv.innerHTML = `
    <div class="message-content">
      <p class="message-label">Error</p>
      <p class="message-text">${escapeHtml(message)}</p>
    </div>
  `;
  messagesContainer.appendChild(errorDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Format date
 */
function formatDate(date) {
  const d = new Date(date);
  const today = new Date();

  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Event listeners
 */
sendBtn.addEventListener("click", sendMessage);

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

newChatBtn.addEventListener("click", newChat);

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("mobile-open");
});

userMenuBtn.addEventListener("click", () => {
  userMenu.style.display = userMenu.style.display === "none" ? "block" : "none";
});

profileMenu.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Profile settings coming soon!");
});

logoutMenu.addEventListener("click", (e) => {
  e.preventDefault();
  api.logout();
  window.location.href = "login.html";
});

// Close user menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-section")) {
    userMenu.style.display = "none";
  }
});

// Initialize app on load
window.addEventListener("load", initializeApp);
