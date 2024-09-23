const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure the authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user by the ID from the decoded token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Optionally fetch the role if needed
    const role = await Role.findByPk(user.roleId);

    if (!role) {
      return res.status(401).json({ message: "Role not found" });
    }

    // Attach the user and role to the request object
    req.user = { ...user.get(), role }; // Use .get() to get plain object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in authMiddleware:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
