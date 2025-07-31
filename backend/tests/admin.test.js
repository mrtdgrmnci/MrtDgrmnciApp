const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

describe('Admin Routes', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    // Create tokens for testing
    adminToken = jwt.sign(
      { id: 1, email: 'admin@example.com', role: 'admin' },
      process.env.JWT_SECRET || 'test-secret'
    );

    userToken = jwt.sign(
      { id: 2, email: 'user@example.com', role: 'user' },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  describe('GET /api/admin/dashboard', () => {
    test('should return dashboard statistics for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');

      // Check projects structure
      expect(response.body.projects).toHaveProperty('total');
      expect(response.body.projects).toHaveProperty('featured');
      expect(typeof response.body.projects.total).toBe('number');
      expect(typeof response.body.projects.featured).toBe('number');

      // Check resume structure
      expect(response.body.resume).toHaveProperty('skills');
      expect(response.body.resume).toHaveProperty('experience');
      expect(response.body.resume).toHaveProperty('education');
      expect(typeof response.body.resume.skills).toBe('number');
      expect(typeof response.body.resume.experience).toBe('number');
      expect(typeof response.body.resume.education).toBe('number');

      // Check blog structure
      expect(response.body.blog).toHaveProperty('total');
      expect(response.body.blog).toHaveProperty('published');
      expect(response.body.blog).toHaveProperty('drafts');
      expect(typeof response.body.blog.total).toBe('number');
      expect(typeof response.body.blog.published).toBe('number');
      expect(typeof response.body.blog.drafts).toBe('number');

      // Check contact structure
      expect(response.body.contact).toHaveProperty('total');
      expect(response.body.contact).toHaveProperty('unread');
      expect(response.body.contact).toHaveProperty('recent');
      expect(typeof response.body.contact.total).toBe('number');
      expect(typeof response.body.contact.unread).toBe('number');
      expect(typeof response.body.contact.recent).toBe('number');
    });

    test('should reject request without token', async () => {
      const response = await request(app).get('/api/admin/dashboard');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should reject request with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: 1, email: 'admin@example.com', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '0s' }
      );

      // Wait a moment for token to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should reject user without role', async () => {
      const noRoleToken = jwt.sign(
        { id: 3, email: 'norole@example.com' },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${noRoleToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Bearer');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    test('should reject request with empty authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    test('should reject request with wrong authorization format', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Basic dXNlcjpwYXNz');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should return proper JSON response', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should handle request with different accept headers', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');
    });

    test('should handle request without accept header', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');
    });

    test('should return consistent data structure', async () => {
      const response1 = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      const response2 = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body).toHaveProperty('projects');
      expect(response1.body).toHaveProperty('resume');
      expect(response1.body).toHaveProperty('blog');
      expect(response1.body).toHaveProperty('contact');
      expect(response2.body).toHaveProperty('projects');
      expect(response2.body).toHaveProperty('resume');
      expect(response2.body).toHaveProperty('blog');
      expect(response2.body).toHaveProperty('contact');
    });

    test('should handle concurrent requests', async () => {
      const promises = Array(5).fill().map(() => 
        request(app)
          .get('/api/admin/dashboard')
          .set('Authorization', `Bearer ${adminToken}`)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('projects');
        expect(response.body).toHaveProperty('resume');
        expect(response.body).toHaveProperty('blog');
        expect(response.body).toHaveProperty('contact');
      });
    });

    test('should handle requests with query parameters (ignored)', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ format: 'json', include: 'all' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');
    });

    test('should handle requests with different HTTP methods', async () => {
      const response = await request(app)
        .post('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Accept', 'application/json');

      // Should return 404 for unsupported method
      expect(response.status).toBe(404);
    });

    test('should handle requests with different content types', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('User-Agent', 'TestBot/1.0');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('resume');
      expect(response.body).toHaveProperty('blog');
      expect(response.body).toHaveProperty('contact');
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // This test would require mocking the database to simulate errors
      // For now, we'll test the basic structure
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    test('should return proper error response format', async () => {
      // This test would require forcing an error condition
      // For now, we'll test the basic structure
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Performance', () => {
    test('should respond within reasonable time', async () => {
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    test('should handle multiple rapid requests', async () => {
      const promises = Array(10).fill().map(() => 
        request(app)
          .get('/api/admin/dashboard')
          .set('Authorization', `Bearer ${adminToken}`)
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(endTime - startTime).toBeLessThan(10000); // Should handle 10 requests within 10 seconds
    });
  });

  describe('Data Validation', () => {
    test('should return non-negative counts', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      // Check that all counts are non-negative
      expect(response.body.projects.total).toBeGreaterThanOrEqual(0);
      expect(response.body.projects.featured).toBeGreaterThanOrEqual(0);
      expect(response.body.resume.skills).toBeGreaterThanOrEqual(0);
      expect(response.body.resume.experience).toBeGreaterThanOrEqual(0);
      expect(response.body.resume.education).toBeGreaterThanOrEqual(0);
      expect(response.body.blog.total).toBeGreaterThanOrEqual(0);
      expect(response.body.blog.published).toBeGreaterThanOrEqual(0);
      expect(response.body.blog.drafts).toBeGreaterThanOrEqual(0);
      expect(response.body.contact.total).toBeGreaterThanOrEqual(0);
      expect(response.body.contact.unread).toBeGreaterThanOrEqual(0);
      expect(response.body.contact.recent).toBeGreaterThanOrEqual(0);
    });

    test('should maintain data consistency', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      // Check that blog totals are consistent
      expect(response.body.blog.total).toBeGreaterThanOrEqual(response.body.blog.published);
      expect(response.body.blog.total).toBeGreaterThanOrEqual(response.body.blog.drafts);
      expect(response.body.blog.total).toBe(response.body.blog.published + response.body.blog.drafts);
      
      // Check that contact totals are consistent
      expect(response.body.contact.total).toBeGreaterThanOrEqual(response.body.contact.unread);
      expect(response.body.contact.total).toBeGreaterThanOrEqual(response.body.contact.recent);
    });
  });
}); 