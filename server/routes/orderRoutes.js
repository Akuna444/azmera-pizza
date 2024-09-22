const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const {
  orderSchema,
  updateOrderStatusSchema,
} = require("../schemas/orderSchema");

// Create order (with validation)
router.post("/orders", applyAbilities, validate(orderSchema), createOrder);

// Get orders
router.get("/orders", applyAbilities, getOrders);

// Update order status (with validation)
router.put(
  "/orders/:id/status",
  applyAbilities,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

module.exports = router;
