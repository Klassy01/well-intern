# 📋 **DEPLOYMENT CHECKLIST** - Print This!

## **PHASE 1: MongoDB Atlas Setup** ⏱️ 10 minutes

### Step 1: Create Account
- [ ] Go to `mongodb.com/atlas`
- [ ] Click "Try Free"
- [ ] Sign up (email or Google)
- [ ] Verify email

### Step 2: Create Cluster
- [ ] Click "Build a Database"
- [ ] Choose "Shared" (FREE)
- [ ] Provider: AWS
- [ ] Region: Closest to you
- [ ] Name: `wellness-platform`
- [ ] Click "Create Cluster"

### Step 3: Database User
- [ ] Username: `wellness-admin`
- [ ] Click "Autogenerate Secure Password"
- [ ] **SAVE PASSWORD**: `________________`
- [ ] Privileges: "Read and write to any database"
- [ ] Click "Create User"

### Step 4: Network Access
- [ ] Add current IP address
- [ ] Add IP: `0.0.0.0/0` (for Render)
- [ ] Description: "Render access"

### Step 5: Connection String
- [ ] Click "Connect" on cluster
- [ ] Choose "Connect your application"
- [ ] Driver: Node.js 5.5+
- [ ] Copy connection string
- [ ] Replace `<password>` with saved password
- [ ] Add `/wellness-platform` before `?`
- [ ] **SAVE CONNECTION STRING**: 
```
_________________________________________________
_________________________________________________
```

---

## **PHASE 2: Render Backend** ⏱️ 15 minutes

### Step 1: Create Account
- [ ] Go to `render.com`
- [ ] Click "Get Started for Free"
- [ ] Sign up with GitHub
- [ ] Authorize repository access

### Step 2: Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Choose repository: `Klassy01/well-intern`
- [ ] Name: `wellness-backend`
- [ ] Root Directory: `backend`
- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Step 3: Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = [your connection string]
- [ ] `JWT_SECRET` = [generate with crypto command]
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `FRONTEND_URL` = `https://wellness-frontend-XXXXX.onrender.com`

### Step 4: Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**JWT Secret**: `_________________________________`

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] **BACKEND URL**: `_________________________________`
- [ ] Test: Visit `[backend-url]/api/health`

---

## **PHASE 3: Render Frontend** ⏱️ 10 minutes

### Step 1: Static Site
- [ ] Click "New +" → "Static Site"
- [ ] Choose same repository: `Klassy01/well-intern`
- [ ] Name: `wellness-frontend`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`

### Step 2: Environment Variable
- [ ] `VITE_API_URL` = `[backend-url]/api`

### Step 3: Deploy
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (5-10 minutes)
- [ ] **FRONTEND URL**: `_________________________________`

---

## **PHASE 4: Final Configuration** ⏱️ 5 minutes

### Step 1: Update Backend CORS
- [ ] Go to backend service → Environment
- [ ] Update `FRONTEND_URL` with actual frontend URL
- [ ] Click "Save Changes"
- [ ] Wait for redeploy (2-3 minutes)

### Step 2: Enable Auto-Deploy
- [ ] Backend: Settings → Auto-Deploy → ON
- [ ] Frontend: Settings → Auto-Deploy → ON

---

## **PHASE 5: Testing** ⏱️ 10 minutes

### Backend Tests
- [ ] Visit `[backend-url]/api/health`
- [ ] Should show: `{"status":"OK",...}`

### Frontend Tests
- [ ] Visit frontend URL
- [ ] Register new account: `test@example.com` / `password123`
- [ ] Login with same credentials
- [ ] See dashboard with sessions
- [ ] Create new session
- [ ] Test auto-save (wait 5 seconds)
- [ ] Publish session
- [ ] See published session on dashboard

---

## **🎉 SUCCESS!**

### Your Live Application
- **Frontend**: `_________________________________`
- **Backend**: `_________________________________`
- **Health Check**: `_________________________________`

### Features Working
- [ ] User registration/login
- [ ] Session creation/editing
- [ ] Auto-save (5 seconds)
- [ ] Publishing system
- [ ] Professional UI
- [ ] Cloud database
- [ ] HTTPS security
- [ ] Auto-deployment

### Time & Cost
- ⏱️ **Total Time**: _______ minutes
- 💰 **Total Cost**: $0 (free tiers)
- 🚀 **Status**: LIVE ON THE INTERNET!

---

## **🆘 Quick Troubleshooting**

**Frontend shows "Application Error":**
- Check VITE_API_URL environment variable

**Backend won't start:**
- Verify MongoDB URI format
- Check all environment variables

**Can't connect to database:**
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify username/password in connection string

**CORS errors:**
- Ensure FRONTEND_URL matches actual frontend domain

---

**📧 Save this checklist and URLs for future reference!**
