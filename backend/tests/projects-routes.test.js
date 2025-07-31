const request = require('supertest');
const app = require('../server');

describe('Projects Routes', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'AI-Powered Test Automation Framework',
      description: 'Advanced test automation framework integrating AI capabilities',
      technologies: JSON.stringify(['Selenium', 'Java', 'AI/ML', 'TestNG']),
      image_url: 'https://via.placeholder.com/600x400/2563eb/ffffff?text=AI+Testing+Framework',
      github_url: 'https://github.com/mrtdgrmnci/ai-testing-framework',
      live_url: null,
      featured: true,
      order_index: 1,
      created_at: '2025-07-29T21:00:00.000Z'
    },
    {
      id: 2,
      title: 'Playwright E2E Testing Suite',
      description: 'Modern end-to-end testing framework using Playwright',
      technologies: JSON.stringify(['Playwright', 'TypeScript', 'API Testing']),
      image_url: 'https://via.placeholder.com/600x400/059669/ffffff?text=Playwright+Testing',
      github_url: 'https://github.com/mrtdgrmnci/playwright-suite',
      live_url: null,
      featured: true,
      order_index: 2,
      created_at: '2025-07-28T21:00:00.000Z'
    },
    {
      id: 3,
      title: 'Non-Featured Project',
      description: 'A regular project that is not featured',
      technologies: JSON.stringify(['React', 'Node.js']),
      image_url: 'https://via.placeholder.com/600x400/666666/ffffff?text=Regular+Project',
      github_url: 'https://github.com/mrtdgrmnci/regular-project',
      live_url: 'https://regular-project.example.com',
      featured: false,
      order_index: 3,
      created_at: '2025-07-27T21:00:00.000Z'
    }
  ];

  describe('GET /api/projects', () => {
    test('should return all projects ordered by order_index and created_at', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);
      
      // Check that technologies are parsed from JSON
      expect(response.body[0].technologies).toEqual(['Selenium', 'Java', 'AI/ML', 'TestNG']);
      expect(response.body[1].technologies).toEqual(['Playwright', 'TypeScript', 'API Testing']);
      expect(response.body[2].technologies).toEqual(['React', 'Node.js']);

      // Verify query was called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC',
        []
      );

      db.query.mockRestore();
    });

    test('should filter by featured projects when featured=true', async () => {
      const db = require('../config/database');
      const featuredProjects = mockProjects.filter(p => p.featured);
      jest.spyOn(db, 'query').mockResolvedValueOnce(featuredProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ featured: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body.every(p => p.featured)).toBe(true);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE featured = ? ORDER BY order_index ASC, created_at DESC',
        [true]
      );

      db.query.mockRestore();
    });

    test('should filter by non-featured projects when featured=false', async () => {
      const db = require('../config/database');
      const nonFeaturedProjects = mockProjects.filter(p => !p.featured);
      jest.spyOn(db, 'query').mockResolvedValueOnce(nonFeaturedProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ featured: 'false' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body.every(p => !p.featured)).toBe(true);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE featured = ? ORDER BY order_index ASC, created_at DESC',
        [false]
      );

      db.query.mockRestore();
    });

    test('should limit results when limit parameter is provided', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects.slice(0, 2));

      const response = await request(app)
        .get('/api/projects')
        .query({ limit: '2' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC LIMIT ?',
        [2]
      );

      db.query.mockRestore();
    });

    test('should combine featured filter and limit', async () => {
      const db = require('../config/database');
      const featuredProjects = mockProjects.filter(p => p.featured);
      jest.spyOn(db, 'query').mockResolvedValueOnce(featuredProjects.slice(0, 1));

      const response = await request(app)
        .get('/api/projects')
        .query({ featured: 'true', limit: '1' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].featured).toBe(true);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE featured = ? ORDER BY order_index ASC, created_at DESC LIMIT ?',
        [true, 1]
      );

      db.query.mockRestore();
    });

    test('should ignore limit when it is 0', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ limit: '0' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC',
        []
      );

      db.query.mockRestore();
    });

    test('should ignore limit when it is negative', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ limit: '-5' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC',
        []
      );

      db.query.mockRestore();
    });

    test('should ignore limit when it exceeds 100', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ limit: '150' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC',
        []
      );

      db.query.mockRestore();
    });

    test('should handle invalid limit parameter', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce(mockProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ limit: 'invalid' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC',
        []
      );

      db.query.mockRestore();
    });

    test('should handle empty projects result', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValueOnce([]);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);

      db.query.mockRestore();
    });

    test('should handle projects with null technologies', async () => {
      const db = require('../config/database');
      const projectsWithNullTech = [
        {
          ...mockProjects[0],
          technologies: null
        }
      ];
      jest.spyOn(db, 'query').mockResolvedValueOnce(projectsWithNullTech);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0].technologies).toEqual([]);

      db.query.mockRestore();
    });

    test('should handle database error', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.query.mockRestore();
    });

    test('should handle malformed JSON in technologies field', async () => {
      const db = require('../config/database');
      const projectsWithMalformedTech = [
        {
          ...mockProjects[0],
          technologies: 'invalid json'
        }
      ];
      jest.spyOn(db, 'query').mockResolvedValueOnce(projectsWithMalformedTech);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.query.mockRestore();
    });
  });

  describe('GET /api/projects/:id', () => {
    test('should return project by ID', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(mockProjects[0]);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'AI-Powered Test Automation Framework');
      expect(response.body.technologies).toEqual(['Selenium', 'Java', 'AI/ML', 'TestNG']);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE id = ?',
        ['1']
      );

      db.get.mockRestore();
    });

    test('should return 404 for non-existent project', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(null);

      const response = await request(app).get('/api/projects/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE id = ?',
        ['999']
      );

      db.get.mockRestore();
    });

    test('should handle project with null technologies', async () => {
      const db = require('../config/database');
      const projectWithNullTech = {
        ...mockProjects[0],
        technologies: null
      };
      jest.spyOn(db, 'get').mockResolvedValueOnce(projectWithNullTech);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body.technologies).toEqual([]);

      db.get.mockRestore();
    });

    test('should handle malformed JSON in technologies field', async () => {
      const db = require('../config/database');
      const projectWithMalformedTech = {
        ...mockProjects[0],
        technologies: 'invalid json'
      };
      jest.spyOn(db, 'get').mockResolvedValueOnce(projectWithMalformedTech);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.get.mockRestore();
    });

    test('should handle database error', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');

      db.get.mockRestore();
    });

    test('should handle invalid ID parameter', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(null);

      const response = await request(app).get('/api/projects/invalid');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM projects WHERE id = ?',
        ['invalid']
      );

      db.get.mockRestore();
    });

    test('should handle very large ID parameter', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValueOnce(null);

      const response = await request(app).get('/api/projects/999999999999999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');

      db.get.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('should handle concurrent requests', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValue(mockProjects);
      jest.spyOn(db, 'get').mockResolvedValue(mockProjects[0]);

      const requests = [
        request(app).get('/api/projects'),
        request(app).get('/api/projects/1'),
        request(app).get('/api/projects').query({ featured: 'true' }),
        request(app).get('/api/projects').query({ limit: '2' })
      ];

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      db.query.mockRestore();
      db.get.mockRestore();
    });

    test('should handle various query parameter combinations', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'query').mockResolvedValue(mockProjects);

      const testCases = [
        { featured: 'true', limit: '5' },
        { featured: 'false', limit: '10' },
        { limit: '1' },
        { featured: 'true' },
        {}
      ];

      for (const params of testCases) {
        const response = await request(app)
          .get('/api/projects')
          .query(params);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
      }

      db.query.mockRestore();
    });

    test('should handle special characters in ID parameter', async () => {
      const db = require('../config/database');
      jest.spyOn(db, 'get').mockResolvedValue(null);

      const specialIds = ['1%27', '1; DROP TABLE projects; --', '1\' OR 1=1 --'];

      for (const id of specialIds) {
        const response = await request(app).get(`/api/projects/${id}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Project not found');
      }

      db.get.mockRestore();
    });
  });
}); 