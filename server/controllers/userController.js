const { ForbiddenError } = require("@casl/ability");
const { subject } = require("@casl/ability");
const User = require("../models/User");

// Get the logged-in user's profile
const getUserProfile = async (req, res) => {
  const ability = req.ability; // CASL ability object from middleware

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has permission to read their profile
    ForbiddenError.from(ability).throwUnlessCan("read", subject("User", user));

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Update the logged-in user's profile
const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const ability = req.ability; // CASL ability object from middleware

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has permission to update their profile
    ForbiddenError.from(ability).throwUnlessCan(
      "update",
      subject("User", user)
    );

    // Update the user's profile
    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
