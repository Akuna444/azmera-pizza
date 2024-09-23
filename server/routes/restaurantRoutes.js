const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // JWT authentication middleware
const validate = require("../middlewares/validate"); // Validation middleware
const restaurantSchema = require("../validations/restaurant"); // Validation schema for restaurant creation and updates

// Create a restaurant (Super Admin only, with optional ownerId)
router.post(
  "/add",
  authMiddleware, // Ensure the user is authenticated
  applyAbilities, // Check if the user has permission to create restaurants // Validate request body using restaurant schema
  createRestaurant
);

// Get all restaurants (Super Admin only)
router.get(
  "/all",
  authMiddleware, // Ensure the user is authenticated
  applyAbilities, // Check if the user has permission to read restaurants
  getRestaurants
);

// Update a restaurant (Super Admin or allowed Manager)
router.put(
  "/:id",
  authMiddleware, // Ensure the user is authenticated
  applyAbilities, // Check if the user has permission to update restaurants
  validate(restaurantSchema), // Validate request body using restaurant schema
  updateRestaurant
);

// Delete a restaurant (Super Admin only)
router.delete(
  "/:id",
  authMiddleware, // Ensure the user is authenticated
  applyAbilities, // Check if the user has permission to delete restaurants
  deleteRestaurant
);

module.exports = router;
