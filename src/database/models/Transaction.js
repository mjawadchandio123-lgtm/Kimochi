const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  discordId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER'],
    required: true,
  },
  cryptocurrency: {
    type: String,
    required: true,
  },
  cryptoAmount: {
    type: Number,
    required: true,
  },
  keysAmount: {
    type: Number,
    default: 0,
  },
  usdValue: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
  },
  txHash: String,
  fromAddress: String,
  toAddress: String,
  network: String,
  notes: String,
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW',
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  completedAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);
