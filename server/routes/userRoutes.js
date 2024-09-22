const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT
const validate = require("../middlewares/validate");
const updateUserProfileSchema = require("../validations/user");

// Get logged-in user profile (with authentication and abilities)
router.get(
  "/profile",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities based on user's role
  getUserProfile
);

// Update logged-in user profile (with authentication, abilities, and validation)
router.put(
  "/profile",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(updateUserProfileSchema), // Validate request body
  updateUserProfile
);

module.exports = router;
