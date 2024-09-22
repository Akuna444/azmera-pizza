// routes/pizzaRoutes.js
const express = require("express");
const { createPizza, updatePizza } = require("../controllers/pizzaController");
const { pizzaValidation } = require("../utils/validation");
const { validate } = require("../middlewares/validatorMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create a new pizza (restaurant manager only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["manager", "super_admin"]),
  pizzaValidation,
  validate,
  createPizza
);

// Update an existing pizza (restaurant manager only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["manager", "super_admin"]),
  pizzaValidation,
  validate,
  updatePizza
);

module.exports = router;
