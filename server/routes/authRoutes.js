const express = require("express");
const router = express.Router();
const {
  register,
  registerByAdmin,
  addRestaurantManager,
  login,
  logout,
  adminlogin,
} = require("../controllers/authController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT data
const validate = require("../middlewares/validate");
const {
  registerSchema,
  registerByAdminSchema,
  loginSchema,
} = require("../validations/auth");

// Register user (with validation)
router.post("/register", validate(registerSchema), register);

// Register user by admin (with authentication and validation)
router.post(
  "/registerByAdmin",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(registerByAdminSchema),
  registerByAdmin
);

router.post("/add-manager", addRestaurantManager);

// User login (with validation)
router.post("/admin-login", validate(loginSchema), adminlogin);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

module.exports = router;
