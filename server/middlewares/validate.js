const { ZodError } = require("zod");

// Middleware to validate the request body
const validate = (schema) => (req, res, next) => {
  try {
    // Validate request body with Zod schema
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Send validation errors as a response
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

module.exports = validate;
