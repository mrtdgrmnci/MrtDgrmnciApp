require('dotenv').config();
const { run } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Users table for authentication
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        github_url TEXT,
        live_url TEXT,
        technologies TEXT,
        featured BOOLEAN DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Skills table
    await run(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        proficiency INTEGER DEFAULT 0,
        category TEXT DEFAULT 'other',
        icon TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Experience table
    await run(`
      CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        current BOOLEAN DEFAULT 0,
        description TEXT,
        technologies TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Education table
    await run(`
      CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        location TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        current BOOLEAN DEFAULT 0,
        description TEXT,
        gpa TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Blog posts table
    await run(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        tags TEXT,
        published BOOLEAN DEFAULT 0,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact messages table
    await run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
};

createTables(); 