# 🚀 Render Deployment Guide - Step by Step

## 🎯 Overview
Deploy your PostgreSQL-only wellness platform to Render with automatic database setup, environment configuration, and CI/CD.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ GitHub account with your code pushed
- ✅ Render account (free at https://render.com)
- ✅ PostgreSQL-only backend (MongoDB completely removed)
- ✅ Environment variables ready

---

## 🗄️ Step 1: Create PostgreSQL Database

### 1.1 Go to Render Dashboard
1. Visit: https://dashboard.render.com/
2. Sign in with your account

### 1.2 Create New PostgreSQL Database
1. Click **"New +"** button (top right)
2. Select **"PostgreSQL"**

### 1.3 Database Configuration
Fill in these details:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `wellness-platform-db` | Database service name |
| **Database** | `wellness_platform` | Actual database name |
| **User** | `wellness_admin` | Database username |
| **Region** | `Oregon (US West)` | Same region as your backend |
| **PostgreSQL Version** | `15` | Latest stable version |
| **Plan** | `Free` | Perfect for development |

### 1.4 Create Database
1. Click **"Create Database"**
2. Wait 2-3 minutes for provisioning
3. ✅ Database will be ready when status shows "Available"

### 1.5 Copy Connection Details
Once ready, you'll see connection information. **Copy these values:**

```
Internal Database URL: postgresql://username:password@hostname/database
External Database URL: postgresql://username:password@hostname/database
```

**Important**: Use the **Internal Database URL** for better performance and security.

---

## 🖥️ Step 2: Deploy Backend Service

### 2.1 Create New Web Service
1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**

### 2.2 Connect Repository
1. Select **"Build and deploy from a Git repository"**
2. Click **"Connect account"** if not connected
3. Find and select: **`Klassy01/well-intern`**
4. Click **"Connect"**

### 2.3 Service Configuration

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `wellness-platform-backend` | Or keep `well-intern` |
| **Region** | `Oregon (US West)` | Same as database |
| **Branch** | `main` | Your default branch |
| **Root Directory** | `backend` | Important: Backend folder |
| **Runtime** | `Node` | Auto-detected |
| **Build Command** | `npm install` | Auto-detected |
| **Start Command** | `npm start` | Uses your PostgreSQL server |

### 2.4 Environment Variables
Click **"Advanced"** and add these environment variables:

| Variable Name | Value |
|---------------|--------|
| `DATABASE_URL` | `[Your Internal Database URL from Step 1.5]` |
| `POSTGRES_URL` | `[Same as DATABASE_URL]` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production-2024` |
| `JWT_EXPIRE` | `30d` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

**Example DATABASE_URL:**
```
postgresql://wellness_admin:password123@dpg-abc123-a/wellness_platform
```

### 2.5 Deploy Backend
1. Click **"Create Web Service"**
2. Watch the build logs
3. ✅ Backend is ready when you see: "Your service is live 🎉"

---

## 🌐 Step 3: Deploy Frontend Service

### 3.1 Create New Static Site
1. In Render Dashboard, click **"New +"**
2. Select **"Static Site"**

### 3.2 Connect Same Repository
1. Select **"Build and deploy from a Git repository"**
2. Choose: **`Klassy01/well-intern`** (same repo)
3. Click **"Connect"**

### 3.3 Static Site Configuration

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `wellness-platform-frontend` | Descriptive name |
| **Branch** | `main` | Your default branch |
| **Root Directory** | `frontend` | Important: Frontend folder |
| **Build Command** | `npm run build` | Vite build command |
| **Publish Directory** | `dist` | Vite output directory |

### 3.4 Frontend Environment Variables
Add these environment variables:

| Variable Name | Value |
|---------------|--------|
| `VITE_API_URL` | `https://[YOUR-BACKEND-URL]/api` |

**Example:**
```
VITE_API_URL=https://wellness-platform-backend.onrender.com/api
```

**Note**: Replace `[YOUR-BACKEND-URL]` with your actual backend URL from Step 2.

### 3.5 Deploy Frontend
1. Click **"Create Static Site"**
2. Watch the build process
3. ✅ Frontend is ready when build completes

---

## 🔧 Step 4: Configure CORS (Backend Update)

### 4.1 Update Backend Environment
Go back to your **backend service** and add:

| Variable Name | Value |
|---------------|--------|
| `FRONTEND_URL` | `https://[YOUR-FRONTEND-URL]` |

**Example:**
```
FRONTEND_URL=https://wellness-platform-frontend.onrender.com
```

### 4.2 Trigger Redeploy
1. Go to your backend service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for redeploy to complete

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend Health
Visit: `https://[YOUR-BACKEND-URL]/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Wellness Platform API is running",
  "database": "PostgreSQL",
  "timestamp": "2025-08-02T..."
}
```

### 5.2 Test Frontend
1. Visit your frontend URL
2. Try registering a new user
3. Try logging in
4. Check if all pages load correctly

### 5.3 Test API Integration
In browser console (F12), check for:
- ✅ No CORS errors
- ✅ Successful API calls (200 status)
- ✅ Database operations working

---

## 🎯 Step 6: Verification Checklist

- [ ] **Database**: PostgreSQL created and running
- [ ] **Backend**: Deployed and healthy (`/api/health` works)
- [ ] **Frontend**: Built and accessible
- [ ] **CORS**: No cross-origin errors
- [ ] **Registration**: Can create new users
- [ ] **Login**: Authentication works
- [ ] **Sessions**: CRUD operations functional

---

## 🚨 Troubleshooting

### Database Connection Issues
```
❌ Error: getaddrinfo EAI_AGAIN
```
**Solution**: Check DATABASE_URL is correct and database is running

### CORS Errors
```
❌ Access to fetch blocked by CORS policy
```
**Solution**: Verify FRONTEND_URL in backend environment variables

### Build Failures
```
❌ npm ERR! code ENOENT
```
**Solution**: Check Root Directory is set correctly (`backend` or `frontend`)

### Environment Variables Not Loading
```
❌ process.env.DATABASE_URL is undefined
```
**Solution**: Redeploy after adding environment variables

---

## 🎉 Success!

Once all steps are complete, you'll have:

- 🗄️ **PostgreSQL Database**: Reliable, free, with automatic backups
- 🖥️ **Backend API**: Auto-scaling Node.js with Express
- 🌐 **Frontend**: Fast static site with Vite
- 🔄 **CI/CD**: Automatic deployments on Git push
- 🛡️ **Security**: HTTPS, CORS, environment variables

Your wellness platform is now live and production-ready! 🚀

---

## 🔗 Next Steps

1. **Custom Domain**: Add your own domain in Render settings
2. **Monitoring**: Set up health checks and alerts
3. **Performance**: Monitor and optimize API responses
4. **Scaling**: Upgrade plans as your user base grows

**Happy deploying!** 🎉
