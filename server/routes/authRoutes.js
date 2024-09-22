// routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../utils/validation");
const { validate } = require("../middlewares/validatorMiddleware"); // Validation middleware

const router = express.Router();

// User registration route
router.post("/register", registerValidation, validate, register);

// User login route
router.post("/login", loginValidation, validate, login);

module.exports = router;
