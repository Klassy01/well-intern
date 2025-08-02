const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware - Allow all origins for testing
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockUsers = new Map();
const mockSessions = new Map();
let userIdCounter = 1;
let sessionIdCounter = 1;

// Helper function to generate JWT-like token
const generateToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

// Mock routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Wellness Platform API is running (Test Mode)',
    timestamp: new Date().toISOString(),
    database: 'Mock Database'
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    for (let user of mockUsers.values()) {
      if (user.email === email) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
    }

    // Create user
    const userId = userIdCounter++;
    const user = {
      id: userId,
      email,
      password: 'hashed-' + password, // Mock hashing
      createdAt: new Date().toISOString()
    };
    
    mockUsers.set(userId, user);
    const token = generateToken(userId);

    console.log(`✅ User registered: ${email}`);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    let foundUser = null;
    for (let user of mockUsers.values()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (mock check)
    if (foundUser.password !== 'hashed-' + password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(foundUser.id);

    console.log(`✅ User logged in: ${email}`);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        createdAt: foundUser.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Sessions routes
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = Array.from(mockSessions.values());
    console.log(`✅ Sessions fetched: ${sessions.length} sessions`);
    
    res.json({
      success: true,
      sessions,
      total: sessions.length
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    });
  }
});

app.post('/api/sessions', (req, res) => {
  try {
    const { title, description, tags, jsonFileUrl } = req.body;
    
    if (!title || !jsonFileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and JSON file URL are required'
      });
    }

    const sessionId = sessionIdCounter++;
    const session = {
      id: sessionId,
      title,
      description: description || '',
      tags: tags || [],
      jsonFileUrl,
      status: 'draft',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSessions.set(sessionId, session);

    console.log(`✅ Session created: ${title}`);
    
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: Mock Database`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test Mode: Frontend integration testing enabled`);
});
