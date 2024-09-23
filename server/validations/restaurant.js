const { body } = require("express-validator");

const restaurantSchema = [
  body("name")
    .notEmpty()
    .withMessage("Restaurant name is required")
    .isString()
    .withMessage("Restaurant name must be a string"),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),

  body("ownerId")
    .optional()
    .isUUID()
    .withMessage("Owner ID must be a valid UUID"),
];

module.exports = restaurantSchema;
