const { ForbiddenError } = require("@casl/ability");
const { subject } = require("@casl/ability");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");

// Create a new pizza with default toppings
const createPizza = async (req, res) => {
  const { name, description, price, restaurantId, defaultToppings } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create pizzas
    ForbiddenError.from(ability).throwUnlessCan("create", "Pizza");

    // Create the pizza
    const pizza = await Pizza.create({
      name,
      description,
      price,
      restaurantId,
    });

    // Add default toppings if provided
    if (defaultToppings && defaultToppings.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: defaultToppings },
      });
      await pizza.addDefaultToppings(toppings);
    }

    res.status(201).json(pizza);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create pizza" });
  }
};

// Get all pizzas for a restaurant (with default toppings)
const getPizzas = async (req, res) => {
  const { restaurantId } = req.query;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to read pizzas
    ForbiddenError.from(ability).throwUnlessCan("read", "Pizza");

    const pizzas = await Pizza.findAll({
      where: { restaurantId },
      include: [{ model: Topping, as: "defaultToppings" }],
    });
    res.status(200).json(pizzas);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to fetch pizzas" });
  }
};

module.exports = { createPizza, getPizzas };
