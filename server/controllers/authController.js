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

    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register a user by Super Admin (with specified role)
const registerByAdmin = async (req, res) => {
  const {
    name,
    email,
    password,
    roleId,
    location,
    phone_number,
    restaurantId,
  } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    // Check if the user is allowed to create users with roles
    ForbiddenError.from(ability).throwUnlessCan("create", "User");

    console.log(req.user, "Current >>> user");
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

    // Check if the manager is trying to assign the super_admin role
    if (
      req.user.role.name === "restaurant_manager" &&
      role.name === "super_admin"
    ) {
      return res
        .status(403)
        .json({ message: "Managers cannot assign the super_admin role" });
    }

    // Determine the restaurantId
    let assignedRestaurantId;

    if (req.user.role.name === "restaurant_manager") {
      // Manager: Automatically assign the restaurantId from the manager's restaurant
      const manager = await User.findByPk(req.user.id, { include: Restaurant });
      if (!manager.restaurantId) {
        return res
          .status(400)
          .json({ message: "Manager is not associated with a restaurant" });
      }
      assignedRestaurantId = manager.restaurantId;
    } else if (req.user.role.name === "super_admin") {
      // Super Admin: Use the provided restaurantId
      if (!restaurantId) {
        return res
          .status(400)
          .json({ message: "Restaurant ID is required for Super Admin" });
      }

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return res.status(400).json({ message: "Restaurant not found" });
      }
      assignedRestaurantId = restaurantId;
    } else {
      return res
        .status(403)
        .json({ message: "You do not have permission to create users" });
    }

    // Create the user with the specified role and restaurant
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_number,
      roleId: role.id,
      restaurantId: assignedRestaurantId, // Assign the restaurantId
    });
    console.log(user, "usa created");
    if (role.name === "restaurant_manager") {
      const restaurant = await Restaurant.findByPk(assignedRestaurantId);
      restaurant.ownerId = user.id;
      await restaurant.save();
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
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
    console.log(error, "errr");
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, registerByAdmin, login };
