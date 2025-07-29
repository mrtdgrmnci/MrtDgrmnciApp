# MRT Portfolio Website

A modern, responsive personal portfolio website built with React, Node.js, Express, and PostgreSQL. Features a clean design, admin panel, blog functionality, and contact form.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds
- **Animations**: Smooth animations using Framer Motion
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for all content
- **Authentication**: JWT-based admin authentication
- **Security**: Rate limiting, input validation, CORS, and Helmet
- **Database**: PostgreSQL with connection pooling
- **File Upload**: Image upload and processing
- **Email Integration**: Contact form email notifications

### Content Management
- **Admin Panel**: Easy-to-use interface for managing content
- **Blog System**: Markdown support with tags and categories
- **Project Management**: Add, edit, and organize projects
- **Resume Builder**: Manage skills, experience, and education
- **Contact Management**: View and respond to contact messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Multer** - File uploads
- **Sharp** - Image processing

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MrtDgrmnciApp
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE portfolio_db;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
   ```

2. **Configure Environment Variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=portfolio_db
   DB_USER=portfolio_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Run Database Migrations**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin
- **Default Admin Credentials**: 
  - Username: `admin`
  - Password: `admin123`

## 📁 Project Structure

```
MrtDgrmnciApp/
├── backend/                 # Backend API
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   ├── uploads/            # File uploads
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration

Update social links and personal information in:
- `frontend/src/components/Footer.jsx`
- `frontend/index.html` (meta tags)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests only
cd frontend && npm test

# Run backend tests only
cd backend && npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm start
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify**
   - Connect your repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

### Backend Deployment (Heroku/Render)

1. **Prepare for deployment**
   ```bash
   cd backend
   npm install --production
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

4. **Deploy to Render**
   - Connect your repository
   - Build command: `npm install`
   - Start command: `npm start`

### Database Deployment

- **Production Database**: Use managed PostgreSQL services like:
  - Heroku Postgres
  - AWS RDS
  - DigitalOcean Managed Databases
  - Supabase

## 🔒 Security Features

- **JWT Authentication** for admin access
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers
- **bcrypt** for password hashing
- **SQL Injection Protection** with parameterized queries

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Customization

### Colors and Themes
Edit `frontend/tailwind.config.js` to customize:
- Color palette
- Typography
- Animations
- Spacing

### Content
- Update personal information in components
- Modify sample data in `backend/scripts/seed.js`
- Customize email templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Express](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database

---

**Built with ❤️ by MRT** 