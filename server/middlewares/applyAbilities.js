const Role = require("../models/Role");
const defineAbilitiesFor = require("../utils/casl");

async function applyAbilities(req, res, next) {
  try {
    // Ensure req.user exists before proceeding
    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }

    // Fetch the role based on roleId
    const role = await Role.findByPk(req.user.roleId);

    if (!role) {
      return res.status(403).send("Role not found");
    }

    // Define abilities for the user based on their role
    req.ability = defineAbilitiesFor({ ...req.user, role });

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in applyAbilities middleware:", error);
    return res.status(500).send("Internal server error");
  }
}

module.exports = applyAbilities;
