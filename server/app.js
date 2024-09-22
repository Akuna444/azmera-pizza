// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes"); // Add role routes

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes); // Add role routes

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
