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
    restaurantImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users", // Use the table name as a string to avoid circular dependency
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Define relationships after the model is defined
Restaurant.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Restaurant, { foreignKey: "ownerId" });

module.exports = Restaurant;
