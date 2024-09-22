// controllers/userController.js
const User = require("../models/User");

// Get the logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Update the logged-in user's profile
const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
