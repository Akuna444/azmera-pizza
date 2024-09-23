const { z } = require("zod");

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  permissions: z
    .array(
      z.enum([
        "restaurant_manager",
        "update_order_status",
        "see_orders",
        "add_users",
        "see_customers",
        "create_roles",
        "super_admin",
      ])
    )
    .nonempty("At least one permission is required"),
});

module.exports = roleSchema;
