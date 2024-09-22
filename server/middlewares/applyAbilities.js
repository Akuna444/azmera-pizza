const Role = require("../models/Role");
const defineAbilitiesFor = require("../utils/casl");

async function applyAbilities(req, res, next) {
  const role = await Role.findByPk(req.user.roleId);

  if (!role) {
    return res.status(403).send("Role not found");
  }

  req.ability = defineAbilitiesFor(role);

  next();
}

module.exports = applyAbilities;
