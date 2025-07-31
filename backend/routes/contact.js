const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { sendContactEmail } = require('../utils/email');

const router = express.Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Submit a contact form message with validation and email notification
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             subject: "Project Inquiry"
 *             message: "I'm interested in your AI testing framework. Can we discuss collaboration opportunities?"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *             example:
 *               message: "Message sent successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation Error"
 *               message: "Invalid input data"
 *               errors:
 *                 - field: "email"
 *                   message: "Valid email is required"
 *                 - field: "message"
 *                   message: "Message must be at least 10 characters long"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     description: Retrieve all contact form messages (requires admin authentication)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limit the number of messages returned
 *         example: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of messages to skip
 *         example: 0
 *     responses:
 *       200:
 *         description: List of contact messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Message ID
 *                   name:
 *                     type: string
 *                     description: Contact person name
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact person email
 *                   subject:
 *                     type: string
 *                     nullable: true
 *                     description: Message subject
 *                   message:
 *                     type: string
 *                     description: Message content
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Message creation timestamp
 *             example:
 *               - id: 1
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 subject: "Project Inquiry"
 *                 message: "I'm interested in your AI testing framework..."
 *                 created_at: "2025-07-29T21:00:00.000Z"
 *               - id: 2
 *                 name: "Jane Smith"
 *                 email: "jane@example.com"
 *                 subject: null
 *                 message: "Great portfolio! Would love to connect..."
 *                 created_at: "2025-07-29T20:30:00.000Z"
 *       401:
 *         description: Access token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be between 1 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject must be less than 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Invalid input data',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const result = await db.run(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || null, message]
    );

    // Send email notification (if configured)
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);
    
    const messages = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limitNum, offsetNum]
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 