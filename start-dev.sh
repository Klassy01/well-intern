#!/bin/bash

echo "🚀 Starting Wellness Platform Development Environment..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
if check_port 5000; then
    echo "   Killing process on port 5000..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
fi

if check_port 5173; then
    echo "   Killing process on port 5173..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

# Wait a moment for ports to be freed
sleep 2

echo "🗄️  Starting Backend (PostgreSQL)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

echo "🌐 Starting Frontend (React + Vite)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo ""
echo "📋 Services:"
echo "   🖥️  Backend:  http://localhost:5000"
echo "   🌐 Frontend: http://localhost:5173"
echo "   📊 Health:   http://localhost:5000/api/health"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Keep script running
wait
