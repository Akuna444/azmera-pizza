const Pizza = require("../models/Pizza");

// Get all pizzas for a restaurant
const getPizzas = async (req, res) => {
  const { restaurantId } = req.query;

  try {
    const pizzas = await Pizza.findAll({ where: { restaurantId } });
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pizzas" });
  }
};

// Get a specific pizza by ID
const getPizzaById = async (req, res) => {
  const { id } = req.params;

  try {
    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pizza" });
  }
};

// Create a new pizza
const createPizza = async (req, res) => {
  const { name, description, price, restaurantId } = req.body;

  try {
    const pizza = await Pizza.create({
      name,
      description,
      price,
      restaurantId,
    });
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to create pizza" });
  }
};

// Update an existing pizza
const updatePizza = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    let pizza = await Pizza.findByPk(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    // Update the pizza
    pizza.name = name;
    pizza.description = description;
    pizza.price = price;
    await pizza.save();

    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pizza" });
  }
};

// Delete a pizza
const deletePizza = async (req, res) => {
  const { id } = req.params;

  try {
    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    await pizza.destroy();
    res.status(200).json({ message: "Pizza deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pizza" });
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};
