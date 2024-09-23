// models/Topping.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Pizza = require("./Pizza");

const Topping = sequelize.define(
  "Topping",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Topping;
