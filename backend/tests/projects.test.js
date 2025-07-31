const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Projects Endpoints', () => {
  let testProject;

  beforeAll(async () => {
    // Create test project
    const result = await db.run(
      'INSERT INTO projects (title, description, technologies, featured, order_index) VALUES (?, ?, ?, ?, ?)',
      ['Test Project', 'Test Description', JSON.stringify(['React', 'Node.js']), true, 1]
    );
    testProject = { id: result.id, title: 'Test Project' };
  });

  afterAll(async () => {
    // Clean up test project
    await db.run('DELETE FROM projects WHERE id = ?', [testProject.id]);
    await db.db.close();
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return projects ordered by order_index and created_at', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      
      // Check if projects are ordered correctly
      const projects = response.body;
      for (let i = 1; i < projects.length; i++) {
        const prevOrder = projects[i - 1].order_index || 0;
        const currentOrder = projects[i].order_index || 0;
        expect(currentOrder).toBeGreaterThanOrEqual(prevOrder);
      }
    });

    it('should include required project fields', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      
      const project = response.body[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('technologies');
      expect(project).toHaveProperty('featured');
      expect(project).toHaveProperty('order_index');
      expect(project).toHaveProperty('created_at');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      const originalQuery = db.query;
      db.query = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');

      // Restore original function
      db.query = originalQuery;
    });
  });
}); 