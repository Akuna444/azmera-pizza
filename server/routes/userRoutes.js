// routes/userRoutes.js
const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get the logged-in user's profile
router.get("/me", authMiddleware, getUserProfile);

// Update the logged-in user's profile
router.put("/me", authMiddleware, updateUserProfile);

module.exports = router;
