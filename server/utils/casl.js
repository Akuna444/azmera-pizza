// utils/casl.js
const { AbilityBuilder, Ability } = require("@casl/ability");

function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === "super_admin") {
    can("manage", "all"); // Super admin can do everything
  } else if (user.role === "manager") {
    can("manage", "Order"); // Managers can manage orders
    can("manage", "Pizza"); // Managers can manage pizzas
    cannot("delete", "User"); // Managers cannot delete users
  } else if (user.role === "customer") {
    can("read", "Pizza"); // Customers can view pizzas
    can("create", "Order"); // Customers can place orders
  }

  return build();
}

module.exports = { defineAbilitiesFor };
