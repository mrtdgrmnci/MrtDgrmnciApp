require('dotenv').config();
const bcrypt = require('bcryptjs');
const { run } = require('../config/database');

const seedData = async () => {
  try {
    console.log('🔄 Seeding database with sample data...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await run(`
      INSERT OR IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, ['admin', 'admin@example.com', hashedPassword, 'admin']);

    // Insert sample projects
    const projects = [
      {
        title: 'Selenium Test Automation Framework',
        description: 'A comprehensive test automation framework built with Selenium WebDriver, TestNG, and Java. Features include parallel execution, reporting, and cross-browser testing.',
        technologies: JSON.stringify(['Selenium', 'Java', 'TestNG', 'Maven', 'Jenkins']),
        image_url: 'https://via.placeholder.com/600x400/2563eb/ffffff?text=Selenium+Framework',
        github_url: 'https://github.com/example/selenium-framework',
        live_url: 'https://selenium-framework-demo.com',
        featured: 1,
        order_index: 1
      },
      {
        title: 'Cypress E2E Testing Suite',
        description: 'End-to-end testing suite for web applications using Cypress. Includes custom commands, fixtures, and comprehensive test coverage for critical user flows.',
        technologies: JSON.stringify(['Cypress', 'JavaScript', 'Cucumber', 'GitHub Actions', 'Allure']),
        image_url: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Cypress+Suite',
        github_url: 'https://github.com/example/cypress-suite',
        live_url: 'https://cypress-suite-demo.com',
        featured: 1,
        order_index: 2
      },
      {
        title: 'Playwright API Testing Platform',
        description: 'Modern API testing platform built with Playwright and TypeScript. Features include contract testing, performance monitoring, and automated reporting.',
        technologies: JSON.stringify(['Playwright', 'TypeScript', 'REST API', 'Docker', 'Grafana']),
        image_url: 'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Playwright+API',
        github_url: 'https://github.com/example/playwright-api',
        live_url: 'https://playwright-api-demo.com',
        featured: 0,
        order_index: 3
      }
    ];

    for (const project of projects) {
      await run(`
        INSERT OR IGNORE INTO projects (title, description, technologies, image_url, github_url, live_url, featured, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [project.title, project.description, project.technologies, project.image_url, project.github_url, project.live_url, project.featured, project.order_index]);
    }

    // Insert sample skills
    const skills = [
      { name: 'Selenium', proficiency: 90, category: 'automation', icon: 'fas fa-robot', order_index: 1 },
      { name: 'Cypress', proficiency: 85, category: 'automation', icon: 'fas fa-cypress', order_index: 2 },
      { name: 'Playwright', proficiency: 80, category: 'automation', icon: 'fas fa-playwright', order_index: 3 },
      { name: 'Python', proficiency: 75, category: 'programming', icon: 'fab fa-python', order_index: 4 },
      { name: 'JavaScript', proficiency: 70, category: 'programming', icon: 'fab fa-js-square', order_index: 5 },
      { name: 'Jenkins', proficiency: 65, category: 'ci-cd', icon: 'fab fa-jenkins', order_index: 6 },
      { name: 'Docker', proficiency: 60, category: 'devops', icon: 'fab fa-docker', order_index: 7 },
      { name: 'Git', proficiency: 85, category: 'tools', icon: 'fab fa-git-alt', order_index: 8 }
    ];

    for (const skill of skills) {
      await run(`
        INSERT OR IGNORE INTO skills (name, proficiency, category, icon, order_index)
        VALUES (?, ?, ?, ?, ?)
      `, [skill.name, skill.proficiency, skill.category, skill.icon, skill.order_index]);
    }

    // Insert sample experience
    const experience = [
      {
        title: 'Senior Test Automation Advisor',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        start_date: '2022-01',
        end_date: null,
        current: 1,
        description: 'Lead test automation initiatives and framework development using Selenium, Cypress, and Playwright. Mentored QA teams and implemented best practices.',
        technologies: JSON.stringify(['Selenium', 'Cypress', 'Playwright', 'Python', 'JavaScript']),
        order_index: 1
      },
      {
        title: 'QA Automation Engineer',
        company: 'Digital Agency XYZ',
        location: 'New York, NY',
        start_date: '2020-03',
        end_date: '2021-12',
        current: 0,
        description: 'Developed automated test suites and quality assurance processes. Collaborated with development teams to ensure product quality.',
        technologies: JSON.stringify(['Selenium', 'JUnit', 'TestNG', 'Java', 'Jenkins']),
        order_index: 2
      }
    ];

    for (const exp of experience) {
      await run(`
        INSERT OR IGNORE INTO experience (title, company, location, start_date, end_date, current, description, technologies, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [exp.title, exp.company, exp.location, exp.start_date, exp.end_date, exp.current, exp.description, exp.technologies, exp.order_index]);
    }

    // Insert sample education
    const education = [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        location: 'Boston, MA',
        start_date: '2016-09',
        end_date: '2020-05',
        current: 0,
        description: 'Focused on software engineering, algorithms, and web development. Graduated with honors.',
        gpa: '3.8/4.0',
        order_index: 1
      }
    ];

    for (const edu of education) {
      await run(`
        INSERT OR IGNORE INTO education (degree, institution, location, start_date, end_date, current, description, gpa, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [edu.degree, edu.institution, edu.location, edu.start_date, edu.end_date, edu.current, edu.description, edu.gpa, edu.order_index]);
    }

    // Insert sample blog posts
    const blogPosts = [
      {
        title: 'Getting Started with React Hooks',
        slug: 'getting-started-with-react-hooks',
        excerpt: 'Learn how to use React Hooks to write cleaner, more functional components.',
        content: `# Getting Started with React Hooks

React Hooks were introduced in React 16.8 and have revolutionized how we write React components. They allow you to use state and other React features without writing a class.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.

## Basic Hooks

### useState

The useState Hook lets you add state to function components:

\`\`\`jsx
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect

The useEffect Hook lets you perform side effects in function components:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Conclusion

Hooks make React components more readable and easier to test. They eliminate the need for complex class components and provide a more intuitive way to manage state and side effects.`,
        tags: JSON.stringify(['React', 'JavaScript', 'Web Development']),
        published: 1,
        published_at: new Date().toISOString()
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        slug: 'building-restful-apis-nodejs-express',
        excerpt: 'A comprehensive guide to building scalable RESTful APIs using Node.js and Express framework.',
        content: `# Building RESTful APIs with Node.js and Express

Node.js and Express.js provide a powerful combination for building RESTful APIs. In this guide, we'll explore best practices and patterns for creating scalable APIs.

## Setting Up the Project

First, initialize your Node.js project:

\`\`\`bash
npm init -y
npm install express cors helmet morgan
\`\`\`

## Basic Express Server

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## RESTful Routes

Follow REST conventions for your API endpoints:

- GET /api/users - Get all users
- GET /api/users/:id - Get specific user
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Error Handling

Implement proper error handling:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\`

## Conclusion

Building RESTful APIs with Node.js and Express is straightforward and powerful. Follow these patterns for maintainable and scalable APIs.`,
        tags: JSON.stringify(['Node.js', 'Express', 'API', 'Backend']),
        published: 1,
        published_at: new Date().toISOString()
      }
    ];

    for (const post of blogPosts) {
      await run(`
        INSERT OR IGNORE INTO blog_posts (title, slug, excerpt, content, tags, published, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [post.title, post.slug, post.excerpt, post.content, post.tags, post.published, post.published_at]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Default admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n🌐 You can now start the development server with: npm run dev');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 