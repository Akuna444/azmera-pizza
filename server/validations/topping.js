const { z } = require("zod");

const toppingSchema = z.object({
  name: z.string().min(1, "Topping name is required"),
});

module.exports = toppingSchema;
