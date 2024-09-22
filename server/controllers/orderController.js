const { ForbiddenError } = require("@casl/ability");
const { subject } = require("@casl/ability");
const Order = require("../models/Order");
const Topping = require("../models/Topping");
const Pizza = require("../models/Pizza");
const defineAbilitiesFor = require("../abilities");

// Create a new order with custom toppings and quantity
const createOrder = async (req, res) => {
  const { pizzaId, customerId, quantity, customToppings } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create orders
    ForbiddenError.from(ability).throwUnlessCan("create", "Order");

    // Fetch the pizza price
    const pizza = await Pizza.findByPk(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    // Calculate the base cost (pizza price * quantity)
    let totalCost = pizza.price * quantity;

    // Add the cost of custom toppings if provided
    if (customToppings && customToppings.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: customToppings },
      });

      totalCost += toppings.length * 1.0 * quantity;

      // Create the order with custom toppings
      const order = await Order.create({
        pizzaId,
        customerId,
        totalCost,
        quantity,
      });
      await order.addCustomToppings(toppings);

      res.status(201).json(order);
    } else {
      // No custom toppings, create the order with just pizza and quantity
      const order = await Order.create({
        pizzaId,
        customerId,
        totalCost,
        quantity,
      });
      res.status(201).json(order);
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders for a restaurant (with custom toppings)
const getOrders = async (req, res) => {
  const { restaurantId } = req.query;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to read orders
    ForbiddenError.from(ability).throwUnlessCan("read", "Order");

    const orders = await Order.findAll({
      where: { restaurantId },
      include: [{ model: Topping, as: "customToppings" }],
    });

    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the user is allowed to update the status of this order
    ForbiddenError.from(ability).throwUnlessCan(
      "update",
      subject("Order", order)
    );

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
