const mongoose = require('mongoose');

const botStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  totalUsers: Number,
  totalVolume: Number,
  totalRevenue: Number,
  totalTransactions: Number,
  keysSold: Number,
  keysBought: Number,
  currentKeyStock: Number,
  avgTransactionValue: Number,
  platformStats: {
    discord: {
      activeUsers: Number,
      messages: Number,
    },
  },
  cryptoStats: [{
    cryptocurrency: String,
    volumeTraded: Number,
    transactionCount: Number,
  }],
});

module.exports = mongoose.model('BotStats', botStatsSchema);
