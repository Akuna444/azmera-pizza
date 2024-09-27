const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const OrderItem = require("./OrderItem");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define the one-to-many relationship between Order and OrderItem

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

module.exports = Order;
