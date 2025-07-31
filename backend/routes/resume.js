const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all resume data
router.get('/', async (req, res) => {
  try {
    const skills = await db.query('SELECT * FROM skills ORDER BY order_index ASC');
    const experience = await db.query('SELECT * FROM experience ORDER BY order_index ASC, start_date DESC');
    const education = await db.query('SELECT * FROM education ORDER BY order_index ASC, start_date DESC');
    res.json({ skills, experience, education });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 