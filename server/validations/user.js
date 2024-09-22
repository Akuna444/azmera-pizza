const { z } = require("zod");

const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
});

module.exports = updateUserProfileSchema;
