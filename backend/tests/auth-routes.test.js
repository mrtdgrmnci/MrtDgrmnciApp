const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../server');

describe('Auth Routes', () => {
  let originalEnv;
  let testUser;
  let hashedPassword;

  beforeAll(async () => {
    originalEnv = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    
    // Create test user password
    hashedPassword = await bcrypt.hash('testpassword123', 10);
    testUser = {
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      created_at: new Date().toISOString()
    };
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      // Mock database response
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
      expect(response.body.user).not.toHaveProperty('password');

      db.get.mockRestore();
    });

    test('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'testpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors[0]).toHaveProperty('path', 'email');
    });

    test('should return validation error for short password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors[0]).toHaveProperty('path', 'password');
    });

    test('should return validation error for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'testpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    test('should return validation error for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    test('should return 401 for non-existent user', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');

      db.get.mockRestore();
    });

    test('should return 401 for incorrect password', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');

      db.get.mockRestore();
    });

    test('should handle database error', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.get.mockRestore();
    });

    test('should normalize email address', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: 'testpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');

      db.get.mockRestore();
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should return success message', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('should return user profile for authenticated user', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        role: 'user',
        created_at: new Date().toISOString()
      });

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('role', 'user');
      expect(response.body).toHaveProperty('created_at');

      db.get.mockRestore();
    });

    test('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token required');
    });

    test('should return 403 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    test('should return 403 for expired token', async () => {
      const expiredToken = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    test('should return 404 for non-existent user', async () => {
      const token = jwt.sign(
        { id: 999, email: 'nonexistent@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');

      db.get.mockRestore();
    });

    test('should handle database error', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const db = require('../config/database');
      jest.spyOn(db, 'get').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.get.mockRestore();
    });

    test('should return 403 for malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'InvalidFormat token123');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    test('should return 401 for empty authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token required');
    });
  });

  describe('Error Handling', () => {
    test('should handle concurrent login requests', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValue(testUser);

      const requests = Array(5).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'testpassword123'
          })
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
      });

      db.get.mockRestore();
    });

    test('should handle malformed JSON in login request', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "testpassword123"');

      expect(response.status).toBe(500);
    });
  });
}); 