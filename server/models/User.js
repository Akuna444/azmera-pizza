const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Role = require("./Role");

const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Restaurants", // Use the table name as a string to avoid circular dependency
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Define relationships after the model is defined
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

module.exports = User;
