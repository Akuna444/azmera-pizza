const { z } = require("zod");

const pizzaSchema = z.object({
  name: z.string().min(1, "Pizza name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  defaultToppings: z.array(z.string().uuid()).optional(),
});

module.exports = pizzaSchema;
