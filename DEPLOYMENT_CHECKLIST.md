# ✅ Render Deployment Checklist

## Pre-Deployment
- [ ] Code working locally (both frontend and backend)
- [ ] Git repository initialized and committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] CI/CD pipeline files committed (`.github/workflows/`)

## CI/CD Pipeline Setup
- [ ] GitHub Actions workflows added to repository
- [ ] Main CI/CD pipeline (`ci-cd.yml`) configured
- [ ] Auto-deploy enabled on Render services
- [ ] Branch protection rules configured (optional)
- [ ] Pipeline tested with a test commit

## MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created with password
- [ ] Network access configured (allow 0.0.0.0/0)
- [ ] Connection string copied

## Render Backend Deployment
- [ ] Render account created
- [ ] Web Service created and connected to GitHub repo
- [ ] Auto-Deploy enabled from `main` branch
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<atlas-connection-string>`
  - [ ] `JWT_SECRET=<secure-32-char-secret>`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `FRONTEND_URL=<frontend-render-url>`
- [ ] Service deployed successfully
- [ ] Backend URL noted: `https://______.onrender.com`

## Render Frontend Deployment
- [ ] Static Site created and connected to GitHub repo
- [ ] Auto-Deploy enabled from `main` branch
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL=<backend-render-url>/api`
- [ ] Site deployed successfully
- [ ] Frontend URL noted: `https://______.onrender.com`

## Final Configuration
- [ ] Backend FRONTEND_URL updated with actual frontend URL
- [ ] Both services redeployed (auto-deploy will handle this)
- [ ] CORS working correctly
- [ ] Application tested end-to-end
- [ ] CI/CD pipeline triggered and successful

## Testing
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard shows sessions
- [ ] Session creation works
- [ ] Auto-save functionality works
- [ ] API endpoints responding correctly
- [ ] GitHub Actions pipeline passes
- [ ] Auto-deployment working on code changes

## Optional
- [ ] Production database seeded with sample data
- [ ] Custom domain configured
- [ ] SSL certificate working
- [ ] Branch protection rules enabled
- [ ] Status badges added to README
- [ ] Monitoring and alerting configured

---

## 🆘 Troubleshooting

**Build Failures**: Check Render logs, verify package.json dependencies
**Database Issues**: Verify Atlas connection string and network access
**CORS Errors**: Check FRONTEND_URL environment variable
**API Not Found**: Verify VITE_API_URL environment variable
**Pipeline Failures**: Check GitHub Actions logs, verify workflow syntax
**Auto-Deploy Issues**: Ensure GitHub-Render connection is active

## 📞 Support

- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- GitHub Actions Documentation: https://docs.github.com/en/actions
- CI/CD Guide: See `CICD.md` in this repository
- Project Issues: Check GitHub repository issues
