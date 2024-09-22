const express = require("express");
const router = express.Router();
const { createPizza, getPizzas } = require("../controllers/pizzaController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const pizzaSchema = require("../schemas/pizzaSchema");

// Create pizza (with validation)
router.post("/pizzas", applyAbilities, validate(pizzaSchema), createPizza);

// Get pizzas
router.get("/pizzas", applyAbilities, getPizzas);

module.exports = router;
