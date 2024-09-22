// models/Order.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Pizza = require("./Pizza");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered"),
      defaultValue: "pending",
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    pizzaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Pizza,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Relations
Order.belongsTo(User, { foreignKey: "customerId" });
Order.belongsTo(Pizza, { foreignKey: "pizzaId" });

User.hasMany(Order, { foreignKey: "customerId" });
Pizza.hasMany(Order, { foreignKey: "pizzaId" });

module.exports = Order;
