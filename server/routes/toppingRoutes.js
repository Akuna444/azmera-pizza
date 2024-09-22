const express = require("express");
const router = express.Router();
const {
  createTopping,
  getToppings,
  updateTopping,
  deleteTopping,
} = require("../controllers/toppingController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT
const validate = require("../middlewares/validate");
const toppingSchema = require("../validations/topping");

// Create topping (with authentication, abilities, and validation)
router.post(
  "/add",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities based on user's role
  validate(toppingSchema), // Validate request body
  createTopping
);

// Get toppings (with authentication)
router.get(
  "/",
  authMiddleware, // Extract JWT data
  getToppings
);

// Update topping (with authentication, abilities, and validation)
router.put(
  "/toppings/:id",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(toppingSchema), // Validate request body
  updateTopping
);

// Delete topping (with authentication and abilities)
router.delete(
  "/toppings/:id",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  deleteTopping
);

module.exports = router;
