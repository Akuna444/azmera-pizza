const express = require("express");
const router = express.Router();
const {
  register,
  registerByAdmin,
  login,
} = require("../controllers/authController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const {
  registerSchema,
  registerByAdminSchema,
  loginSchema,
} = require("../schemas/authSchema");

// Register user (with validation)
router.post("/register", validate(registerSchema), register);

// Register user by admin (with validation)
router.post(
  "/registerByAdmin",
  applyAbilities,
  validate(registerByAdminSchema),
  registerByAdmin
);

// User login (with validation)
router.post("/login", validate(loginSchema), login);

module.exports = router;
