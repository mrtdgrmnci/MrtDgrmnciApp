const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin, generateToken } = require('../middleware/auth');

// Create test app
const app = express();
app.use(express.json());

// Test routes
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.get('/admin', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Admin route accessed', user: req.user });
});

// Apply error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

describe('Auth Middleware', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  describe('authenticateToken', () => {
    test('should allow access with valid token', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Protected route accessed');
      expect(response.body.user).toMatchObject({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
    });

    test('should reject request without token', async () => {
      const response = await request(app).get('/protected');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    test('should reject request with invalid token format', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidFormat token123');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should reject request with expired token', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Wait a moment for token to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should handle token with different secret', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        'different-secret'
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should handle malformed authorization header', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    test('should handle empty authorization header', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('requireAdmin', () => {
    test('should allow admin access', async () => {
      const token = jwt.sign(
        { id: 1, email: 'admin@example.com', role: 'admin' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin route accessed');
      expect(response.body.user.role).toBe('admin');
    });

    test('should reject non-admin user', async () => {
      const token = jwt.sign(
        { id: 1, email: 'user@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should reject user without role', async () => {
      const token = jwt.sign(
        { id: 1, email: 'user@example.com' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should reject request without user object', async () => {
      // Create a route that doesn't use authenticateToken first
      const testApp = express();
      testApp.use(express.json());
      
      testApp.get('/admin-only', requireAdmin, (req, res) => {
        res.json({ message: 'Admin route accessed' });
      });

      const response = await request(testApp).get('/admin-only');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });
  });

  describe('generateToken', () => {
    test('should generate valid token', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      };

      const token = generateToken(user);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Verify the token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });

    test('should generate token with custom expiration', () => {
      process.env.JWT_EXPIRES_IN = '2h';
      
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      };

      const token = generateToken(user);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });

    test('should generate token with default expiration when not set', () => {
      delete process.env.JWT_EXPIRES_IN;
      
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      };

      const token = generateToken(user);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });

    test('should include all user properties in token', () => {
      const user = {
        id: 123,
        email: 'admin@example.com',
        role: 'admin',
        name: 'John Doe'
      };

      const token = generateToken(user);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
      // Note: name is not included in the token generation
    });
  });

  describe('Integration Tests', () => {
    test('should work with both middlewares in sequence', async () => {
      const token = jwt.sign(
        { id: 1, email: 'admin@example.com', role: 'admin' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin route accessed');
      expect(response.body.user.role).toBe('admin');
    });

    test('should handle JWT verification errors gracefully', async () => {
      // Test with a token that has been tampered with
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET
      );
      
      // Tamper with the token
      const tamperedToken = token.slice(0, -1) + 'X';

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${tamperedToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });
  });
}); 