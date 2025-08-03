#!/bin/bash

echo "🐘 Setting up local PostgreSQL for wellness platform..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Installing..."
    
    # Install PostgreSQL (Ubuntu/Debian)
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
    # Install PostgreSQL (macOS)
    elif command -v brew &> /dev/null; then
        brew install postgresql
        brew services start postgresql
    else
        echo "❌ Unsupported OS. Please install PostgreSQL manually."
        exit 1
    fi
fi

echo "✅ PostgreSQL found"

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
if command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
elif command -v brew &> /dev/null; then
    brew services start postgresql
fi

# Create database and user
echo "📊 Creating database and user..."
sudo -u postgres psql << EOF
-- Create user
CREATE USER wellness_admin WITH PASSWORD 'password';

-- Create database
CREATE DATABASE wellness_platform OWNER wellness_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wellness_platform TO wellness_admin;

-- Exit
\q
EOF

echo "✅ Database setup complete!"
echo ""
echo "📋 Database Details:"
echo "   Database: wellness_platform"
echo "   User: wellness_admin"
echo "   Password: password"
echo "   URL: postgresql://wellness_admin:password@localhost:5432/wellness_platform"
echo ""
echo "🚀 You can now run: npm run dev"
