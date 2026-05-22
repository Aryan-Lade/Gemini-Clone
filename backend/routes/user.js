import express from "express";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch profile" });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update profile" });
  }
});

/**
 * PUT /api/user/password
 * Change user password
 */
router.put("/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.userId).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to change password" });
  }
});

export default router;
