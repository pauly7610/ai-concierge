const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const errorResponse = {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      timestamp: new Date().toISOString()
    };
  
    // Log error for tracking
    if (statusCode >= 500) {
      // Potentially integrate with error tracking service
      console.error('Server Error:', errorResponse);
    }
  
    res.status(statusCode).json(errorResponse);
  };
  
  // Custom error classes
  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400;
    }
  }
  
  class AuthenticationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthenticationError';
      this.statusCode = 401;
    }
  }
  
  class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ForbiddenError';
      this.statusCode = 403;
    }
  }
  
  module.exports = {
    errorHandler,
    ValidationError,
    AuthenticationError,
    ForbiddenError
  };