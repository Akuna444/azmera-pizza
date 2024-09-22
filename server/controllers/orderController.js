const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  const { pizzaId, customerId, totalCost } = req.body;

  try {
    const order = await Order.create({ pizzaId, customerId, totalCost });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders for a restaurant
const getOrders = async (req, res) => {
  const { restaurantId } = req.query;

  try {
    const orders = await Order.findAll({ where: { restaurantId } });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
