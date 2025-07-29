const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get dashboard overview statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      projectsCount,
      featuredProjectsCount,
      totalSkills,
      totalExperience,
      totalEducation,
      totalBlogPosts,
      publishedBlogPosts,
      totalContactMessages,
      unreadContactMessages,
      recentContactMessages
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM projects'),
      db.query('SELECT COUNT(*) as count FROM projects WHERE featured = true'),
      db.query('SELECT COUNT(*) as count FROM skills'),
      db.query('SELECT COUNT(*) as count FROM experience'),
      db.query('SELECT COUNT(*) as count FROM education'),
      db.query('SELECT COUNT(*) as count FROM blog_posts'),
      db.query('SELECT COUNT(*) as count FROM blog_posts WHERE published = true'),
      db.query('SELECT COUNT(*) as count FROM contact_messages'),
      db.query('SELECT COUNT(*) as count FROM contact_messages WHERE read = false'),
      db.query('SELECT COUNT(*) as count FROM contact_messages WHERE created_at >= NOW() - INTERVAL \'7 days\'')
    ]);

    res.json({
      projects: {
        total: parseInt(projectsCount.rows[0].count),
        featured: parseInt(featuredProjectsCount.rows[0].count)
      },
      resume: {
        skills: parseInt(totalSkills.rows[0].count),
        experience: parseInt(totalExperience.rows[0].count),
        education: parseInt(totalEducation.rows[0].count)
      },
      blog: {
        total: parseInt(totalBlogPosts.rows[0].count),
        published: parseInt(publishedBlogPosts.rows[0].count),
        drafts: parseInt(totalBlogPosts.rows[0].count) - parseInt(publishedBlogPosts.rows[0].count)
      },
      contact: {
        total: parseInt(totalContactMessages.rows[0].count),
        unread: parseInt(unreadContactMessages.rows[0].count),
        recent: parseInt(recentContactMessages.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get recent projects
    const recentProjects = await db.query(
      'SELECT id, title, created_at, updated_at FROM projects ORDER BY updated_at DESC LIMIT $1',
      [limit]
    );

    // Get recent blog posts
    const recentBlogPosts = await db.query(
      'SELECT id, title, created_at, updated_at, published FROM blog_posts ORDER BY updated_at DESC LIMIT $1',
      [limit]
    );

    // Get recent contact messages
    const recentContactMessages = await db.query(
      'SELECT id, name, email, subject, created_at, read FROM contact_messages ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    // Combine and sort all activities
    const activities = [
      ...recentProjects.rows.map(project => ({
        ...project,
        type: 'project',
        action: 'updated'
      })),
      ...recentBlogPosts.rows.map(post => ({
        ...post,
        type: 'blog',
        action: post.published ? 'published' : 'updated'
      })),
      ...recentContactMessages.rows.map(message => ({
        ...message,
        type: 'contact',
        action: 'received'
      }))
    ].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, parseInt(limit));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    const dbTest = await db.query('SELECT NOW() as timestamp');
    
    // Check environment
    const environment = {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      database: 'connected',
      timestamp: dbTest.rows[0].timestamp
    };

    res.json({
      status: 'healthy',
      environment,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Get backup data (for admin export)
router.get('/backup', async (req, res) => {
  try {
    const [
      projects,
      skills,
      experience,
      education,
      blogPosts,
      contactMessages
    ] = await Promise.all([
      db.query('SELECT * FROM projects ORDER BY created_at'),
      db.query('SELECT * FROM skills ORDER BY order_index'),
      db.query('SELECT * FROM experience ORDER BY start_date DESC'),
      db.query('SELECT * FROM education ORDER BY start_date DESC'),
      db.query('SELECT * FROM blog_posts ORDER BY created_at'),
      db.query('SELECT * FROM contact_messages ORDER BY created_at')
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        projects: projects.rows,
        skills: skills.rows,
        experience: experience.rows,
        education: education.rows,
        blogPosts: blogPosts.rows,
        contactMessages: contactMessages.rows
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`);
    res.json(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all data (dangerous - admin only)
router.delete('/clear-all', async (req, res) => {
  try {
    // This is a dangerous operation - should require additional confirmation
    const { confirm } = req.query;
    
    if (confirm !== 'true') {
      return res.status(400).json({ 
        error: 'This operation requires explicit confirmation. Add ?confirm=true to proceed.' 
      });
    }

    await Promise.all([
      db.query('DELETE FROM contact_messages'),
      db.query('DELETE FROM blog_posts'),
      db.query('DELETE FROM projects'),
      db.query('DELETE FROM skills'),
      db.query('DELETE FROM experience'),
      db.query('DELETE FROM education')
    ]);

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 