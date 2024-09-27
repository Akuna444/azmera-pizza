"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "customerId", {
      type: Sequelize.UUID,
      allowNull: false, // Set customerId to NOT NULL
      references: {
        model: "Users", // Assuming customerId references the User model
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // or 'CASCADE' if you want to delete orders when a customer is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "customerId", {
      type: Sequelize.UUID,
      allowNull: true, // Rollback to allow NULL if necessary
    });
  },
};
