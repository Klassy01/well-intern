# 🔄 CI/CD Pipeline Configuration

This project includes automated CI/CD pipelines using GitHub Actions for seamless deployment to Render.

## 🏗️ Pipeline Overview

### Workflows Included:

1. **`ci-cd.yml`** - Main full-stack pipeline
2. **`deploy-backend.yml`** - Backend-specific deployment  
3. **`deploy-frontend.yml`** - Frontend-specific deployment

## 🚀 Main CI/CD Pipeline (`ci-cd.yml`)

### Triggers:
- Push to `main` or `production` branches
- Pull requests to `main` branch

### Jobs:

#### 1. Backend Testing (`backend-test`)
- ✅ Install dependencies with `npm ci`
- ✅ Run ESLint (if configured)
- ✅ Run unit tests (if available)
- ✅ Security audit with `npm audit`

#### 2. Frontend Testing (`frontend-test`)
- ✅ Install dependencies with `npm ci`
- ✅ Run ESLint (if configured)
- ✅ TypeScript type checking
- ✅ Run unit tests (if available)
- ✅ Build production bundle
- ✅ Upload build artifacts

#### 3. Deploy (`deploy`)
- ✅ Only runs on `main` branch pushes
- ✅ Requires both test jobs to pass
- ✅ Triggers Render auto-deployment
- ✅ Notification of deployment status

#### 4. Health Check (`health-check`)
- ✅ Waits for deployment completion
- ✅ Can be extended with actual health checks

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Add CI/CD pipeline"
git branch -M main
git remote add origin https://github.com/yourusername/wellness-platform.git
git push -u origin main
```

### 2. Render Auto-Deploy Setup

1. **Connect GitHub to Render**:
   - Go to Render dashboard
   - Create Web Service (backend) and Static Site (frontend)
   - Connect to your GitHub repository
   - Enable "Auto-Deploy" from GitHub

2. **Configure Auto-Deploy**:
   - **Backend**: Auto-deploy from `main` branch, `backend/` directory
   - **Frontend**: Auto-deploy from `main` branch, `frontend/` directory

### 3. Optional: GitHub Secrets (for advanced workflows)

If using the individual deployment workflows, add these secrets in GitHub:

```
Repository Settings → Secrets and variables → Actions
```

**Required Secrets**:
- `RENDER_API_KEY` - Your Render API key
- `RENDER_BACKEND_SERVICE_ID` - Backend service ID from Render
- `RENDER_FRONTEND_SERVICE_ID` - Frontend service ID from Render
- `VITE_API_URL` - Production API URL for frontend build

## 📋 Pipeline Features

### ✅ Quality Assurance
- **Linting**: Code style consistency
- **Type Checking**: TypeScript validation
- **Testing**: Unit test execution
- **Security**: Dependency vulnerability scanning
- **Build Verification**: Ensures production build succeeds

### 🚀 Deployment
- **Automatic**: Deploys on successful tests
- **Branch Protection**: Only deploys from `main` branch
- **Rollback**: Easy rollback through Render dashboard
- **Monitoring**: Deployment status notifications

### 🔄 Workflow Optimization
- **Parallel Jobs**: Backend and frontend test in parallel
- **Caching**: npm dependencies cached for faster builds
- **Artifacts**: Build outputs saved for debugging
- **Conditional**: Deploy only when tests pass

## 📊 Pipeline Status

### Branch Protection Rules (Recommended)

Add these rules in GitHub repository settings:

```
Settings → Branches → Add rule for main branch:
```

- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require review from code owners
- ✅ Restrict pushes that create files larger than 100MB

### Status Badges

Add to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/yourusername/wellness-platform/workflows/Full%20Stack%20CI/CD%20Pipeline/badge.svg)
![Backend Deploy](https://github.com/yourusername/wellness-platform/workflows/Deploy%20Backend%20to%20Render/badge.svg)
![Frontend Deploy](https://github.com/yourusername/wellness-platform/workflows/Deploy%20Frontend%20to%20Render/badge.svg)
```

## 🛠️ Customization

### Adding Tests

**Backend Tests** (`backend/package.json`):
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Frontend Tests** (`frontend/package.json`):
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Adding Linting

**Backend ESLint** (`backend/.eslintrc.js`):
```javascript
module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 12, sourceType: 'module' },
  rules: {}
};
```

**Frontend ESLint** (`frontend/.eslintrc.cjs`):
```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {}
};
```

### Environment-Specific Deployments

**Staging Environment**:
```yaml
# Add to ci-cd.yml
staging-deploy:
  if: github.ref == 'refs/heads/staging'
  # Deploy to staging environment
```

**Production Environment**:
```yaml
# Add to ci-cd.yml  
production-deploy:
  if: github.ref == 'refs/heads/production'
  # Deploy to production environment
```

## 🔍 Monitoring and Debugging

### Pipeline Logs
- View in GitHub Actions tab
- Check individual job logs
- Download artifacts for debugging

### Render Deployment Logs
- Monitor in Render dashboard
- Check service logs for errors
- Review deployment history

### Common Issues

1. **Build Failures**:
   - Check dependency versions
   - Verify package-lock.json is committed
   - Review build command syntax

2. **Test Failures**:
   - Ensure test files are included
   - Check test environment setup
   - Verify test dependencies

3. **Deployment Issues**:
   - Check Render service configuration
   - Verify environment variables
   - Review auto-deploy settings

## 📈 Performance Monitoring

### Metrics to Track
- ⏱️ Build time
- ⏱️ Test execution time
- ⏱️ Deployment duration
- 🏥 Application health
- 📊 Success rate

### Optimization Tips
- Use dependency caching
- Parallelize independent jobs
- Optimize Docker layers (if using containers)
- Implement smart triggering (path-based)

---

## 🎯 Next Steps

1. **Setup Complete**: Follow setup instructions above
2. **Test Pipeline**: Make a small change and push to main
3. **Monitor**: Watch the pipeline execute in GitHub Actions
4. **Customize**: Add tests, linting, and additional checks
5. **Scale**: Add staging environments and more sophisticated deployments

Your CI/CD pipeline will ensure consistent, reliable deployments every time you push code! 🚀
