const { ForbiddenError } = require("@casl/ability");
const Topping = require("../models/Topping");

// Create a new topping
const createTopping = async (req, res) => {
  const { name } = req.body;
  const ability = req.ability;
  try {
    // Check if topping with the same name already exists
    const existingTopping = await Topping.findOne({ where: { name } });
    if (existingTopping) {
      return res.status(400).json({ message: "Topping already exists" });
    }
    // Check if the user is allowed to update the topping
    ForbiddenError.from(ability).throwUnlessCan("create", "Topping");
    // Create the topping
    const topping = await Topping.create({ name });
    res.status(201).json(topping);
  } catch (error) {
    res.status(500).json({ message: "Failed to create topping" });
  }
};

// Get all toppings
const getToppings = async (req, res) => {
  try {
    const toppings = await Topping.findAll();
    res.status(200).json(toppings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch toppings" });
  }
};

// Update a topping (only super admins can update)
const updateTopping = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Find the topping by ID
    const topping = await Topping.findByPk(id);
    if (!topping) {
      return res.status(404).json({ message: "Topping not found" });
    }

    // Check if the user is allowed to update the topping
    ForbiddenError.from(ability).throwUnlessCan("update", "Topping");

    // Update the topping
    topping.name = name || topping.name;
    await topping.save();

    res.status(200).json(topping);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update topping" });
  }
};

// Delete a topping (optional: restrict to super admins)
const deleteTopping = async (req, res) => {
  const { id } = req.params;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Find the topping by ID
    const topping = await Topping.findByPk(id);
    if (!topping) {
      return res.status(404).json({ message: "Topping not found" });
    }

    // Check if the user is allowed to delete the topping (optional)
    ForbiddenError.from(ability).throwUnlessCan("delete", "Topping");

    // Delete the topping
    await topping.destroy();
    res.status(200).json({ message: "Topping deleted" });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete topping" });
  }
};

module.exports = {
  createTopping,
  getToppings,
  updateTopping,
  deleteTopping,
};
