const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('express-cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const logger = require('../utils/logger');
const User = require('../database/models/User');
const BotStats = require('../database/models/BotStats');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
mongoose.connect(config.database.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Authentication Middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.admin.secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

/**
 * Login Endpoint
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== config.admin.username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, await bcrypt.hash(config.admin.password, 10));

    const token = jwt.sign(
      { username: config.admin.username, role: 'admin' },
      config.admin.secretKey,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Get Bot Statistics
 */
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const stats = await BotStats.findOne().sort({ date: -1 });

    res.json({
      totalUsers,
      latestStats: stats,
    });
  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * Get All Users
 */
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error('Users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * Get User Details
 */
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('User details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

/**
 * Update Bot Stock
 */
app.post('/api/admin/stock', authenticateToken, async (req, res) => {
  try {
    const { newStock } = req.body;

    if (typeof newStock !== 'number') {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    // Update stock in your storage (this is example)
    logger.info(`Stock updated to: ${newStock}`);

    res.json({ success: true, newStock });
  } catch (error) {
    logger.error('Stock update error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
const PORT = config.admin.port || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Admin Panel API running on port ${PORT}`);
});
