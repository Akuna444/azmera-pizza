const express = require("express");
const router = express.Router();
const {
  createPizza,
  getPizzas,
  getPizza,
} = require("../controllers/pizzaController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT
const validate = require("../middlewares/validate");
const pizzaSchema = require("../validations/pizza");
const upload = require("../middlewares/multerMiddleware");

// Create pizza (with authentication, abilities, and validation)
router.post(
  "/add",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities based on user's role
  upload.single("pizzaImage"), // Validate request body
  createPizza
);

// Get pizzas (with authentication and abilities)
router.get(
  "/all",
  authMiddleware, // Extract JWT data // Apply CASL abilities
  getPizzas
);

router.get(
  "/one/:id",
  authMiddleware, // Extract JWT data // Apply CASL abilities
  getPizza
);

module.exports = router;
