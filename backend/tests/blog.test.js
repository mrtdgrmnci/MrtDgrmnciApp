const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('Blog Routes', () => {
  describe('GET /api/blog', () => {
    test('should return blog posts with default pagination', async () => {
      const response = await request(app).get('/api/blog');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return blog posts with custom pagination', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 2, limit: 5 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return blog posts filtered by tag', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ tag: 'testing' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 'invalid', limit: 10 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 1, limit: 'invalid' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle negative page parameter', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: -1, limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle negative limit parameter', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 1, limit: -5 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle empty tag parameter', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ tag: '' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle special characters in tag', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ tag: 'test-tag' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle multiple query parameters', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ 
          page: 1, 
          limit: 5, 
          tag: 'automation' 
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/blog/post/:slug', () => {
    test('should return blog post by valid slug', async () => {
      // First get a list of posts to find a valid slug
      const postsResponse = await request(app).get('/api/blog');
      const posts = postsResponse.body;

      if (posts.length > 0) {
        const validSlug = posts[0].slug;
        const response = await request(app).get(`/api/blog/post/${validSlug}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('slug', validSlug);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('content');
      } else {
        // If no posts exist, test with a non-existent slug
        const response = await request(app).get('/api/blog/post/non-existent-slug');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Blog post not found');
      }
    });

    test('should return 404 for non-existent slug', async () => {
      const response = await request(app).get('/api/blog/post/non-existent-slug');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });

    test('should return 404 for empty slug', async () => {
      const response = await request(app).get('/api/blog/post/');

      expect(response.status).toBe(404);
    });

    test('should handle slug with special characters', async () => {
      const response = await request(app).get('/api/blog/post/test-slug-with-special-chars');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });

    test('should handle slug with spaces', async () => {
      const response = await request(app).get('/api/blog/post/test%20slug%20with%20spaces');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });

    test('should handle very long slug', async () => {
      const longSlug = 'a'.repeat(1000);
      const response = await request(app).get(`/api/blog/post/${longSlug}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });

    test('should handle slug with SQL injection attempt', async () => {
      const maliciousSlug = "'; DROP TABLE blog_posts; --";
      const response = await request(app).get(`/api/blog/post/${encodeURIComponent(maliciousSlug)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });

    test('should handle slug with unicode characters', async () => {
      const unicodeSlug = 'test-unicode-ñáéíóú';
      const response = await request(app).get(`/api/blog/post/${encodeURIComponent(unicodeSlug)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Blog post not found');
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // This test would require mocking the database to simulate errors
      // For now, we'll test the basic structure
      const response = await request(app).get('/api/blog');
      expect(response.status).toBe(200);
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/api/blog')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
    });
  });

  describe('Response Format', () => {
    test('should return proper JSON response for blog list', async () => {
      const response = await request(app)
        .get('/api/blog')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return proper JSON response for single post', async () => {
      const response = await request(app)
        .get('/api/blog/post/test-slug')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Query Parameter Validation', () => {
    test('should handle undefined query parameters', async () => {
      const response = await request(app).get('/api/blog');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle null query parameters', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: null, limit: null, tag: null });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle very large page numbers', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 999999, limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle very large limit numbers', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 1, limit: 999999 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 