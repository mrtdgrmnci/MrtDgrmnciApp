const logger = require('./logger');

/**
 * Custom error classes
 */
class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

class AuthorizationError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class DatabaseError extends Error {
  constructor(message = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle known error types
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: 'Validation Error',
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(err.statusCode).json({
      error: 'Authentication Error',
      message: err.message
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      error: 'Authorization Error',
      message: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: 'Not Found',
      message: err.message
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).json({
      error: 'Database Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed'
    });
  }

  // Handle SQLite specific errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Constraint Error',
      message: 'Data constraint violation'
    });
  }

  if (err.code === 'SQLITE_BUSY') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database is busy, please try again later'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The provided token has expired'
    });
  }

  // Handle validation errors from express-validator
  if (err.array) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      errors: err.array()
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  res.status(statusCode).json({
    error: 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError
}; 