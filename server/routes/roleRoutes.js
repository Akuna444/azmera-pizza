const express = require("express");
const router = express.Router();
const {
  createRole,
  getRoles,
  updateRole,
} = require("../controllers/roleController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const authMiddleware = require("../middlewares/authMiddleware"); // Auth middleware to extract JWT
const validate = require("../middlewares/validate");
const roleSchema = require("../validations/role");

// Create role (with authentication, abilities, and validation)
router.post(
  "/add",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(roleSchema), // Validate request body
  createRole
);

// Get roles (with authentication)
router.get(
  "/roles",
  authMiddleware, // Extract JWT data
  getRoles
);

// Update role (with authentication, abilities, and validation)
router.put(
  "/:id",
  authMiddleware, // Extract JWT data
  applyAbilities, // Apply CASL abilities
  validate(roleSchema), // Validate request body
  updateRole
);

module.exports = router;
