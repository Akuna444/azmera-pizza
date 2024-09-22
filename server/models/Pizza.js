// models/Pizza.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Restaurant = require("./Restaurant");

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
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
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

// Relations
Pizza.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Pizza, { foreignKey: "restaurantId" });

module.exports = Pizza;
