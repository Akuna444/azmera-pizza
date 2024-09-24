const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Topping = require("./Topping");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pizzaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "OrderItems", // Ensure the correct table name
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

// Define many-to-many relationship between OrderItem and Topping
OrderItem.belongsToMany(Topping, {
  through: "OrderItemToppings", // Join table for toppings
  as: "customToppings",
  foreignKey: "orderItemId",
});
Topping.belongsToMany(OrderItem, {
  through: "OrderItemToppings",
  as: "customToppings",
  foreignKey: "toppingId",
});

module.exports = OrderItem;
