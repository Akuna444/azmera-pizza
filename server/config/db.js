// config/db.js
const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: false }); // Uncomment this line if you want to drop tables and create new ones every time the server starts.
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = { connectDB, sequelize };
