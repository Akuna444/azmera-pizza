// middlewares/roleMiddleware.js
const { defineAbilitiesFor } = require("../utils/casl"); // Ability definitions (CASL.js)

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    // Check if the user's role is allowed for the route
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Optionally: Add more permission checks using CASL abilities
    const ability = defineAbilitiesFor(req.user);
    if (!ability.can("manage", "Order")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

module.exports = { roleMiddleware };
