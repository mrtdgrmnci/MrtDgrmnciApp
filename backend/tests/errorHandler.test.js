const request = require('supertest');
const express = require('express');
const { 
  errorHandler, 
  asyncHandler, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  DatabaseError 
} = require('../middleware/errorHandler');

// Create a test app
const app = express();

// Test route that throws different types of errors
app.get('/test-validation', (req, res, next) => {
  next(new ValidationError('Validation failed', [{ field: 'email', message: 'Invalid email' }]));
});

app.get('/test-auth', (req, res, next) => {
  next(new AuthenticationError('Invalid credentials'));
});

app.get('/test-authorization', (req, res, next) => {
  next(new AuthorizationError('Insufficient permissions'));
});

app.get('/test-not-found', (req, res, next) => {
  next(new NotFoundError('User not found'));
});

app.get('/test-database', (req, res, next) => {
  next(new DatabaseError('Connection failed'));
});

app.get('/test-sqlite-constraint', (req, res, next) => {
  const error = new Error('UNIQUE constraint failed');
  error.code = 'SQLITE_CONSTRAINT';
  next(error);
});

app.get('/test-sqlite-busy', (req, res, next) => {
  const error = new Error('database is locked');
  error.code = 'SQLITE_BUSY';
  next(error);
});

app.get('/test-jwt-invalid', (req, res, next) => {
  const error = new Error('invalid signature');
  error.name = 'JsonWebTokenError';
  next(error);
});

app.get('/test-jwt-expired', (req, res, next) => {
  const error = new Error('jwt expired');
  error.name = 'TokenExpiredError';
  next(error);
});

app.get('/test-validator', (req, res, next) => {
  const error = new Error('Validation failed');
  error.array = () => [{ field: 'email', message: 'Invalid email' }];
  next(error);
});

app.get('/test-generic', (req, res, next) => {
  next(new Error('Something went wrong'));
});

app.get('/test-custom-status', (req, res, next) => {
  const error = new Error('Custom error');
  error.statusCode = 418;
  next(error);
});

// Test async handler
app.get('/test-async-success', asyncHandler(async (req, res) => {
  res.json({ message: 'Success' });
}));

app.get('/test-async-error', asyncHandler(async (req, res) => {
  throw new Error('Async error');
}));

// Apply error handler
app.use(errorHandler);

describe('Error Handler Middleware', () => {
  describe('Custom Error Classes', () => {
    test('ValidationError should have correct properties', () => {
      const error = new ValidationError('Test message', [{ field: 'test' }]);
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual([{ field: 'test' }]);
    });

    test('AuthenticationError should have correct properties', () => {
      const error = new AuthenticationError('Auth failed');
      expect(error.name).toBe('AuthenticationError');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Auth failed');
    });

    test('AuthorizationError should have correct properties', () => {
      const error = new AuthorizationError('Access denied');
      expect(error.name).toBe('AuthorizationError');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    test('NotFoundError should have correct properties', () => {
      const error = new NotFoundError('Not found');
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not found');
    });

    test('DatabaseError should have correct properties', () => {
      const error = new DatabaseError('DB failed');
      expect(error.name).toBe('DatabaseError');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('DB failed');
    });
  });

  describe('Error Handler Responses', () => {
    test('should handle ValidationError', async () => {
      const response = await request(app).get('/test-validation');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Validation Error',
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Invalid email' }]
      });
    });

    test('should handle AuthenticationError', async () => {
      const response = await request(app).get('/test-auth');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Authentication Error',
        message: 'Invalid credentials'
      });
    });

    test('should handle AuthorizationError', async () => {
      const response = await request(app).get('/test-authorization');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        error: 'Authorization Error',
        message: 'Insufficient permissions'
      });
    });

    test('should handle NotFoundError', async () => {
      const response = await request(app).get('/test-not-found');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'User not found'
      });
    });

    test('should handle DatabaseError in development', async () => {
      process.env.NODE_ENV = 'development';
      const response = await request(app).get('/test-database');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Database Error',
        message: 'Connection failed'
      });
    });

    test('should handle DatabaseError in production', async () => {
      process.env.NODE_ENV = 'production';
      const response = await request(app).get('/test-database');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Database Error',
        message: 'Database operation failed'
      });
    });
  });

  describe('SQLite Specific Errors', () => {
    test('should handle SQLITE_CONSTRAINT error', async () => {
      const response = await request(app).get('/test-sqlite-constraint');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Constraint Error',
        message: 'Data constraint violation'
      });
    });

    test('should handle SQLITE_BUSY error', async () => {
      const response = await request(app).get('/test-sqlite-busy');
      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        error: 'Service Unavailable',
        message: 'Database is busy, please try again later'
      });
    });
  });

  describe('JWT Errors', () => {
    test('should handle JsonWebTokenError', async () => {
      const response = await request(app).get('/test-jwt-invalid');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Invalid Token',
        message: 'The provided token is invalid'
      });
    });

    test('should handle TokenExpiredError', async () => {
      const response = await request(app).get('/test-jwt-expired');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Token Expired',
        message: 'The provided token has expired'
      });
    });
  });

  describe('Express Validator Errors', () => {
    test('should handle express-validator errors', async () => {
      const response = await request(app).get('/test-validator');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Validation Error',
        message: 'Invalid input data',
        errors: [{ field: 'email', message: 'Invalid email' }]
      });
    });
  });

  describe('Generic Errors', () => {
    test('should handle generic errors in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const response = await request(app).get('/test-generic');
      process.env.NODE_ENV = originalEnv;
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Something went wrong',
        stack: expect.any(String)
      });
    });

    test('should handle generic errors in production', async () => {
      process.env.NODE_ENV = 'production';
      const response = await request(app).get('/test-generic');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Internal server error'
      });
    });

    test('should handle custom status codes', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const response = await request(app).get('/test-custom-status');
      process.env.NODE_ENV = originalEnv;
      expect(response.status).toBe(418);
      expect(response.body).toMatchObject({
        error: 'Internal Server Error',
        message: 'Custom error'
      });
      expect(response.body).toHaveProperty('stack');
    });
  });

  describe('Async Handler', () => {
    test('should handle successful async operations', async () => {
      const response = await request(app).get('/test-async-success');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Success' });
    });

    test('should handle async errors', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const response = await request(app).get('/test-async-error');
      process.env.NODE_ENV = originalEnv;
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: 'Internal Server Error',
        message: 'Async error'
      });
      expect(response.body).toHaveProperty('stack');
    });
  });
}); 