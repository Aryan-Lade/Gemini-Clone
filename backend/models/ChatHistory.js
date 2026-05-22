import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    conversationId: {
      type: String,
      default: function () {
        return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      },
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for faster queries
chatHistorySchema.index({ userId: 1, createdAt: -1 });

// Auto-update updatedAt
chatHistorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("ChatHistory", chatHistorySchema);
