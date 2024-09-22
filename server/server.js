// server.js
require("dotenv").config(); // Load environment variables from .env
const app = require("./app"); // Import the Express app
const { connectDB } = require("./config/db"); // Import database connection
const http = require("http");

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = http.createServer(app);

// Connect to the database and start listening
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if database connection fails
  });
