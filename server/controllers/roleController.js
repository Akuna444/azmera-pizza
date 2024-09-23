const { ForbiddenError } = require("@casl/ability");
const Role = require("../models/Role");

// Create a new role with permissions (only for super admins)
const createRole = async (req, res) => {
  const { name, permissions } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create roles
    ForbiddenError.from(ability).throwUnlessCan("create", "Role");

    // Validate permissions (ensure they are part of the defined enum)
    // const validPermissions = Role.rawAttributes.permissions.values;
    // const invalidPermissions = permissions.filter(
    //   (permission) => !validPermissions.includes(permission)
    // );
    // if (invalidPermissions.length > 0) {
    //   return res.status(400).json({
    //     message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
    //   });
    // }

    // Create the new role
    const role = await Role.create({
      name,
      permissions, // Assign permissions to the role
    });

    res.status(201).json(role);
  } catch (error) {
    console.log(error);
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

// Update an existing role (only for super admins)
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to update roles
    ForbiddenError.from(ability).throwUnlessCan("update", "Role");

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Validate permissions
    const validPermissions = Role.rawAttributes.permissions.values;
    const invalidPermissions = permissions.filter(
      (permission) => !validPermissions.includes(permission)
    );
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
      });
    }

    // Update the role
    role.name = name || role.name;
    role.permissions = permissions || role.permissions;

    await role.save();

    res.status(200).json(role);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update role" });
  }
};

module.exports = { createRole, getRoles, updateRole };
