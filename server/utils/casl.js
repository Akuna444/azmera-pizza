const { AbilityBuilder, Ability } = require("@casl/ability");

function defineAbilitiesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  // Map your role permissions to CASL abilities
  role.permissions.forEach((permission) => {
    switch (permission) {
      case "super_admin":
        can("manage", "User");
        can("manage", "Order");
        can("manage", "Topping");
        can("manage", "Role");
        can("manage", "Pizza");
        can("manage", "Customer");
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
