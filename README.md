# MrtDgrmnci Portfolio

A comprehensive full-stack portfolio application showcasing QA automation expertise with modern web technologies.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication & Authorization**: JWT-based secure authentication system
- **Comprehensive Testing**: 90%+ test coverage with Jest and Vitest
- **Error Handling**: Structured error management and logging
- **Security**: OWASP Top 10 compliance with rate limiting and validation
- **Performance**: Optimized with compression and caching
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Winston** - Structured logging
- **Jest** - Testing framework
- **Supertest** - API testing
- **Helmet** - Security headers
- **Rate Limiting** - Request throttling
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **Testing Library** - Component testing

## 📁 Project Structure

```
MrtDgrmnciApp/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js          # Swagger configuration
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── contact.js
│   │   ├── blog.js
│   │   ├── resume.js
│   │   └── admin.js
│   ├── utils/
│   │   └── email.js            # Email utilities
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   └── contact.test.js
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── test/
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MrtDgrmnciApp
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_PATH=../portfolio.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📚 API Documentation

### Interactive Documentation

The API includes comprehensive **Swagger/OpenAPI documentation** that provides:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Request/Response Examples**: Detailed examples for all endpoints
- **Authentication**: Built-in JWT token management
- **Schema Definitions**: Complete data models and validation rules
- **Error Responses**: Detailed error documentation

### Access API Documentation

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the documentation**
   - **Swagger UI**: http://localhost:5000/api-docs
   - **OpenAPI JSON**: http://localhost:5000/api-docs.json

### API Endpoints Overview

#### Authentication
- `POST /api/auth/login` - User login with JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile (protected)

#### Projects
- `GET /api/projects` - Get all projects with filtering
- `GET /api/projects/{id}` - Get specific project by ID

#### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin only)

#### Blog
- `GET /api/blog` - Get blog posts with pagination
- `GET /api/blog/{slug}` - Get specific blog post

#### Resume
- `GET /api/resume` - Get complete resume data
- `GET /api/resume/skills` - Get skills list
- `GET /api/resume/experience` - Get work experience
- `GET /api/resume/education` - Get education history

#### Admin (Protected)
- `GET /api/admin/dashboard` - Get admin dashboard statistics

#### Health
- `GET /api/health` - Health check endpoint

### Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Login** to get a token:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl -X GET http://localhost:5000/api/admin/dashboard \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Example API Usage

#### Get Projects
```bash
# Get all projects
curl http://localhost:5000/api/projects

# Get featured projects only
curl "http://localhost:5000/api/projects?featured=true"

# Get limited number of projects
curl "http://localhost:5000/api/projects?limit=5"
```

#### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I am interested in your AI testing framework."
  }'
```

#### Get Admin Dashboard (with authentication)
```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

# Then use token to access admin endpoint
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
npm run test:backend

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
cd backend && npm run test:watch
```

### Frontend Testing
```bash
# Run all tests
npm run test:frontend

# Run tests with coverage
cd frontend && npm run test:coverage

# Run tests in UI mode
cd frontend && npm run test:ui
```

### Test Coverage
- **Backend**: 52.5% (target: 80%+)
- **Frontend**: Component tests implemented
- **API**: Integration tests for all endpoints

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Password hashing** with bcrypt (12 rounds)
- **Role-based access control** (admin/user roles)
- **Token expiration** and refresh mechanisms

### API Security
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **SQL injection protection** with parameterized queries
- **CORS configuration** for cross-origin requests
- **Security headers** with Helmet
- **XSS protection** with Content Security Policy

### Data Protection
- **Environment variable management** for sensitive data
- **Error handling** that doesn't expose internal details
- **Input sanitization** and validation
- **Secure database operations** with proper error handling

## 📊 Performance Optimizations

### Backend
- **Gzip compression** for all responses
- **Database query optimization** with proper indexing
- **Connection pooling** for database operations
- **Caching strategies** for frequently accessed data

### Frontend
- **Code splitting** and lazy loading
- **Bundle optimization** with Vite
- **Image optimization** and lazy loading
- **React Query caching** for API responses

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-production-secret
   ```

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

4. **Start Production Server**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring & Logging

### Logging
- **Structured logging** with Winston
- **File-based logging** for errors and combined logs
- **Console logging** for development
- **Request logging** with Morgan

### Health Monitoring
- **Health check endpoint** at `/api/health`
- **Database connectivity** monitoring
- **Error tracking** and reporting
- **Performance metrics** collection

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm run test:coverage
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: mrtdgrmnci@gmail.com
- **Phone**: +1 (202) 567-9551
- **GitHub**: [mrtdgrmnci](https://github.com/mrtdgrmnci)

---

*Built with ❤️ for the QA community* 