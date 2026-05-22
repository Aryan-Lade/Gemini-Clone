import express from "express";
import { authenticate } from "../middleware/auth.js";
import ChatHistory from "../models/ChatHistory.js";
import { callGeminiAPI } from "../services/geminiService.js";

const router = express.Router();

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
router.post("/message", authenticate, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.userId;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Find or create conversation
    let chat;
    if (conversationId) {
      chat = await ChatHistory.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!chat) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      chat = new ChatHistory({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
      });
    }

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Call Gemini API
    let aiResponse;
    try {
      const result = await callGeminiAPI(message);
      aiResponse = result.content;
    } catch (error) {
      console.error("Gemini API call failed:", error.message);
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
      });
    }

    // Add AI response to chat
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });

    // Save chat
    await chat.save();

    res.json({
      success: true,
      conversationId: chat.conversationId,
      message: {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process message" });
  }
});

/**
 * GET /api/chat/conversations
 * Get all conversations for a user
 */
router.get("/conversations", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const conversations = await ChatHistory.find({ userId, isActive: true })
      .select("conversationId title createdAt updatedAt messages")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ChatHistory.countDocuments({ userId, isActive: true });

    res.json({
      success: true,
      conversations,
      total,
      count: conversations.length,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch conversations" });
  }
});

/**
 * GET /api/chat/conversations/:conversationId
 * Get a specific conversation
 */
router.get("/conversations/:conversationId", authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const chat = await ChatHistory.findOne({
      conversationId,
      userId,
      isActive: true,
    });

    if (!chat) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({
      success: true,
      conversation: chat,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch conversation" });
  }
});

/**
 * DELETE /api/chat/conversations/:conversationId
 * Delete a conversation (soft delete)
 */
router.delete(
  "/conversations/:conversationId",
  authenticate,
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.userId;

      const chat = await ChatHistory.findOne({ conversationId, userId });

      if (!chat) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      chat.isActive = false;
      await chat.save();

      res.json({
        success: true,
        message: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error("Delete conversation error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to delete conversation" });
    }
  },
);

/**
 * POST /api/chat/conversations/:conversationId/clear
 * Clear messages in a conversation
 */
router.post(
  "/conversations/:conversationId/clear",
  authenticate,
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.userId;

      const chat = await ChatHistory.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!chat) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      chat.messages = [];
      await chat.save();

      res.json({
        success: true,
        message: "Conversation cleared successfully",
      });
    } catch (error) {
      console.error("Clear conversation error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to clear conversation" });
    }
  },
);

export default router;
