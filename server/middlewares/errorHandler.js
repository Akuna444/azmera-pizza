// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (you can add logging services like Winston or Sentry here)
  console.error(err.stack);

  // Define default values for status and message
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status code isn't set
  const message = err.message || "Internal Server Error";

  // Send the error response as JSON
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  });
};

// Catch 404 errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
