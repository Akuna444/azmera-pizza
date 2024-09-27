const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Topping = require("./Topping");
const Pizza = require("./Pizza"); // Import the Pizza model
const User = require("./User");

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
    status: {
      type: DataTypes.ENUM("pending", "preparing", "ready", "delivered"),
      defaultValue: "pending",
    },
    pizzaId: {
      type: DataTypes.UUID,
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
  },
  {
    tableName: "OrderItems", // Ensure the correct table name
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

OrderItem.belongsTo(User, {
  foreignKey: "customerId", // Foreign key in Order
  as: "customer", // Alias for the relationship
});
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

OrderItem.belongsTo(Pizza, {
  foreignKey: "pizzaId", // Foreign key in OrderItem
  as: "pizza", // Alias for the relationship
});

Pizza.hasMany(OrderItem, {
  foreignKey: "pizzaId", // Foreign key in OrderItem
  as: "orderItems", // Alias for the relationship
});

module.exports = OrderItem;
