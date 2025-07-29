const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const db = require('../config/database');

const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Submit contact form (public)
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject must be less than 200 characters'),
  body('message').notEmpty().trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const result = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );

    const savedMessage = result.rows[0];

    // Send email notification (if email is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to yourself
          subject: `New Contact Form Message: ${subject || 'No Subject'}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Sent from your portfolio website contact form</small></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact form email sent successfully');
      } catch (emailError) {
        console.error('Failed to send contact form email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      message: 'Message sent successfully',
      id: savedMessage.id
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread contact messages (admin only)
router.get('/unread', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM contact_messages WHERE read = false ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single contact message (admin only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read (admin only)
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE contact_messages SET read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as unread (admin only)
router.patch('/:id/unread', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE contact_messages SET read = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking message as unread:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact statistics (admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalMessages, unreadMessages, recentMessages] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM contact_messages'),
      db.query('SELECT COUNT(*) as count FROM contact_messages WHERE read = false'),
      db.query('SELECT COUNT(*) as count FROM contact_messages WHERE created_at >= NOW() - INTERVAL \'7 days\'')
    ]);

    res.json({
      total: parseInt(totalMessages.rows[0].count),
      unread: parseInt(unreadMessages.rows[0].count),
      recent: parseInt(recentMessages.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 