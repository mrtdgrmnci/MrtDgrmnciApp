const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send contact form email notification
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact person name
 * @param {string} contactData.email - Contact person email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 */
const sendContactEmail = async (contactData) => {
  const { name, email, subject, message } = contactData;
  
  // Check if email configuration is set up
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email configuration not set up. Messages will only be saved to database.');
    return;
  }

  try {
    console.log('Attempting to send email notification...');
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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
    console.log('✅ Contact form email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send contact form email:', error.message);
    console.error('Email error details:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmail
}; 