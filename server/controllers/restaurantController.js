const { ForbiddenError } = require("@casl/ability");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

// Create a new restaurant
const createRestaurant = async (req, res) => {
  const { name, location, ownerId } = req.body;

  try {
    // Check if the user has permission to create a restauran

    let owner = null;

    // Check if ownerId was provided
    if (ownerId) {
      owner = await User.findByPk(ownerId, { include: ["role"] }); // Include the role of the owner
      if (!owner) {
        return res.status(400).json({ message: "Owner not found" });
      }

      if (owner.role.name !== "restaurant_manager") {
        return res
          .status(400)
          .json({ message: "Owner must have the role of restaurant_manager" });
      }
    }

    // Create the restaurant
    const restaurant = await Restaurant.create({
      name,
      location,
      ownerId: owner ? owner.id : null, // Assign ownerId only if an owner was provided
    });

    // Update the owner with the newly created restaurant's ID if ownerId was provided
    if (owner) {
      owner.restaurantId = restaurant.id;
      await owner.save();
    }

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user has permission to view restaurants
    ForbiddenError.from(ability).throwUnlessCan("read", "Restaurant");

    // Fetch all restaurants
    const restaurants = await Restaurant.findAll();

    res.status(200).json(restaurants);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a restaurant
const updateRestaurant = async (req, res) => {
  const ability = req.ability; // CASL ability object from middleware
  const { id } = req.params;
  const { name, location, ownerId } = req.body;

  try {
    // Check if the user has permission to update a restaurant
    ForbiddenError.from(ability).throwUnlessCan("update", "Restaurant");

    // Check if the restaurant exists
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the owner exists
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({ message: "Owner not found" });
      }
    }

    // Update the restaurant
    restaurant.name = name || restaurant.name;
    restaurant.location = location || restaurant.location;
    restaurant.ownerId = ownerId || restaurant.ownerId;

    await restaurant.save();

    res
      .status(200)
      .json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a restaurant
const deleteRestaurant = async (req, res) => {
  const ability = req.ability; // CASL ability object from middleware
  const { id } = req.params;

  try {
    // Check if the user has permission to delete a restaurant
    ForbiddenError.from(ability).throwUnlessCan("delete", "Restaurant");

    // Check if the restaurant exists
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Delete the restaurant
    await restaurant.destroy();

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
};
