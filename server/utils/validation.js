// validation.js
const { body, param } = require("express-validator");

// User registration validation
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// User login validation
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Pizza creation validation
const pizzaValidation = [
  body("name").notEmpty().withMessage("Pizza name is required"),
  body("description").optional().isString(),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number and not negative"),
  body("restaurantId").isUUID().withMessage("Invalid restaurant ID"),
];

// Topping creation validation
const toppingValidation = [
  body("name").notEmpty().withMessage("Topping name is required"),
];

// Order creation validation
const orderValidation = [
  body("pizzaId").isUUID().withMessage("Invalid pizza ID"),
  body("customerId").isUUID().withMessage("Invalid customer ID"),
  body("totalCost")
    .isFloat({ min: 0 })
    .withMessage("Total cost must be a valid number and not negative"),
];

// Order status update validation
const updateOrderStatusValidation = [
  param("id").isUUID().withMessage("Invalid order ID"),
  body("status")
    .isIn(["pending", "preparing", "delivered"])
    .withMessage(
      "Invalid status. Must be one of pending, preparing, delivered"
    ),
];

module.exports = {
  registerValidation,
  loginValidation,
  pizzaValidation,
  toppingValidation,
  orderValidation,
  updateOrderStatusValidation,
};
