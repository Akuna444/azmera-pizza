// models/Pizza.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Restaurant = require("./Restaurant");
const Topping = require("./Topping");

const Pizza = sequelize.define(
  "Pizza",
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Restaurant,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pizza.sync({ force: true });
// Relations
Pizza.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Pizza, { foreignKey: "restaurantId" });

// Define many-to-many relationship between Pizza and Topping (default toppings)
Pizza.belongsToMany(Topping, {
  through: "PizzaToppings",
  as: "defaultToppings",
});
Topping.belongsToMany(Pizza, {
  through: "PizzaToppings",
  as: "defaultToppings",
});

module.exports = Pizza;
