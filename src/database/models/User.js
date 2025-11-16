const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  steamId: {
    type: String,
    unique: true,
    sparse: true,
  },
  steamTradeLink: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  username: String,
  profilePicture: String,
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'zh', 'sr', 'de'],
  },
  wallets: [{
    cryptocurrency: String,
    address: String,
    balance: {
      type: Number,
      default: 0,
    },
    locked: {
      type: Number,
      default: 0,
    },
  }],
  tf2KeyBalance: {
    type: Number,
    default: 0,
  },
  riskScore: {
    type: Number,
    default: 0, // 0-100, used for scam detection
  },
  riskFlags: [{
    type: String,
    reason: String,
    timestamp: Date,
  }],
  preferences: {
    receiveAnnouncements: {
      type: Boolean,
      default: true,
    },
    stockAlertEnabled: {
      type: Boolean,
      default: false,
    },
    stockAlertThreshold: {
      type: Number,
      default: 100,
    },
    spaceAlertEnabled: {
      type: Boolean,
      default: false,
    },
    spaceAlertThreshold: {
      type: Number,
      default: 50,
    },
  },
  stats: {
    totalBuys: {
      type: Number,
      default: 0,
    },
    totalSells: {
      type: Number,
      default: 0,
    },
    totalKeysPurchased: {
      type: Number,
      default: 0,
    },
    totalKeysSold: {
      type: Number,
      default: 0,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    averageTradeValue: {
      type: Number,
      default: 0,
    },
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lastLogin: Date,
  lockedUntil: Date, // Account lock for security
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
