const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ForbiddenError } = require("@casl/ability");
const User = require("../models/User");
const Role = require("../models/Role");
const Restaurant = require("../models/Restaurant");
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
    let customerRole = await Role.findOne({ where: { name: "customer" } });
    if (!customerRole) {
      customerRole = await Role.create({
        name: "customer",
        permissions: ["customer"],
      });
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

    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    console.log(error);
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

    // Prevent the assignment of the super_admin role by non-super admins
    if (req.user.role.name !== "super_admin" && role.name === "super_admin") {
      return res.status(403).json({
        message: "You do not have permission to assign super_admin role",
      });
    }

    // Create the user with the specified role
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_number,
      roleId: role.id,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addRestaurantManager = async (req, res) => {
  const { name, email, password, location, phone_number, restaurantId } =
    req.body;

  console.log(req.body);

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get the "restaurant_manager" role
    let role = await Role.findOne({
      where: { name: "restaurant_manager" },
    });
    if (!role) {
      role = await Role.create({
        name: "restaurant_manager",
        permissions: ["restaurant_manager"],
      });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found" });
    }
    // Create the user with the role of "restaurant_manager"
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_number,
      roleId: role.id,
      restaurantId: restaurant.id, // Assign the manager to this restaurant
    });

    // Assign the created user as the owner/manager of the restaurant
    restaurant.ownerId = user.id;
    await restaurant.save();

    res
      .status(201)
      .json({ message: "Restaurant manager created successfully", user });
  } catch (error) {
    console.log(error, "err");
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login an existing user
const adminlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const role = await Role.findByPk(user.roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    console.log("thsi akd", role);

    if (user.Role.name === "customer") {
      return res.status(403).json({ message: "Unauthorized" });
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

    res.cookie("restaurantUser", token, {
      httpOnly: true, // Prevents access by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.Role.name,
      restaurantId: user.restaurantId,
      token,
    });
  } catch (error) {
    console.log(error, "errr");
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists and include their role
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate that the user has the role "customer"
    if (user.Role.name !== "customer") {
      return res.status(403).json({ message: "Only customers can log in" });
    }

    // Validate the password
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

    res.cookie("user", token, {
      httpOnly: true, // Prevents access by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });

    // Send a sanitized user object in the response
    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.Role.name,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error, "Error during login");
    res.status(500).json({ message: "Server error" });
  }
};

// Logout route in Express to clear both cookies
const logout = async (req, res) => {
  // Clear the 'user' cookie
  res.clearCookie("user", {
    path: "/", // Ensure this matches the path the cookie was set for
    httpOnly: true, // Same as the cookie's original settings
    secure: process.env.NODE_ENV === "production", // Use secure only in production
    sameSite: "strict", // Ensure SameSite settings are consistent
  });

  // Clear the 'restaurantUser' cookie
  res.clearCookie("restaurantUser", {
    path: "/", // Ensure this matches the path the cookie was set for
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send a response indicating successful logout
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  adminlogin,
  addRestaurantManager,
  registerByAdmin,
  login,
  logout,
};
