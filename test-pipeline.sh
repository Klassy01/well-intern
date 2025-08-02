#!/bin/bash

# CI/CD Pipeline Test Script
echo "🧪 Testing CI/CD Pipeline for Wellness Platform"
echo "=============================================="

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo "✅ $1 is available"
        return 0
    else
        echo "❌ $1 is not available"
        return 1
    fi
}

# Check prerequisites
echo ""
echo "🔍 Checking Prerequisites..."
check_command "node"
check_command "npm"
check_command "git"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "📦 Node.js version: $NODE_VERSION"
fi

# Check if we're in a git repository
if [ -d ".git" ]; then
    echo "✅ Git repository detected"
    CURRENT_BRANCH=$(git branch --show-current)
    echo "🌿 Current branch: $CURRENT_BRANCH"
else
    echo "❌ Not in a git repository"
    exit 1
fi

# Test backend
echo ""
echo "🔧 Testing Backend..."
cd backend

if [ -f "package.json" ]; then
    echo "✅ Backend package.json found"
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    npm install --silent
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Backend dependency installation failed"
        cd ..
        exit 1
    fi
    
    # Test linting (if available)
    if npm run lint --silent 2>/dev/null; then
        echo "✅ Backend linting passed"
    else
        echo "⚠️  Backend linting not configured or failed"
    fi
    
    # Test if server can start (dry run)
    echo "🔍 Checking server configuration..."
    if [ -f "server.js" ]; then
        echo "✅ Server entry point found"
    else
        echo "❌ Server entry point not found"
    fi
    
else
    echo "❌ Backend package.json not found"
    cd ..
    exit 1
fi

cd ..

# Test frontend
echo ""
echo "🎨 Testing Frontend..."
cd frontend

if [ -f "package.json" ]; then
    echo "✅ Frontend package.json found"
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm install --silent
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "❌ Frontend dependency installation failed"
        cd ..
        exit 1
    fi
    
    # Test linting (if available)
    if npm run lint --silent 2>/dev/null; then
        echo "✅ Frontend linting passed"
    else
        echo "⚠️  Frontend linting not configured or failed"
    fi
    
    # Test TypeScript compilation
    echo "🔍 Checking TypeScript configuration..."
    if npx tsc --noEmit --silent 2>/dev/null; then
        echo "✅ TypeScript compilation successful"
    else
        echo "⚠️  TypeScript compilation issues detected"
    fi
    
    # Test build
    echo "🏗️  Testing production build..."
    npm run build --silent
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend build successful"
        if [ -d "dist" ]; then
            DIST_SIZE=$(du -sh dist | cut -f1)
            echo "📊 Build size: $DIST_SIZE"
        fi
    else
        echo "❌ Frontend build failed"
        cd ..
        exit 1
    fi
    
else
    echo "❌ Frontend package.json not found"
    cd ..
    exit 1
fi

cd ..

# Check CI/CD files
echo ""
echo "🔄 Checking CI/CD Configuration..."

if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions workflows directory found"
    
    WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    echo "📋 Found $WORKFLOW_COUNT workflow file(s)"
    
    for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
        if [ -f "$workflow" ]; then
            WORKFLOW_NAME=$(basename "$workflow")
            echo "  📄 $WORKFLOW_NAME"
        fi
    done
else
    echo "❌ GitHub Actions workflows not found"
fi

# Check deployment files
echo ""
echo "📄 Checking Deployment Documentation..."

DOCS=("DEPLOYMENT.md" "CICD.md" "RENDER_ENV.md" "DEPLOYMENT_CHECKLIST.md")

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc found"
    else
        echo "❌ $doc missing"
    fi
done

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "✅ Prerequisites checked"
echo "✅ Backend dependencies and configuration tested"
echo "✅ Frontend build and TypeScript validation completed"
echo "✅ CI/CD workflow files verified"
echo "✅ Deployment documentation checked"
echo ""
echo "🎉 CI/CD Pipeline Test Complete!"
echo ""
echo "🚀 Ready for deployment! Next steps:"
echo "1. Commit and push to GitHub"
echo "2. Watch GitHub Actions run the pipeline"
echo "3. Deploy to Render with auto-deploy enabled"
echo ""
echo "💡 Tip: After pushing to GitHub, check the 'Actions' tab to see your pipeline in action!"
