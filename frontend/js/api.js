/**
 * API Service
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = process.env.API_URL || "http://localhost:5000/api";

class APIService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  /**
   * Get authorization headers
   */
  getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  /**
   * Handle response errors
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  /**
   * Auth: Sign up
   */
  async signup(name, email, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await this.handleResponse(response);

      if (data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  /**
   * Auth: Login
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await this.handleResponse(response);

      if (data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Auth: Logout
   */
  logout() {
    this.clearToken();
  }

  /**
   * Chat: Send message
   */
  async sendMessage(message, conversationId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ message, conversationId }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Chat: Get all conversations
   */
  async getConversations(limit = 50, skip = 0) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  }

  /**
   * Chat: Get specific conversation
   */
  async getConversation(conversationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }
  }

  /**
   * Chat: Delete conversation
   */
  async deleteConversation(conversationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        },
      );

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  }

  /**
   * Chat: Clear conversation messages
   */
  async clearConversation(conversationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/clear`,
        {
          method: "POST",
          headers: this.getHeaders(),
        },
      );

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to clear conversation: ${error.message}`);
    }
  }

  /**
   * User: Get profile
   */
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  }

  /**
   * User: Update profile
   */
  async updateProfile(name, avatar, preferences) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ name, avatar, preferences }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * User: Change password
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Token management
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new APIService();
