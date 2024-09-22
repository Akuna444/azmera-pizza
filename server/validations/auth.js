const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  location: z.string().optional(),
  phone_number: z.string().optional(),
});

const registerByAdminSchema = registerSchema.extend({
  roleId: z.string().uuid("Invalid role ID"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, registerByAdminSchema, loginSchema };
