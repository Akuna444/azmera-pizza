// models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Pizza = require("./Pizza");
const Topping = require("./Topping");

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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default to 1 if not provided
      validate: {
        min: 1,
      },
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

// Define many-to-many relationship between Order and Topping (custom toppings for each order)
Order.belongsToMany(Topping, {
  through: "OrderToppings",
  as: "customToppings",
});
Topping.belongsToMany(Order, {
  through: "OrderToppings",
  as: "customToppings",
});

module.exports = Order;
