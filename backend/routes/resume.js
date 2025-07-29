const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Get all resume data
router.get('/', async (req, res) => {
  try {
    const skills = await db.query('SELECT * FROM skills ORDER BY order_index ASC');
    const experience = await db.query('SELECT * FROM experience ORDER BY order_index ASC, start_date DESC');
    const education = await db.query('SELECT * FROM education ORDER BY order_index ASC, start_date DESC');

    res.json({
      skills,
      experience,
      education
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Skills routes
router.get('/skills', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM skills ORDER BY order_index ASC');
    res.json(result);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/skills', [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('proficiency').isInt({ min: 1, max: 100 }).withMessage('Proficiency must be between 1 and 100'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, proficiency, icon, order_index = 0 } = req.body;

    const result = await db.run(
      'INSERT INTO skills (name, category, proficiency, icon, order_index) VALUES (?, ?, ?, ?, ?)',
      [name, category, proficiency, icon, order_index]
    );

    const newSkill = await db.get('SELECT * FROM skills WHERE id = ?', [result.lastID]);
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/skills/:id', [
  body('name').optional().notEmpty().withMessage('Skill name cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('proficiency').optional().isInt({ min: 1, max: 100 }).withMessage('Proficiency must be between 1 and 100'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(updateFields), id];

    await db.run(
      `UPDATE skills SET ${setClause} WHERE id = ?`,
      values
    );

    const updatedSkill = await db.get('SELECT * FROM skills WHERE id = ?', [id]);
    if (!updatedSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await db.get('SELECT * FROM skills WHERE id = ?', [id]);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    await db.run('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Experience routes
router.get('/experience', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM experience ORDER BY order_index ASC, start_date DESC');
    res.json(result);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/experience', [
  body('title').notEmpty().withMessage('Job title is required'),
  body('company').notEmpty().withMessage('Company name is required'),
  body('start_date').notEmpty().withMessage('Start date is required'),
  body('end_date').optional().isString().withMessage('End date must be a string'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, start_date, end_date, location, description, technologies, order_index = 0 } = req.body;

    const result = await db.run(
      'INSERT INTO experience (title, company, start_date, end_date, location, description, technologies, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, company, start_date, end_date, location, description, JSON.stringify(technologies || []), order_index]
    );

    const newExperience = await db.get('SELECT * FROM experience WHERE id = ?', [result.lastID]);
    res.status(201).json(newExperience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/experience/:id', [
  body('title').optional().notEmpty().withMessage('Job title cannot be empty'),
  body('company').optional().notEmpty().withMessage('Company name cannot be empty'),
  body('start_date').optional().notEmpty().withMessage('Start date cannot be empty'),
  body('end_date').optional().isString().withMessage('End date must be a string'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;

    // Handle technologies array
    if (updateFields.technologies) {
      updateFields.technologies = JSON.stringify(updateFields.technologies);
    }

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(updateFields), id];

    await db.run(
      `UPDATE experience SET ${setClause} WHERE id = ?`,
      values
    );

    const updatedExperience = await db.get('SELECT * FROM experience WHERE id = ?', [id]);
    if (!updatedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const experience = await db.get('SELECT * FROM experience WHERE id = ?', [id]);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await db.run('DELETE FROM experience WHERE id = ?', [id]);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Education routes
router.get('/education', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM education ORDER BY order_index ASC, start_date DESC');
    res.json(result);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/education', [
  body('degree').notEmpty().withMessage('Degree is required'),
  body('institution').notEmpty().withMessage('Institution name is required'),
  body('start_date').notEmpty().withMessage('Start date is required'),
  body('end_date').optional().isString().withMessage('End date must be a string'),
  body('field_of_study').optional().isString().withMessage('Field of study must be a string'),
  body('gpa').optional().isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { degree, institution, start_date, end_date, field_of_study, gpa, description, order_index = 0 } = req.body;

    const result = await db.run(
      'INSERT INTO education (degree, institution, start_date, end_date, field_of_study, gpa, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [degree, institution, start_date, end_date, field_of_study, gpa, description, order_index]
    );

    const newEducation = await db.get('SELECT * FROM education WHERE id = ?', [result.lastID]);
    res.status(201).json(newEducation);
  } catch (error) {
    console.error('Error creating education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/education/:id', [
  body('degree').optional().notEmpty().withMessage('Degree cannot be empty'),
  body('institution').optional().notEmpty().withMessage('Institution name cannot be empty'),
  body('start_date').optional().notEmpty().withMessage('Start date cannot be empty'),
  body('end_date').optional().isString().withMessage('End date must be a string'),
  body('field_of_study').optional().isString().withMessage('Field of study must be a string'),
  body('gpa').optional().isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('order_index').optional().isInt().withMessage('Order index must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(updateFields), id];

    await db.run(
      `UPDATE education SET ${setClause} WHERE id = ?`,
      values
    );

    const updatedEducation = await db.get('SELECT * FROM education WHERE id = ?', [id]);
    if (!updatedEducation) {
      return res.status(404).json({ error: 'Education not found' });
    }

    res.json(updatedEducation);
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const education = await db.get('SELECT * FROM education WHERE id = ?', [id]);
    if (!education) {
      return res.status(404).json({ error: 'Education not found' });
    }

    await db.run('DELETE FROM education WHERE id = ?', [id]);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 