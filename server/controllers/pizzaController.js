const { ForbiddenError } = require("@casl/ability");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");
const Restaurant = require("../models/Restaurant");

// Create a new pizza with default toppings (restricted by restaurant)
const createPizza = async (req, res) => {
  const { name, description, price, defaultToppings } = req.body;
  const ability = req.ability; // CASL ability object from middleware
  const restaurantId = req.user.restaurantId;

  try {
    // Check if the user is allowed to create pizzas for their restaurant
    ForbiddenError.from(ability).throwUnlessCan(
      "create",
      "Pizza",
      restaurantId
    );

    // Create the pizza for the manager's restaurant
    const pizza = await Pizza.create({
      name,
      description,
      price,
      restaurantId, // Associate the pizza with the manager's restaurant
      imageUrl: req.file ? req.file.path : null, // Save the uploaded image file path
    });

    // Add default toppings if provided
    if (defaultToppings && defaultToppings.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: defaultToppings },
      });
      await pizza.addDefaultToppings(toppings);
    }

    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create pizza" });
  }
};
// Get all pizzas for a restaurant (with default toppings)
const getPizzas = async (req, res) => {
  const { restaurantId } = req.user; // Assuming `restaurantId` is stored in the user object from the middleware

  try {
    const pizzas = await Pizza.findAll({
      include: [
        { model: Topping, as: "defaultToppings" },
        { model: Restaurant }, // Include default toppings
      ],
    });

    res.status(200).json(pizzas);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pizzas" });
  }
};

const getPizza = async (req, res) => {
  const { id } = req.params; // Assuming `restaurantId` is stored in the user object from the middleware

  try {
    const pizza = await Pizza.findByPk(id, {
      include: [
        { model: Topping, as: "defaultToppings" },
        { model: Restaurant }, // Include default toppings
      ],
    });

    res.status(200).json(pizza);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pizzas" });
  }
};

module.exports = { createPizza, getPizza, getPizzas };
