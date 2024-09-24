// models/Role.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const permissionsEnum = [
  "customer",
  "super_admin",
  "restaurant_manager",
  "update_order_status",
  "see_orders",
  "add_users",
  "see_customers",
  "create_roles",
];

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Role names must be unique
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...permissionsEnum)), // Store permissions as an array of enums
      allowNull: false,
      defaultValue: [], // Default to an empty array
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Role;
