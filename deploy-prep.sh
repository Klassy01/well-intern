#!/bin/bash

# Deployment preparation script for Render
echo "🚀 Preparing Wellness Platform for Render deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Wellness Platform with CI/CD ready for Render deployment"
    echo "✅ Git repository initialized"
    echo "🔗 Don't forget to:"
    echo "   1. Create a GitHub repository"
    echo "   2. Add remote: git remote add origin <your-github-repo-url>"
    echo "   3. Push: git push -u origin main"
else
    echo "📝 Adding changes to git..."
    git add .
    git commit -m "Update for Render deployment with CI/CD - $(date)"
    echo "✅ Changes committed"
fi

# Create .env.example for backend if it doesn't exist
if [ ! -f "backend/.env.example" ]; then
    echo "📄 Creating backend .env.example..."
    cat > backend/.env.example << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/wellness-platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ Backend .env.example created"
fi

# Create .env.example for frontend if needed
if [ ! -f "frontend/.env.example" ]; then
    echo "📄 Creating frontend .env.example..."
    cat > frontend/.env.example << EOF
# API Configuration
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Frontend .env.example created"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps for Render deployment with CI/CD:"
echo "1. Push your code to GitHub"
echo "2. Set up MongoDB Atlas (see DEPLOYMENT.md)"
echo "3. Deploy backend web service on Render with auto-deploy"
echo "4. Deploy frontend static site on Render with auto-deploy"
echo "5. Configure environment variables"
echo "6. Test the CI/CD pipeline by making a commit"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🔄 See CICD.md for CI/CD pipeline details"
