const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const updateUserProfileSchema = require("../schemas/userSchema");

// Get logged-in user profile
router.get("/profile", applyAbilities, getUserProfile);

// Update logged-in user profile (with validation)
router.put(
  "/profile",
  applyAbilities,
  validate(updateUserProfileSchema),
  updateUserProfile
);

module.exports = router;
