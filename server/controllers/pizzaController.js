const { ForbiddenError } = require("@casl/ability");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");

// Create a new pizza with default toppings (restricted by restaurant)
const createPizza = async (req, res) => {
  const { name, description, price, defaultToppings } = req.body;
  const ability = req.ability; // CASL ability object from middleware
  const restaurantId = req.user.restaurantId;
  console.log("redfj", req.user); // Get the restaurantId from the logged-in user

  console.log(restaurantId, "this is restuarantId");

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
    console.error(error);
    res.status(500).json({ message: "Failed to create pizza" });
  }
};

// Get all pizzas for a restaurant (with default toppings)
const getPizzas = async (req, res) => {
  const restaurantId = req.user.restaurantId; // Get the restaurantId from the logged-in user
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to read pizzas for their restaurant
    ForbiddenError.from(ability).throwUnlessCan("read", "Pizza", restaurantId);

    // Fetch pizzas only for the logged-in user's restaurant
    const pizzas = await Pizza.findAll({
      where: { restaurantId },
      include: [{ model: Topping, as: "defaultToppings" }],
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

module.exports = { createPizza, getPizzas };
