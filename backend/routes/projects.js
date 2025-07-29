const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC'
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured projects (public)
router.get('/featured', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE featured = 1 ORDER BY order_index ASC, created_at DESC'
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project (admin only)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
  body('image_url').optional().isURL().withMessage('Image URL must be valid'),
  body('github_url').optional().isURL().withMessage('GitHub URL must be valid'),
  body('live_url').optional().isURL().withMessage('Live URL must be valid'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      technologies,
      image_url,
      github_url,
      live_url,
      featured = false,
      order_index = 0
    } = req.body;

    const result = await db.run(
      `INSERT INTO projects (title, description, technologies, image_url, github_url, live_url, featured, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, JSON.stringify(technologies), image_url, github_url, live_url, featured ? 1 : 0, order_index]
    );

    // Get the inserted project
    const insertedProject = await db.get(
      'SELECT * FROM projects WHERE id = ?',
      [result.id]
    );

    res.status(201).json(insertedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (admin only)
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('image_url').optional().isURL().withMessage('Image URL must be valid'),
  body('github_url').optional().isURL().withMessage('GitHub URL must be valid'),
  body('live_url').optional().isURL().withMessage('Live URL must be valid'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;
    updateFields.updated_at = new Date();

    // Build dynamic update query
    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(updateFields), id];

    await db.run(
      `UPDATE projects SET ${setClause} WHERE id = ?`,
      values
    );

    // Get the updated project
    const updatedProject = await db.get(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder projects (admin only)
router.post('/reorder', [
  body('projectOrders').isArray().withMessage('Project orders must be an array'),
  body('projectOrders.*.id').isInt().withMessage('Project ID must be a number'),
  body('projectOrders.*.order_index').isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectOrders } = req.body;

    // Update each project's order index
    for (const project of projectOrders) {
      await db.run(
        'UPDATE projects SET order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [project.order_index, project.id]
      );
    }

    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 