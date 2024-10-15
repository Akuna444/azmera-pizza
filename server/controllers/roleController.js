const { ForbiddenError } = require("@casl/ability");
const Role = require("../models/Role");
const { Op } = require("sequelize");

// Create a new role with permissions (super admins don't need restaurantId)
const createRole = async (req, res) => {
  const { name, permissions } = req.body;
  const ability = req.ability; // CASL ability object from middleware
  const user = req.user; // Assuming req.user contains user details including role and restaurantId

  try {
    // Check if the user is allowed to create roles
    ForbiddenError.from(ability).throwUnlessCan("create", "Role");

    // Create the new role
    const role = await Role.create({
      name,
      permissions, // Assign permissions to the role
      restaurantId: user.role.name === "super_admin" ? null : user.restaurantId, // Only super_admin can assign restaurantId
    });

    res.status(201).json({success: true, data: role});
  } catch (error) {
    console.log(error);
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get all roles (excluding predefined roles like super_admin and restaurant_manager)
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: {
        name: {
          [Op.notIn]: ["super_admin", "restaurant_manager", "customer"],
        },
      },
    });
    res.status(200).json(roles);
  } catch (error) {
    console.log(error, "err");
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

// Update an existing role (only super_admin can update any role, others are limited to their restaurant)
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions, restaurantId } = req.body;
  const ability = req.ability; // CASL ability object from middleware
  const user = req.user; // Assuming req.user contains user details

  try {
    // Check if the user is allowed to update roles
    ForbiddenError.from(ability).throwUnlessCan("update", "Role");

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // For non-super_admin users, ensure they only update roles from their own restaurant
    if (
      user.role.name !== "super_admin" &&
      role.restaurantId !== user.restaurantId
    ) {
      return res.status(403).json({
        message: "You are not allowed to update roles for another restaurant.",
      });
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
    role.restaurantId =
      user.role.name === "super_admin" ? restaurantId : role.restaurantId; // Only super_admin can modify restaurantId

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
