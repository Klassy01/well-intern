# 🚀 **QUICK DEPLOYMENT REFERENCE**

## **Before You Start:**
✅ Code is on GitHub: `https://github.com/Klassy01/well-intern`  
✅ Both servers working locally  

## **1. MongoDB Atlas (5 minutes)**
🔗 **https://www.mongodb.com/atlas**
- Create free cluster: `wellness-platform`
- Create user: `wellness-admin` (save password!)
- Allow all IPs: 0.0.0.0/0
- Copy connection string

## **2. Render Backend (10 minutes)**
🔗 **https://render.com**
- New Web Service → Connect GitHub repo
- Name: `wellness-backend`
- Root: `backend`
- Build: `npm install`
- Start: `npm start`

**Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://wellness-admin:PASSWORD@cluster.mongodb.net/wellness-platform
JWT_SECRET=your-32-char-secret-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.onrender.com
```

## **3. Render Frontend (10 minutes)**
- New Static Site → Same GitHub repo
- Name: `wellness-frontend`
- Root: `frontend`
- Build: `npm install && npm run build`
- Publish: `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## **4. Update CORS (2 minutes)**
- Go back to backend service
- Update `FRONTEND_URL` with actual frontend URL
- Save (auto-redeploys)

## **5. Test (5 minutes)**
- Visit frontend URL
- Register new account
- Create a session
- Test auto-save

---

## **🔧 Environment Variable Examples**

### **MongoDB Connection String Format:**
```
mongodb+srv://wellness-admin:YOUR_PASSWORD@wellness-platform.abc123.mongodb.net/wellness-platform?retryWrites=true&w=majority
```

### **Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Your URLs Will Look Like:**
- Backend: `https://wellness-backend-xyz123.onrender.com`
- Frontend: `https://wellness-frontend-abc456.onrender.com`

---

## **⚡ Quick Commands**

### **Test Deployment:**
```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Push updates
git add .
git commit -m "Update"
git push origin main
```

### **Check Status:**
```bash
./status.sh  # Local development status
```

---

## **🆘 Common Issues**

**Backend won't start?**
→ Check MongoDB URI and environment variables

**Frontend can't connect?**
→ Verify VITE_API_URL points to backend

**Database connection failed?**
→ Check MongoDB Atlas network access (0.0.0.0/0)

**Service sleeping?**
→ Free tier sleeps after 15 minutes (first request takes 30-60s)

---

## **📱 What You Get**

✅ **Live URLs** - Share with anyone  
✅ **HTTPS/SSL** - Secure connections  
✅ **Auto-deploy** - Push to GitHub = automatic updates  
✅ **Professional** - Production-ready hosting  
✅ **Free tier** - $0 cost to start  
✅ **Scalable** - Easy to upgrade later  

**Total setup time: ~30 minutes**

---

**Need detailed instructions? See `RENDER_DEPLOYMENT_TUTORIAL.md`**
