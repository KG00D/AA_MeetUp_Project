const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array()
      .filter(error => error.param === 'credential' || error.param === 'password')
      .map((error) => error.msg);
    const errorObj = {
      message: 'Validation error',
      statusCode: 400,
      errors: errors
    };
    return res.status(400).json(errorObj);
  }
  return next();
};

module.exports = {
  handleValidationErrors,
};



 