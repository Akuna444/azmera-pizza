const { ForbiddenError } = require("@casl/ability");
const { subject } = require("@casl/ability");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");
const User = require("../models/User");

// Create a new order with multiple pizzas, quantities, and custom toppings
const createOrder = async (req, res) => {
  const { orderItems } = req.body; // No need for customerId since it's decoded from req.user
  const customerId = req.user.id; // Get the user ID from the decoded token
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create orders
    ForbiddenError.from(ability).throwUnlessCan("create", "Order");

    // Calculate the total cost for the order
    let totalCost = 0;

    // Create the order
    const order = await Order.create({
      customerId, // Use decoded customerId
      totalCost: 0, // Will update later after calculation
    });

    // Loop through each item in the orderItems array
    for (const item of orderItems) {
      const { pizzaId, quantity, customToppings } = item;

      const pizza = await Pizza.findByPk(pizzaId);
      if (!pizza) {
        return res
          .status(400)
          .json({ message: `Pizza with ID ${pizzaId} not found` });
      }

      // Calculate the cost for this pizza
      const itemCost = pizza.price * quantity;
      totalCost += itemCost;

      // Create the new OrderItem
      const orderItem = await OrderItem.create({
        orderId: order.id,
        pizzaId,
        quantity,
        price: pizza.price,
      });

      // If there are custom toppings, associate them with the new OrderItem
      if (customToppings && customToppings.length > 0) {
        const toppings = await Topping.findAll({
          where: { id: customToppings },
        });
        await orderItem.addCustomToppings(toppings);
        totalCost += toppings.length * 1.0 * quantity; // Assuming $1 per topping per quantity
      }
    }

    // Update the total cost of the order
    order.totalCost = totalCost;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders for a restaurant (with custom toppings)
const getOrders = async (req, res) => {
  const ability = req.ability; // CASL ability object from middleware
  const restaurantId = req.user.restaurantId;
  try {
    // Check if the user is allowed to read orders
    ForbiddenError.from(ability).throwUnlessCan("read", "Order", restaurantId);

    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "customer", // Include user details for each order
        },
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Pizza,
              as: "pizza", // Include pizza details for each order item
            },
            {
              model: Topping,
              as: "customToppings", // Include custom toppings for each pizza
            },
          ],
        },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
