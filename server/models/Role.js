// models/Role.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Set default to true
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: true, // Optional: Set to false if required
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Store permissions as an array of enums
      allowNull: false,
      defaultValue: [], // Default to an empty array
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Role;
