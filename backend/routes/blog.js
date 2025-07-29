const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Get all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM blog_posts WHERE published = true';
    let countQuery = 'SELECT COUNT(*) as count FROM blog_posts WHERE published = true';
    let params = [];
    let paramCount = 0;

    if (tag) {
      paramCount++;
      query += ` AND tags LIKE ?`;
      countQuery += ` AND tags LIKE ?`;
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [posts, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, tag ? [`%${tag}%`] : [])
    ]);

    const totalPosts = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all blog posts (admin only)
router.get('/admin', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
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

// Get single blog post by ID (admin only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id]
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

// Create new blog post (admin only)
router.post('/', [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('slug').notEmpty().trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('featured_image').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      tags = [],
      published = false
    } = req.body;

    // Check if slug already exists
    const existingPost = await db.query(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (existingPost.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const published_at = published ? new Date() : null;

    const result = await db.run(
      `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, tags, published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt, featured_image, JSON.stringify(tags), published, published_at]
    );

    // Get the inserted post
    const insertedPost = await db.get(
      'SELECT * FROM blog_posts WHERE id = ?',
      [result.id]
    );

    res.status(201).json(insertedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog post (admin only)
router.put('/:id', [
  body('title').optional().notEmpty().trim().withMessage('Title cannot be empty'),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('featured_image').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;

    // Check if slug already exists (if slug is being updated)
    if (updateFields.slug) {
      const existingPost = await db.query(
        'SELECT id FROM blog_posts WHERE slug = ? AND id != ?',
        [updateFields.slug, id]
      );

      if (existingPost.length > 0) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Handle published_at field
    if (updateFields.published && !updateFields.published_at) {
      updateFields.published_at = new Date();
    } else if (!updateFields.published) {
      updateFields.published_at = null;
    }

    updateFields.updated_at = new Date();

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(updateFields), id];

    await db.run(
      `UPDATE blog_posts SET ${setClause} WHERE id = ?`,
      values
    );

    // Get the updated post
    const updatedPost = await db.get(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id]
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if post exists
    const existingPost = await db.get(
      'SELECT id FROM blog_posts WHERE id = ?',
      [id]
    );

    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await db.run(
      'DELETE FROM blog_posts WHERE id = ?',
      [id]
    );

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blog tags (public)
router.get('/tags/all', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT tags FROM blog_posts WHERE published = true'
    );
    
    // Extract tags from JSON strings and flatten
    const allTags = [];
    result.forEach(row => {
      if (row.tags) {
        try {
          const tags = JSON.parse(row.tags);
          if (Array.isArray(tags)) {
            allTags.push(...tags);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    });
    
    // Remove duplicates and sort
    const uniqueTags = [...new Set(allTags)].sort();
    res.json(uniqueTags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blog statistics (admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM blog_posts'),
      db.query('SELECT COUNT(*) as count FROM blog_posts WHERE published = true'),
      db.query('SELECT COUNT(*) as count FROM blog_posts WHERE published = false'),
      db.query('SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= datetime(\'now\', \'-30 days\')')
    ]);

    res.json({
      total: parseInt(totalPosts[0].count),
      published: parseInt(publishedPosts[0].count),
      drafts: parseInt(draftPosts[0].count),
      recent: parseInt(recentPosts[0].count)
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 