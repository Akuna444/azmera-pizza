const { z } = require("zod");

const orderSchema = z.object({
  pizzaId: z.string().uuid("Invalid pizza ID"),
  customerId: z.string().uuid("Invalid customer ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customToppings: z.array(z.string().uuid()).optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["Preparing", "Delivered", "Cancelled"]),
});

module.exports = { orderSchema, updateOrderStatusSchema };
