const express = require('express');
const db = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve comprehensive statistics for the admin dashboard including projects, resume data, blog posts, and contact messages
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDashboard'
 *             example:
 *               projects:
 *                 total: 10
 *                 featured: 8
 *               resume:
 *                 skills: 30
 *                 experience: 6
 *                 education: 6
 *               blog:
 *                 total: 2
 *                 published: 2
 *                 drafts: 0
 *               contact:
 *                 total: 4
 *                 unread: 4
 *                 recent: 4
 *       401:
 *         description: Access token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Access token required"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Admin access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get projects statistics
    const projectsStats = await db.get('SELECT COUNT(*) as total, SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured FROM projects');
    
    // Get resume statistics
    const skillsCount = await db.get('SELECT COUNT(*) as count FROM skills');
    const experienceCount = await db.get('SELECT COUNT(*) as count FROM experience');
    const educationCount = await db.get('SELECT COUNT(*) as count FROM education');
    
    // Get blog statistics
    const blogStats = await db.get('SELECT COUNT(*) as total, SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published FROM blog_posts');
    const draftsCount = blogStats.total - blogStats.published;
    
    // Get contact statistics
    const contactStats = await db.get('SELECT COUNT(*) as total FROM contact_messages');
    const recentMessages = await db.get('SELECT COUNT(*) as count FROM contact_messages WHERE created_at >= datetime("now", "-7 days")');
    
    const dashboard = {
      projects: {
        total: projectsStats.total,
        featured: projectsStats.featured
      },
      resume: {
        skills: skillsCount.count,
        experience: experienceCount.count,
        education: educationCount.count
      },
      blog: {
        total: blogStats.total,
        published: blogStats.published,
        drafts: draftsCount
      },
      contact: {
        total: contactStats.total,
        unread: contactStats.total, // Simplified - all messages are considered unread
        recent: recentMessages.count
      }
    };
    
    res.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 