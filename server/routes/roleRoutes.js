const express = require("express");
const router = express.Router();
const {
  createRole,
  getRoles,
  updateRole,
} = require("../controllers/roleController");
const applyAbilities = require("../middlewares/applyAbilities"); // CASL middleware
const validate = require("../middlewares/validate");
const roleSchema = require("../schemas/roleSchema");

// Create role (with validation)
router.post("/roles", applyAbilities, validate(roleSchema), createRole);

// Get roles
router.get("/roles", getRoles);

// Update role (with validation)
router.put("/roles/:id", applyAbilities, validate(roleSchema), updateRole);

module.exports = router;
