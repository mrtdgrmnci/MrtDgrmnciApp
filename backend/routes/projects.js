const express = require('express');
const db = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve all portfolio projects ordered by order_index and creation date
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *         example: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limit the number of projects returned
 *         example: 10
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *             example:
 *               - id: 1
 *                 title: "AI-Powered Test Automation Framework"
 *                 description: "Advanced test automation framework integrating AI capabilities..."
 *                 technologies: ["Selenium", "Java", "AI/ML", "TestNG"]
 *                 image_url: "https://via.placeholder.com/600x400/2563eb/ffffff?text=AI+Testing+Framework"
 *                 github_url: "https://github.com/mrtdgrmnci/ai-testing-framework"
 *                 live_url: null
 *                 featured: true
 *                 order_index: 1
 *                 created_at: "2025-07-29T21:00:00.000Z"
 *               - id: 2
 *                 title: "Playwright E2E Testing Suite"
 *                 description: "Modern end-to-end testing framework using Playwright..."
 *                 technologies: ["Playwright", "TypeScript", "API Testing"]
 *                 image_url: "https://via.placeholder.com/600x400/059669/ffffff?text=Playwright+Testing"
 *                 github_url: "https://github.com/mrtdgrmnci/playwright-suite"
 *                 live_url: null
 *                 featured: true
 *                 order_index: 2
 *                 created_at: "2025-07-29T21:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 */
router.get('/', async (req, res) => {
  try {
    const { featured, limit } = req.query;
    
    let query = 'SELECT * FROM projects';
    const params = [];
    
    // Add featured filter if specified
    if (featured !== undefined) {
      query += ' WHERE featured = ?';
      params.push(featured === 'true');
    }
    
    // Add ordering
    query += ' ORDER BY order_index ASC, created_at DESC';
    
    // Add limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (limitNum > 0 && limitNum <= 100) {
        query += ' LIMIT ?';
        params.push(limitNum);
      }
    }
    
    const projects = await db.query(query, params);
    
    // Parse technologies JSON for each project
    const projectsWithParsedTech = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies || '[]')
    }));
    
    res.json(projectsWithParsedTech);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve a specific project by its ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *             example:
 *               id: 1
 *               title: "AI-Powered Test Automation Framework"
 *               description: "Advanced test automation framework integrating AI capabilities..."
 *               technologies: ["Selenium", "Java", "AI/ML", "TestNG"]
 *               image_url: "https://via.placeholder.com/600x400/2563eb/ffffff?text=AI+Testing+Framework"
 *               github_url: "https://github.com/mrtdgrmnci/ai-testing-framework"
 *               live_url: null
 *               featured: true
 *               order_index: 1
 *               created_at: "2025-07-29T21:00:00.000Z"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Project not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Parse technologies JSON
    const projectWithParsedTech = {
      ...project,
      technologies: JSON.parse(project.technologies || '[]')
    };
    
    res.json(projectWithParsedTech);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 