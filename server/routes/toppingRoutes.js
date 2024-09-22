const express = require("express");
const router = express.Router();
const {
  createTopping,
  getToppings,
  updateTopping,
  deleteTopping,
} = require("../controllers/toppingController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const toppingSchema = require("../schemas/toppingSchema");

// Create topping (with validation)
router.post("/toppings", validate(toppingSchema), createTopping);

// Get toppings
router.get("/toppings", getToppings);

// Update topping (with validation)
router.put(
  "/toppings/:id",
  applyAbilities,
  validate(toppingSchema),
  updateTopping
);

// Delete topping
router.delete("/toppings/:id", applyAbilities, deleteTopping);

module.exports = router;
