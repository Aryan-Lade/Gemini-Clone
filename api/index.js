import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "../backend/routes/auth.js";
import chatRoutes from "../backend/routes/chat.js";
import userRoutes from "../backend/routes/user.js";

const app = express();
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gemini-clone";

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Body parser middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Gemini Clone API is running",
    endpoints: {
      auth: "/api/auth",
      chat: "/api/chat",
      user: "/api/user",
      health: "/api/health",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
