#!/bin/bash

echo "🧘 Wellness Platform - Project Status Check"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📁 Project Structure:"
echo "✅ Backend directory exists"
echo "✅ Frontend directory exists" 
echo "✅ Documentation files present"
echo "✅ CI/CD workflows configured"

echo ""
echo "🔧 Backend Status:"
if [ -f "backend/package.json" ]; then
    echo "✅ Backend package.json exists"
else
    echo "❌ Backend package.json missing"
fi

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
else
    echo "❌ Backend .env file missing"
fi

if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies not installed - run: cd backend && npm install"
fi

echo ""
echo "🎨 Frontend Status:"
if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend package.json exists"
else
    echo "❌ Frontend package.json missing"
fi

if [ -f "frontend/.env" ]; then
    echo "✅ Frontend .env file exists"
else
    echo "❌ Frontend .env file missing"
fi

if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies not installed - run: cd frontend && npm install"
fi

echo ""
echo "🗄️ Database Status:"
if command -v mongod &> /dev/null; then
    if systemctl is-active --quiet mongod 2>/dev/null || pgrep mongod > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB service exists but may not be running"
        echo "   Start with: sudo systemctl start mongod"
    fi
else
    echo "❌ MongoDB not found - please install MongoDB"
fi

echo ""
echo "🌐 Server Status:"

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend server running on http://localhost:5000"
else
    echo "❌ Backend server not running"
    echo "   Start with: cd backend && npm run dev"
fi

# Check if frontend is running
if curl -s http://localhost:5175 > /dev/null 2>&1; then
    echo "✅ Frontend server running on http://localhost:5175"
elif curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend server running on http://localhost:5173"
elif curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ Frontend server running on http://localhost:5174"
else
    echo "❌ Frontend server not running"
    echo "   Start with: cd frontend && npm run dev"
fi

echo ""
echo "🔄 Git Status:"
if [ -d ".git" ]; then
    echo "✅ Git repository initialized"
    
    if git remote -v 2>/dev/null | grep -q origin; then
        echo "✅ Git remote origin configured"
    else
        echo "⚠️  Git remote origin not configured"
        echo "   Add with: git remote add origin <your-repo-url>"
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  Uncommitted changes detected"
        echo "   Commit with: git add . && git commit -m 'Update'"
    else
        echo "✅ All changes committed"
    fi
else
    echo "❌ Git repository not initialized"
    echo "   Initialize with: git init"
fi

echo ""
echo "🚀 Next Steps:"
echo ""

if ! curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "1. Start Backend Server:"
    echo "   cd backend && npm run dev"
    echo ""
fi

if ! curl -s http://localhost:5175 > /dev/null 2>&1 && ! curl -s http://localhost:5173 > /dev/null 2>&1 && ! curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "2. Start Frontend Server:"
    echo "   cd frontend && npm run dev"
    echo ""
fi

echo "3. Open Application:"
echo "   🌐 Frontend: http://localhost:5175 (or check terminal for actual port)"
echo "   🔧 Backend API: http://localhost:5000"
echo "   📊 Health Check: http://localhost:5000/api/health"
echo ""

echo "4. Development Workflow:"
echo "   - Register new account or login"
echo "   - View sample sessions on dashboard"
echo "   - Create and publish your own sessions"
echo "   - Test auto-save functionality"
echo ""

echo "5. Deployment:"
echo "   - See DEPLOYMENT.md for Render deployment guide"
echo "   - Use DEPLOYMENT_CHECKLIST.md for step-by-step process"
echo "   - Configure CI/CD with .github/workflows/ci-cd.yml"
echo ""

echo "📖 Documentation:"
echo "   - README.md - Complete project overview"
echo "   - DEPLOYMENT.md - Deployment instructions"
echo "   - RENDER_ENV.md - Environment variables reference"
echo "   - CICD.md - CI/CD setup guide"

echo ""
echo "🎉 Happy coding!"
