const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  withdrawalId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cryptocurrency: String,
  amount: Number,
  fee: Number,
  netAmount: Number,
  address: String,
  network: String,
  txHash: String,
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'CONFIRMED', 'FAILED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
