# MRT Test Automation Advisor Portfolio

A modern, full-stack personal portfolio website showcasing expertise in test automation and quality assurance.

## 🚀 Features

- **Modern UI/UX**: Futuristic design with neon accents and smooth animations
- **Responsive Design**: Optimized for all devices and screen sizes
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **Database Integration**: SQLite database with sample data
- **Real-time Updates**: Hot module replacement for development
- **SEO Optimized**: Meta tags and structured content

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **Nodemon** - Development server with auto-restart
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
MrtDgrmnciApp/
├── backend/                 # Backend server
│   ├── config/             # Database configuration
│   ├── routes/             # API endpoints
│   ├── scripts/            # Database migration and seeding
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

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

3. **Set up the database**
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages
- `npm start` - Start the production server

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📊 Database Schema

The application uses SQLite with the following tables:

- **users** - User authentication and profiles
- **projects** - Portfolio projects with technologies
- **skills** - Technical skills and proficiency levels
- **experience** - Work experience and history
- **education** - Educational background
- **blog_posts** - Blog articles and content
- **contact_messages** - Contact form submissions

## 🎨 Customization

### Content Updates

1. **Projects**: Edit `backend/scripts/seed.js` to update project data
2. **Skills**: Modify the skills array in the seed script
3. **Experience**: Update work experience in the seed script
4. **Styling**: Customize Tailwind classes in component files

### Theme Customization

The project uses a futuristic theme with:
- Neon blue, cyan, purple, and pink accents
- Dark backgrounds with glassmorphism effects
- Custom fonts (Orbitron, Inter, Fira Code)
- Smooth animations and transitions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

### Database Configuration

The SQLite database is automatically created in the root directory as `portfolio.db`.

## 📱 Pages

1. **Home** - Hero section with introduction and stats
2. **Projects** - Showcase of automation projects and frameworks
3. **Resume** - Professional experience and skills
4. **Blog** - Articles about test automation and QA
5. **Contact** - Contact form and information
6. **Admin** - Admin panel for content management

## 🧪 Testing

The portfolio showcases expertise in:
- **Selenium** - Web automation framework
- **Cypress** - End-to-end testing
- **Playwright** - Modern browser automation
- **Python/JavaScript** - Programming languages
- **Jenkins** - CI/CD pipelines
- **Docker** - Containerization

## 📈 Performance

- **Lighthouse Score**: Optimized for performance, accessibility, and SEO
- **Bundle Size**: Minimized with Vite's tree-shaking
- **Loading Speed**: Fast initial load with code splitting
- **SEO**: Meta tags, structured data, and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**MRT** - Test Automation Advisor

---

*Built with ❤️ for the QA community* 