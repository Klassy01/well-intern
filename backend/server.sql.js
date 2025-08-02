const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.sql');
const sessionRoutes = require('./routes/sessions.sql');

// Load environment variables
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5175',
  'https://localhost:5173'
].filter(Boolean);

// During deployment, allow Render domains
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/\.onrender\.com$/);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to PostgreSQL
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Wellness Platform API is running (PostgreSQL)',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: PostgreSQL`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
