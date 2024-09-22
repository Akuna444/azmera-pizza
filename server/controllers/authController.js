const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ForbiddenError } = require("@casl/ability");
const User = require("../models/User");
const Role = require("../models/Role");
// Register a new user (Customer)
const register = async (req, res) => {
  const { name, email, password, location, phone_number } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find the "customer" role by its name
    const customerRole = await Role.findOne({ where: { name: "customer" } });
    if (!customerRole) {
      return res.status(500).json({ message: "Customer role not found" });
    }

    // Create the user with the "customer" role
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_number,
      roleId: customerRole.id, // Assign the customer role
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register a user by Super Admin (with specified role)
const registerByAdmin = async (req, res) => {
  const { name, email, password, roleId, location, phone_number } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create users with roles
    ForbiddenError.from(ability).throwUnlessCan("create", "User");

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Ensure the role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    // Create the user with the specified role
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_number,
      roleId: role.id, // Assign the role provided by the super admin
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, registerByAdmin, login };
