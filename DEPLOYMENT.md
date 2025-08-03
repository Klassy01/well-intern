# 🚀 Deploying Wellness Platform to Render

This guide will walk you through deploying your full-stack Wellness Session Platform to Render, including both the backend API and frontend application.

## 📋 Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account (for production database)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose "Build a Database" → "Shared" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "wellness-platform")

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `wellness-admin`
   - Generate a secure password (save it!)
   - Grant "Atlas Admin" privileges

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render to connect to your database

5. **Get Connection String**
   - Go to "Databases" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://wellness-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

## 🔧 Step 2: Prepare Your Code for Deployment

### Backend Preparation

1. **Create render.yaml** (for easier deployment):

```yaml
services:
  - type: web
    name: wellness-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        fromService:
          type: web
          name: wellness-backend
          property: port
```

2. **Update package.json scripts**:
Make sure your backend package.json has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

3. **Environment Variables for Production**:
You'll need these environment variables on Render:
- `NODE_ENV=production`
- `MONGODB_URI=<your-atlas-connection-string>`
- `JWT_SECRET=<generate-a-secure-secret>`
- `JWT_EXPIRE=7d`
- `FRONTEND_URL=<your-render-frontend-url>`

### Frontend Preparation

1. **Update vite.config.ts** for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
})
```

2. **Update API client** to use environment variable:

In `src/utils/api.ts`, update the baseURL:
```typescript
constructor() {
  this.api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // ... rest of the constructor
}
```

## 🚀 Step 3: Deploy Backend to Render

1. **Push Code to GitHub**
   ```bash
   cd /path/to/your/project
   git init
   git add .
   git commit -m "Initial commit - Wellness Platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/wellness-platform.git
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com) and log in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose your repository: `wellness-platform`

3. **Configure Backend Service**
   - **Name**: `wellness-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

4. **Set Environment Variables**
   Click "Advanced" and add these environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://wellness-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wellness-platform?retryWrites=true&w=majority
   JWT_SECRET=super-secure-jwt-secret-for-production-min-32-chars
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment (5-10 minutes)
   - Your backend will be available at: `https://wellness-backend.onrender.com`

## 🌐 Step 4: Deploy Frontend to Render

1. **Create Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository
   - Choose your repository: `wellness-platform`

2. **Configure Frontend Service**
   - **Name**: `wellness-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   Add this environment variable:
   ```
   VITE_API_URL=https://wellness-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)
   - Your frontend will be available at: `https://wellness-frontend.onrender.com`

## 🔄 Step 5: Update CORS and Final Configuration

1. **Update Backend CORS**
   Once you have your frontend URL, update the backend's CORS configuration:

   In your backend `.env` or Render environment variables:
   ```
   FRONTEND_URL=https://wellness-frontend.onrender.com
   ```

2. **Test Your Application**
   - Visit your frontend URL
   - Try registering a new account
   - Create and publish a session
   - Verify auto-save functionality works

## 📊 Step 6: Seed Production Database (Optional)

1. **Connect to your deployed backend**
   ```bash
   # Clone your repo locally if needed
   cd backend
   
   # Update .env with production MongoDB URI
   MONGODB_URI=your-atlas-connection-string node seed.js
   ```

   Or create a temporary script on Render by adding a build command that runs the seeder once.

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Build Failures**
   - Check build logs on Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings (allow 0.0.0.0/0)
   - Ensure database user has proper permissions

3. **CORS Errors**
   - Verify FRONTEND_URL environment variable
   - Check that frontend URL matches exactly (with/without trailing slash)

4. **API Connection Issues**
   - Verify VITE_API_URL environment variable
   - Check that backend service is running
   - Test API endpoints directly

### Useful Render Commands

- **View Logs**: Go to your service → "Logs" tab
- **Redeploy**: Click "Manual Deploy" → "Deploy latest commit"
- **Environment Variables**: Go to service → "Environment" tab

## 💡 Performance Tips

1. **Use Paid Plans**: Free tier services sleep after 15 minutes of inactivity
2. **Enable Redis**: For session caching (available on paid plans)
3. **CDN**: Render automatically provides CDN for static sites
4. **Database Optimization**: Use MongoDB Atlas M2+ for better performance

## 🎉 Success!

Your Wellness Platform is now live on Render! 

- **Frontend**: `https://wellness-frontend.onrender.com`
- **Backend API**: `https://wellness-backend.onrender.com`

Share your deployed application and enjoy your full-stack wellness platform!

---

## 📝 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user and network access configured
- [ ] Code pushed to GitHub
- [ ] Backend web service deployed on Render
- [ ] Frontend static site deployed on Render
- [ ] Environment variables configured
- [ ] CORS updated with production URLs
- [ ] Application tested and working
- [ ] (Optional) Production database seeded

**Need help?** Check Render's documentation or reach out for support!
