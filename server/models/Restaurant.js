// models/Restaurant.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Restaurant = sequelize.define(
  "Restaurant",
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
    location: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Relations
Restaurant.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Restaurant, { foreignKey: "ownerId" });

module.exports = Restaurant;
