require('dotenv').config();

console.log('=== Testing .env file loading ===');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Environment variables loaded successfully!');
  console.log('✅ Email configuration is ready!');
} else {
  console.log('❌ Environment variables not loaded!');
  console.log('❌ Check if .env file exists and has correct format');
} 