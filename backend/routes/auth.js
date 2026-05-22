import express from "express";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
});

/**
 * POST /api/auth/login
 * Login user with email and password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Failed to login" });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (token invalidation handled on frontend)
 */
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

export default router;
