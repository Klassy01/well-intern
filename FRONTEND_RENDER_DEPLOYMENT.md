# Frontend Deployment to Render - Step by Step Guide

## ✅ Backend Status
Your backend is successfully deployed and running at: https://well-intern.onrender.com

## 🚀 Frontend Deployment Steps

### Step 1: Create Frontend Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Static Site"**

### Step 2: Connect Your Repository

1. **Connect Repository:**
   - Choose "Connect a repository"
   - Select your GitHub account
   - Choose repository: `well-intern`
   - Click "Connect"

### Step 3: Configure Frontend Service

Fill in the following configuration:

#### Basic Information
- **Name:** `wellness-platform-frontend` (or any name you prefer)
- **Branch:** `main`
- **Root Directory:** `frontend`

#### Build Settings
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`

#### Environment Variables
Click "Advanced" and add these environment variables:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://well-intern.onrender.com/api` |

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait for the build and deployment to complete (takes 2-5 minutes)

### Step 5: Update Backend CORS Settings

After your frontend is deployed, you'll get a URL like: `https://wellness-platform-frontend.onrender.com`

1. Go to your backend service in Render
2. Go to **Environment** tab
3. Update the `FRONTEND_URL` variable:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://YOUR-FRONTEND-URL.onrender.com` (replace with your actual frontend URL)
4. Save changes (this will trigger a backend redeploy)

## 🔧 Troubleshooting

### Build Issues
If the build fails:
```bash
# Check if these commands work locally:
cd frontend
npm ci
npm run build
```

### Environment Variables
- Make sure `VITE_API_URL` points to your backend: `https://well-intern.onrender.com/api`
- Environment variables must be prefixed with `VITE_` for Vite to include them

### CORS Issues
- Ensure `FRONTEND_URL` in backend points to your frontend URL
- Both services should use HTTPS (which Render provides automatically)

## 📋 Verification Checklist

After deployment, verify:

1. ✅ Frontend builds successfully
2. ✅ Frontend deploys to Render
3. ✅ Frontend loads in browser
4. ✅ Backend CORS allows frontend domain
5. ✅ API calls work from frontend to backend
6. ✅ Authentication flow works
7. ✅ All pages load correctly

## 🌐 Expected URLs

- **Backend:** https://well-intern.onrender.com
- **Frontend:** https://YOUR-FRONTEND-NAME.onrender.com
- **API Health:** https://well-intern.onrender.com/api/health

## 🛠 Post-Deployment

After both services are running:

1. Test user registration
2. Test user login
3. Test session creation
4. Test auto-save functionality
5. Test all navigation

Your wellness platform will be fully deployed and accessible to users worldwide! 🎉
