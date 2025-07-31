const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Contact Endpoints', () => {
  let testMessage;

  afterAll(async () => {
    // Clean up test messages
    if (testMessage) {
      await db.run('DELETE FROM contact_messages WHERE id = ?', [testMessage.id]);
    }
    await db.db.close();
  });

  describe('POST /api/contact', () => {
    it('should submit contact form with valid data', async () => {
      const messageData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Message sent successfully');

      // Verify message was saved to database
      const savedMessage = await db.get(
        'SELECT * FROM contact_messages WHERE email = ? ORDER BY created_at DESC LIMIT 1',
        [messageData.email]
      );
      expect(savedMessage).toBeDefined();
      expect(savedMessage.name).toBe(messageData.name);
      expect(savedMessage.message).toBe(messageData.message);
      
      testMessage = savedMessage;
    });

    it('should submit contact form without subject', async () => {
      const messageData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'This is a test message without subject.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Message sent successfully');
    });

    it('should reject form without name', async () => {
      const messageData = {
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject form without email', async () => {
      const messageData = {
        name: 'Test User',
        subject: 'Test Subject',
        message: 'This is a test message.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const messageData = {
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject form without message', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject message that is too short', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Short'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject message that is too long', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'A'.repeat(2001) // Exceeds 2000 character limit
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject subject that is too long', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'A'.repeat(201), // Exceeds 200 character limit
        message: 'This is a test message.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(messageData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/contact', () => {
    it('should return all contact messages', async () => {
      const response = await request(app)
        .get('/api/contact');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return messages ordered by created_at DESC', async () => {
      const response = await request(app)
        .get('/api/contact');

      expect(response.status).toBe(200);
      
      const messages = response.body;
      for (let i = 1; i < messages.length; i++) {
        const prevDate = new Date(messages[i - 1].created_at);
        const currentDate = new Date(messages[i].created_at);
        expect(currentDate.getTime()).toBeLessThanOrEqual(prevDate.getTime());
      }
    });
  });
}); 