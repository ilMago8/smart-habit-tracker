# 🌟 Smart Habit Tracker

**A modern application for tracking daily habits with a colorful and intuitive React interface.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://smart-habit-tracker.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ilMago8/smart-habit-tracker)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🚀 Live Demo

✨ **The app is live and running!** → [smart-habit-tracker.vercel.app](https://smart-habit-tracker.vercel.app)

*Complete full-stack application with user authentication and real-time data persistence*

---

## 🎯 Key Features

### 🔐 User Authentication
- **Secure registration** with email validation
- **Login/logout** with session management  
- **User profiles** with editable bio and goals
- **Password encryption** with secure hashing
- **Multi-user support** with data isolation

### 📊 Interactive Dashboard
- **Habit visualization** with colorful and animated cards
- **Progress bars** showing weekly completion  
- **Daily counter** of completed habits
- **Responsive design** optimized for mobile and desktop
- **Real-time updates** with database synchronization

### ⚡ Habit Management
- **Quick creation** with intuitive form and validation
- **Complete customization**: 12 icons + 10 predefined colors
- **Flexible goals**: from 1 to 7 days per week
- **Visual states** for immediate feedback
- **Toggle completion** - mark/unmark habits as done
- **Delete habits** with confirmation
- **Reset progress** functionality

### 📈 Advanced Statistics  
- **Dedicated dashboard** with detailed metrics
- **Graphic visualizations** with colored progress bars
- **Real-time completion percentages**
- **Dynamic motivational messages** based on progress
- **Weekly tracking** and completion rates
- **Personal insights** and habit analytics

### 🎨 Modern UI/UX
- **Consistent design system** with CSS custom properties
- **Smooth animations** and optimized transitions
- **WCAG accessibility** with ARIA labels and keyboard navigation
- **Optimized performance** with React.memo and lazy loading

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern Hooks and Concurrent Features
- **Vite 5.4** - Lightning-fast build tool with HMR
- **Modern CSS3** - Custom properties, Container Queries
- **ESLint + Prettier** - Automatic linting and formatting

### Backend
- **PHP 8+** - Modern server-side scripting
- **MySQL 8** - Robust relational database
- **REST API** - Complete CRUD operations
- **JWT-ready** - Token-based authentication system
- **CORS enabled** - Cross-origin resource sharing

### Database
- **MySQL schema** - Optimized with indexes
- **Foreign key constraints** - Data integrity
- **Multi-user architecture** - Secure data isolation
- **Prepared statements** - SQL injection protection

### Security
- **Password hashing** - Bcrypt encryption
- **Input validation** - Server and client-side
- **SQL injection protection** - Prepared statements
- **XSS prevention** - Content sanitization

### Deployment
- **Vercel** - Frontend hosting with API rewrites
- **IONOS VPS** - Backend PHP server deployment
- **Apache** - Web server configuration
- **Environment variables** - Secure configuration

### Performance & Optimizations
- **Code Splitting** - Optimized bundle with lazy loading  
- **React.memo** - Prevention of unnecessary re-renders
- **useCallback/useMemo** - Hook optimizations
- **GPU Acceleration** - Hardware-accelerated animations

### Deploy & DevOps
- **Vercel** - Automatic deploy with GitHub integration
- **GitHub Actions** - CI/CD pipeline (future)
- **Progressive Web App** - PWA ready with manifest

---

## 🏃‍♂️ Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+ or **yarn** 1.22+
- **Git** 2.30+
- **PHP** 8+ (for local backend development)
- **MySQL** 8+ (for local backend development)

### Frontend Only (Demo Mode)
```bash
# Clone the repository
git clone https://github.com/ilMago8/smart-habit-tracker.git
cd smart-habit-tracker

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Full-Stack Development
```bash
# Frontend setup
cd frontend && npm install && npm run dev

# Backend setup (in a new terminal)
cd backend
php -S localhost:8000

# Database setup
mysql -u root -p < ../database/schema.sql
```

🎉 **App available at:** http://localhost:3000
🔗 **API available at:** http://localhost:8000

### Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build  
npm run preview  # Build preview
npm run lint     # Code check
```

---

## 🏗️ Project Architecture

```
smart-habit-tracker/
├── frontend/           # React app (Deployed on Vercel)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── pages/         # Main pages (Dashboard, Auth)
│   │   ├── services/      # API service layer
│   │   └── styles/        # CSS and design system
│   ├── public/           # Static assets
│   └── dist/            # Build output
├── backend/             # PHP API (Deployed on IONOS VPS)
│   ├── api/
│   │   ├── auth/         # Authentication endpoints
│   │   └── habits/       # Habit management endpoints
│   ├── config/          # Database configuration
│   └── index.php        # API router
├── database/            # MySQL schema and migrations
│   └── schema.sql       # Database structure
└── docs/               # Documentation
```

---

## 🎨 Design System

### Color Palette
```css
--primary: #007bff     /* Main blue */
--success: #28a745     /* Success green */
--warning: #ffc107     /* Warning yellow */
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-base: 1rem     /* 16px */
--font-size-title: 2.5rem  /* 40px */
```

### Spacing System
```css
--spacing-sm: 0.5rem   /* 8px */
--spacing-md: 1rem     /* 16px */  
--spacing-lg: 1.5rem   /* 24px */
--spacing-xl: 2rem     /* 32px */
```

---

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Screenshot)

### Habit Creation
![Form](https://via.placeholder.com/800x400/28a745/ffffff?text=Add+Habit+Form)

### Statistics  
![Stats](https://via.placeholder.com/800x400/ffc107/000000?text=Statistics+Panel)

---

## 🚀 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect Vercel account to GitHub
3. Import project on Vercel
4. Automatic deploy on every push!

### Build Configuration
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",  
  "installCommand": "cd frontend && npm install"
}
```

### Other Providers
- **Netlify**: Drag & drop the `frontend/dist` folder
- **GitHub Pages**: Via GitHub Actions
- **Railway**: Direct repository connection

---

## 🗺️ Roadmap

### ✅ V2.0 - Backend Integration (COMPLETED!)
- [x] **MySQL database** for real persistence
- [x] **REST API** with secure authentication
- [x] **Multi-user** with personal profiles
- [x] **User registration** and login system
- [x] **Cloud deployment** on production servers
- [x] **Data security** with password encryption
- [x] **Habit toggle** functionality
- [x] **Real-time statistics** and analytics

### 🎯 V2.1 - UX Improvements (In Progress)
- [ ] **Dark mode** toggle with persistence
- [ ] **Streak tracking** for consecutive series  
- [ ] **Predefined habit templates**
- [ ] **Data export** in CSV/JSON
- [ ] **Improved mobile** responsive design
- [ ] **Loading states** and better UX feedback

### 🎯 V3.0 - Advanced Features
- [ ] **Push notifications** for reminders
- [ ] **Habit insights** with advanced analytics  
- [ ] **Goal setting** with long-term objectives
- [ ] **Integration** with Google Calendar
- [ ] **Habit categories** and tagging system
- [ ] **Progress charts** and visual analytics
- [ ] **Integration** with Google Calendar

### 🎯 V4.0 - Social Features
- [ ] **Progress sharing** on social media
- [ ] **Challenges** between friends
- [ ] **Weekly leaderboards**
- [ ] **Achievement system** with badges

---

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user  
- `GET /api/auth/profile?user_id={id}` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Habit Management Endpoints  
- `GET /api/habits/get.php?user_id={id}` - Get user habits
- `POST /api/habits/create.php` - Create new habit
- `POST /api/habits/check.php` - Toggle habit completion
- `POST /api/habits/manage.php` - Delete habit or reset progress
- `GET /api/habits/stats.php?user_id={id}` - Get habit statistics

### Request/Response Format
All endpoints use JSON format with standardized response structure:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if applicable"
}
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

### How to Contribute
1. **Fork** the project
2. **Create branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** (`git commit -m 'Add amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. **Pull Request** with detailed description

### Guidelines
- Follow existing ESLint conventions
- Write tests for new features
- Update documentation when necessary
- Use descriptive commit messages

---

## 🐛 Issues and Support

Found a bug or have a feature request?

### Report Bug
- Use the [issue template](https://github.com/ilMago8/smart-habit-tracker/issues/new?template=bug_report.md)
- Include screenshots if possible
- Specify browser and OS version

### Feature Request  
- Use the [feature template](https://github.com/ilMago8/smart-habit-tracker/issues/new?template=feature_request.md)
- Describe the use case
- Explain the benefit for users

---

## 📄 License

This project is released under **MIT License**.

See the [LICENSE](LICENSE) file for all details.

---

## 👨‍💻 Author

**ilMago8**
- GitHub: [@ilMago8](https://github.com/ilMago8)
- LinkedIn: [LinkedIn Profile](#)
- Twitter: [@ilMago8](#)

---

## 🙏 Acknowledgments

- **React Team** for the fantastic library
- **Vite Team** for the incredibly fast build tool  
- **Vercel** for excellent free hosting
- **Open Source Community** for continuous inspiration
- **Beta testers** for feedback and suggestions

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/ilMago8/smart-habit-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/ilMago8/smart-habit-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/ilMago8/smart-habit-tracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ilMago8/smart-habit-tracker)

---

**⭐ If you liked the project, leave a star! Help other developers discover it.**

**🔄 Share with the community and help us grow!**