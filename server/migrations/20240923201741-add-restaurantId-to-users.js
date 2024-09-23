"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add restaurantId column to Users table
    await queryInterface.addColumn("Users", "restaurantId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "Restaurants", // Table name for the reference
        key: "id",
      },
      onUpdate: "CASCADE", // Optional: update related rows if the referenced id changes
      onDelete: "SET NULL", // Optional: set restaurantId to null if the referenced restaurant is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove restaurantId column from Users table
    await queryInterface.removeColumn("Users", "restaurantId");
  },
};
