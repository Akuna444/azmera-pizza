const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT
const validate = require("../middlewares/validate");
const {
  orderSchema,
  updateOrderStatusSchema,
} = require("../validations/order");

// Create order (with authentication, abilities, and validation)
router.post(
  "/orders",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities based on user's role
  validate(orderSchema), // Validate request body
  createOrder
);

// Get orders (with authentication and abilities)
router.get(
  "/orders",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  getOrders
);

// Update order status (with authentication, abilities, and validation)
router.put(
  "/orders/:id/status",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(updateOrderStatusSchema), // Validate request body
  updateOrderStatus
);

module.exports = router;
