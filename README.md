# 🧘 Secure Wellness Session Platform

A full-stack application that allows users to register, log in securely, view wellness sessions (yoga, meditation, etc.), and create/draft their own custom sessions with auto-save functionality.

## 🛠 Tech Stack

- **Frontend**: React.js with TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB 
- **Authentication**: JWT (jsonwebtoken + bcrypt)
- **Styling**: Tailwind CSS
- **Auto-save**: Debounced auto-save every 5 seconds
- **Form Validation**: React Hook Form + Zod

## 📦 Project Structure

```
well-intern/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── sessionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── sessions.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── MySessionsPage.tsx
│   │   │   └── SessionEditorPage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useSessions.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── helpers.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

5. Seed the database with sample data (optional):
```bash
node seed.js
```

6. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` or `http://localhost:5174`

## 📡 API Documentation

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User registration | `{ email, password }` |
| POST | `/api/auth/login` | User login | `{ email, password }` |
| GET | `/api/auth/me` | Get current user | Headers: `Authorization: Bearer <token>` |

### Session Routes

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/api/sessions` | Get all published sessions | - |
| GET | `/api/my-sessions` | Get user's sessions | `Authorization: Bearer <token>` |
| GET | `/api/my-sessions/:id` | Get single user session | `Authorization: Bearer <token>` |
| POST | `/api/my-sessions/save-draft` | Save/update draft | `Authorization: Bearer <token>` |
| POST | `/api/my-sessions/publish` | Publish session | `Authorization: Bearer <token>` |
| PUT | `/api/my-sessions/:id` | Update session | `Authorization: Bearer <token>` |
| DELETE | `/api/my-sessions/:id` | Delete session | `Authorization: Bearer <token>` |

## 🗄 Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  created_at: Date,
  updated_at: Date
}
```

### Session Schema
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  title: String,
  tags: [String],
  json_file_url: String,
  description: String,
  status: "draft" | "published",
  created_at: Date,
  updated_at: Date
}
```

## ✨ Features

### Core Features
- ✅ User registration and login with JWT authentication
- ✅ Password hashing with bcrypt and validation
- ✅ Protected routes and middleware
- ✅ View published wellness sessions with search
- ✅ Create, edit, and manage personal sessions
- ✅ Draft and publish functionality
- ✅ Auto-save with 5-second debounce
- ✅ Professional responsive UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Form validation and error handling

### Bonus Features
- ✅ Auto-save feedback with toast notifications
- ✅ Logout functionality
- ✅ Session management (edit, delete)
- ✅ Search and filter functionality
- ✅ Mobile-responsive design
- ✅ Loading states and spinners
- ✅ Clean separation of concerns
- ✅ Error handling and validation
- ✅ Sample data seeder

## 🎯 Usage

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View all published wellness sessions from the community
3. **My Sessions**: View and manage your own sessions (drafts and published)
4. **Session Editor**: Create new sessions with:
   - Title and description
   - Tags (comma-separated)
   - JSON file URL
   - Auto-save every 5 seconds
   - Save as Draft or Publish buttons

### Demo Account

After running the database seeder, you can view sample sessions on the dashboard. Create your own account to start building sessions.

## 🧪 Testing the Application

1. **Start both servers** (backend on :5000, frontend on :5173/:5174)
2. **Register a new account** with email and secure password
3. **View sample sessions** on the dashboard
4. **Create a new session** and test the auto-save feature
5. **Publish your session** and see it appear on the public dashboard
6. **Test search functionality** by searching for tags or titles

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify, Render

### Quick Render Deployment with CI/CD

1. **Prepare for deployment**:
   ```bash
   ./deploy-prep.sh
   ```

2. **Set up MongoDB Atlas** (free tier available)

3. **Deploy to Render with Auto-Deploy**:
   - Push code to GitHub
   - Create Web Service (backend) and Static Site (frontend)
   - Enable Auto-Deploy from GitHub
   - Configure environment variables (see `RENDER_ENV.md`)

4. **Automated CI/CD Pipeline**:
   - ✅ Automatic testing on every push
   - ✅ Type checking and linting
   - ✅ Security audits
   - ✅ Automated deployment from `main` branch
   - ✅ Build verification and health checks

📖 **Detailed Instructions**: 
- **Deployment**: See `DEPLOYMENT.md` for complete step-by-step guide
- **CI/CD Setup**: See `CICD.md` for pipeline configuration

### CI/CD Features

- 🔄 **Continuous Integration**: Automated testing and quality checks
- 🚀 **Continuous Deployment**: Auto-deploy on successful tests
- 🛡️ **Quality Gates**: Linting, type checking, security audits
- 📊 **Build Artifacts**: Saved for debugging and rollback
- 🔔 **Notifications**: Deployment status updates
- 🌿 **Branch Protection**: Deploy only from protected branches

### Deployment Checklist
- [ ] MongoDB Atlas cluster created and configured
- [ ] Code pushed to GitHub repository
- [ ] CI/CD workflows added (`.github/workflows/`)
- [ ] Backend web service deployed on Render with auto-deploy
- [ ] Frontend static site deployed on Render with auto-deploy
- [ ] Environment variables configured correctly
- [ ] CORS updated with production URLs
- [ ] Pipeline tested and passing
- [ ] Application tested and working
- [ ] (Optional) Production database seeded

**Live Demo**: After deployment, your app will be available at:
- Frontend: `https://your-app-name.onrender.com`
- Backend API: `https://your-api-name.onrender.com`

## 🏗 Architecture

### Backend Architecture
- **Express.js** server with middleware for authentication, CORS, and rate limiting
- **MongoDB** with Mongoose for data modeling
- **JWT** for stateless authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **React Router** for client-side routing
- **Context API** for global state management
- **Custom hooks** for data fetching and auto-save
- **Tailwind CSS** for styling
- **Vite** for fast development and building

## 📝 API Response Format

```javascript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}

// Error Response  
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## � License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the wellness community**
