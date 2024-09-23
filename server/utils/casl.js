const { AbilityBuilder, Ability } = require("@casl/ability");

function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role.name === "super_admin") {
    // Super Admins can manage everything
    can("manage", "all");
  }

  if (user.role.name === "restaurant_manager") {
    const restaurantId = user.restaurantId;
    // Managers can manage only their restaurant's resources
    can("manage", "Pizza", { restaurantId }); // Can manage pizzas in their restaurant
    can("manage", "Topping", { restaurantId }); // Can manage toppings in their restaurant
    can("read", "Order", { restaurantId }); // Can read orders for their restaurant
    can("update", "Order", { restaurantId, status: true }); // Can update the order status for their restaurant's orders
    can("read", "Customer", { restaurantId }); // Can read customers of their restaurant
    can("create", "User", { restaurantId }); // Can create users for their restaurant
    can("create", "Role", { restaurantId }); // Can create roles for their restaurant
  }
  // Map your role permissions to CASL abilities
  user.role.permissions.forEach((permission) => {
    switch (permission) {
      case "update_order_status":
        can("update", "Order", { status: true });
        break;
      case "see_orders":
        can("read", "Order");
        break;
      case "add_users":
        can("create", "User");
        break;
      case "see_customers":
        can("read", "Customer");
        break;
      case "create_roles":
        can("create", "Role");
        break;
      default:
        break;
    }
  });

  // Return the built ability
  return build();
}

module.exports = defineAbilitiesFor;
