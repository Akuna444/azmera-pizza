// routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  orderValidation,
  updateOrderStatusValidation,
} = require("../utils/validation");
const { validate } = require("../middlewares/validatorMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Place a new order (customer only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["customer"]),
  orderValidation,
  validate,
  createOrder
);

// Update the status of an order (restaurant manager only)
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["manager", "super_admin"]),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);

module.exports = router;
