const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM blog_posts WHERE published = true';
    let params = [];

    if (tag) {
      query += ` AND tags LIKE ?`;
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const posts = await db.query(query, params);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog post by slug (public)
router.get('/post/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE slug = ? AND published = true',
      [slug]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 