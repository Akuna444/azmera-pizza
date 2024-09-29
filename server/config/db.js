// config/db.js
const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: false });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = { connectDB, sequelize };
