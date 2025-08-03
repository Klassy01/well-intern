#!/bin/bash

# Test Authentication Flow
echo "🧪 Testing Frontend/Backend Authentication Integration"
echo "================================================="

# Test 1: Backend Health Check
echo "1. Testing backend health..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Test 2: Frontend Proxy Health Check
echo "2. Testing frontend proxy..."
PROXY_RESPONSE=$(curl -s http://localhost:5173/api/health)
if [[ $PROXY_RESPONSE == *"OK"* ]]; then
    echo "✅ Frontend proxy check passed"
else
    echo "❌ Frontend proxy check failed"
    exit 1
fi

# Test 3: User Registration
echo "3. Testing user registration..."
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser${TIMESTAMP}@example.com"
REG_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"TestPass123\"}" \
  -w "HTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$REG_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
REG_BODY=$(echo "$REG_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

echo "Registration response: $REG_BODY"
echo "HTTP Status: $HTTP_STATUS"

if [[ $HTTP_STATUS == "201" ]]; then
    echo "✅ User registration passed"
    
    # Extract token for login test
    TOKEN=$(echo "$REG_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [[ -n $TOKEN ]]; then
        echo "✅ Token received successfully"
        
        # Test 4: Token verification
        echo "4. Testing token verification..."
        ME_RESPONSE=$(curl -s -X GET http://localhost:5000/api/auth/me \
          -H "Authorization: Bearer $TOKEN" \
          -w "HTTP_STATUS:%{http_code}")
        
        ME_HTTP_STATUS=$(echo "$ME_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
        ME_BODY=$(echo "$ME_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')
        
        echo "Me response: $ME_BODY"
        echo "HTTP Status: $ME_HTTP_STATUS"
        
        if [[ $ME_HTTP_STATUS == "200" ]]; then
            echo "✅ Token verification passed"
        else
            echo "❌ Token verification failed"
        fi
        
        # Test 5: Login with same credentials
        echo "5. Testing user login..."
        LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"TestPass123\"}" \
          -w "HTTP_STATUS:%{http_code}")
        
        LOGIN_HTTP_STATUS=$(echo "$LOGIN_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
        LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')
        
        echo "Login response: $LOGIN_BODY"
        echo "HTTP Status: $LOGIN_HTTP_STATUS"
        
        if [[ $LOGIN_HTTP_STATUS == "200" ]]; then
            echo "✅ User login passed"
        else
            echo "❌ User login failed"
        fi
        
    else
        echo "❌ No token received in registration response"
    fi
else
    echo "❌ User registration failed"
fi

echo ""
echo "🎯 Authentication Flow Test Complete"
echo "================================================="
