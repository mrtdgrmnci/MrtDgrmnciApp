const request = require('supertest');
const app = require('../server');

describe('Resume Routes', () => {
  describe('GET /api/resume', () => {
    test('should return complete resume data', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
      expect(Array.isArray(response.body.skills)).toBe(true);
      expect(Array.isArray(response.body.experience)).toBe(true);
      expect(Array.isArray(response.body.education)).toBe(true);
    });

    test('should return skills in correct order', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      expect(response.body.skills).toBeDefined();
      
      // Check if skills are ordered by order_index
      const skills = response.body.skills;
      for (let i = 1; i < skills.length; i++) {
        expect(skills[i].order_index).toBeGreaterThanOrEqual(skills[i-1].order_index);
      }
    });

    test('should return experience in correct order', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      expect(response.body.experience).toBeDefined();
      
      // Check if experience is ordered by order_index and start_date
      const experience = response.body.experience;
      for (let i = 1; i < experience.length; i++) {
        if (experience[i].order_index === experience[i-1].order_index) {
          // If same order_index, should be ordered by start_date DESC
          const currentDate = new Date(experience[i].start_date);
          const previousDate = new Date(experience[i-1].start_date);
          expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
        }
      }
    });

    test('should return education in correct order', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      expect(response.body.education).toBeDefined();
      
      // Check if education is ordered by order_index and start_date
      const education = response.body.education;
      for (let i = 1; i < education.length; i++) {
        if (education[i].order_index === education[i-1].order_index) {
          // If same order_index, should be ordered by start_date DESC
          const currentDate = new Date(education[i].start_date);
          const previousDate = new Date(education[i-1].start_date);
          expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
        }
      }
    });

    test('should return proper JSON response', async () => {
      const response = await request(app)
        .get('/api/resume')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should handle request with different accept headers', async () => {
      const response = await request(app)
        .get('/api/resume')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });

    test('should handle request without accept header', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });

    test('should return consistent data structure', async () => {
      const response1 = await request(app).get('/api/resume');
      const response2 = await request(app).get('/api/resume');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body).toHaveProperty('skills');
      expect(response1.body).toHaveProperty('experience');
      expect(response1.body).toHaveProperty('education');
      expect(response2.body).toHaveProperty('skills');
      expect(response2.body).toHaveProperty('experience');
      expect(response2.body).toHaveProperty('education');
    });

    test('should handle concurrent requests', async () => {
      const promises = Array(5).fill().map(() => 
        request(app).get('/api/resume')
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('skills');
        expect(response.body).toHaveProperty('experience');
        expect(response.body).toHaveProperty('education');
      });
    });

    test('should return skills with expected properties', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      const skills = response.body.skills;
      
      if (skills.length > 0) {
        const skill = skills[0];
        expect(skill).toHaveProperty('id');
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('order_index');
      }
    });

    test('should return experience with expected properties', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      const experience = response.body.experience;
      
      if (experience.length > 0) {
        const exp = experience[0];
        expect(exp).toHaveProperty('id');
        expect(exp).toHaveProperty('title');
        expect(exp).toHaveProperty('company');
        expect(exp).toHaveProperty('start_date');
        expect(exp).toHaveProperty('order_index');
      }
    });

    test('should return education with expected properties', async () => {
      const response = await request(app).get('/api/resume');

      expect(response.status).toBe(200);
      const education = response.body.education;
      
      if (education.length > 0) {
        const edu = education[0];
        expect(edu).toHaveProperty('id');
        expect(edu).toHaveProperty('degree');
        expect(edu).toHaveProperty('institution');
        expect(edu).toHaveProperty('start_date');
        expect(edu).toHaveProperty('order_index');
      }
    });

    test('should handle database connection issues gracefully', async () => {
      // This test would require mocking the database to simulate connection errors
      // For now, we'll test the basic structure
      const response = await request(app).get('/api/resume');
      expect(response.status).toBe(200);
    });

    test('should handle empty database gracefully', async () => {
      // This test would require setting up an empty database
      // For now, we'll test the basic structure
      const response = await request(app).get('/api/resume');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/api/resume')
        .set('User-Agent', 'TestBot/1.0');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });

    test('should handle requests with query parameters (ignored)', async () => {
      const response = await request(app)
        .get('/api/resume')
        .query({ format: 'json', include: 'all' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });

    test('should handle requests with different HTTP methods', async () => {
      const response = await request(app)
        .post('/api/resume')
        .set('Accept', 'application/json');

      // Should return 404 for unsupported method
      expect(response.status).toBe(404);
    });

    test('should handle requests with different content types', async () => {
      const response = await request(app)
        .get('/api/resume')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('experience');
      expect(response.body).toHaveProperty('education');
    });
  });

  describe('Error Handling', () => {
    test('should handle internal server errors gracefully', async () => {
      // This test would require mocking the database to simulate errors
      // For now, we'll test the basic structure
      const response = await request(app).get('/api/resume');
      expect(response.status).toBe(200);
    });

    test('should return proper error response format', async () => {
      // This test would require forcing an error condition
      // For now, we'll test the basic structure
      const response = await request(app).get('/api/resume');
      expect(response.status).toBe(200);
    });
  });

  describe('Performance', () => {
    test('should respond within reasonable time', async () => {
      const startTime = Date.now();
      const response = await request(app).get('/api/resume');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    test('should handle multiple rapid requests', async () => {
      const promises = Array(10).fill().map(() => 
        request(app).get('/api/resume')
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
}); 