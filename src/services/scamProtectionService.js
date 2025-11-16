const User = require('../database/models/User');
const config = require('../../config/config');

class ScamProtectionService {
  /**
   * Calculate risk score for a user
   */
  async calculateRiskScore(userId, metadata = {}) {
    let riskScore = 0;
    const flags = [];

    try {
      const user = await User.findById(userId);
      if (!user) return { score: 0, flags: [] };

      // Check account age
      const accountAgeInDays = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
      if (accountAgeInDays < 1) {
        riskScore += 25;
        flags.push({ flag: 'NEW_ACCOUNT', reason: 'Account created less than 1 day ago' });
      } else if (accountAgeInDays < 7) {
        riskScore += 15;
        flags.push({ flag: 'YOUNG_ACCOUNT', reason: 'Account less than 7 days old' });
      }

      // Check verification status
      if (!user.emailVerified) {
        riskScore += 10;
        flags.push({ flag: 'UNVERIFIED_EMAIL', reason: 'Email not verified' });
      }

      if (!user.steamTradeLink) {
        riskScore += 15;
        flags.push({ flag: 'NO_STEAM_LINK', reason: 'Steam trade link not set' });
      }

      // Check trading history
      if (user.stats.totalBuys === 0 && user.stats.totalSells === 0) {
        riskScore += 10;
        flags.push({ flag: 'NO_HISTORY', reason: 'No trading history' });
      }

      // Check for multiple failed transactions
      if (metadata.failedTransactions > 2) {
        riskScore += 20;
        flags.push({ flag: 'MULTIPLE_FAILED_TX', reason: 'Multiple failed transactions' });
      }

      // Check unusual trading patterns
      if (metadata.largeTransaction && user.stats.totalVolume < metadata.largeTransaction) {
        riskScore += 15;
        flags.push({ flag: 'UNUSUALLY_LARGE_TX', reason: 'Transaction larger than history' });
      }

      // Check for rapid successive transactions
      if (metadata.rapidTransactions > 5) {
        riskScore += 15;
        flags.push({ flag: 'RAPID_TRANSACTIONS', reason: 'More than 5 transactions in short time' });
      }

      // Normalize score to 0-100
      riskScore = Math.min(riskScore, 100);

      return { score: riskScore, flags };
    } catch (error) {
      console.error('Error calculating risk score:', error);
      return { score: 0, flags: [] };
    }
  }

  /**
   * Check if user should be allowed to trade
   */
  async shouldAllowTrade(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        return false;
      }

      // Check risk score
      const { score } = await this.calculateRiskScore(userId);
      if (score > 80) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking trade eligibility:', error);
      return false;
    }
  }

  /**
   * Validate Steam Trade URL format
   */
  isValidSteamTradeUrl(url) {
    const steamTradeUrlRegex = /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9\-_]+$/;
    return steamTradeUrlRegex.test(url);
  }

  /**
   * Validate crypto address format
   */
  isValidCryptoAddress(address, cryptocurrency) {
    const patterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^0x[a-fA-F0-9]{40}$/,
      USDC: /^0x[a-fA-F0-9]{40}$/,
      BNB: /^0x[a-fA-F0-9]{40}$/,
      DOGE: /^[DAN][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    };

    const pattern = patterns[cryptocurrency.toUpperCase()];
    if (!pattern) return false;

    return pattern.test(address);
  }

  /**
   * Flag suspicious activity
   */
  async flagUser(userId, reason) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      user.riskFlags.push({
        type: 'MANUAL_FLAG',
        reason,
        timestamp: new Date(),
      });

      const { score, flags } = await this.calculateRiskScore(userId);

      // Lock account if high risk
      if (score > 85) {
        user.lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 24 hours
      }

      await user.save();
      return true;
    } catch (error) {
      console.error('Error flagging user:', error);
      return false;
    }
  }

  /**
   * Perform KYC-like checks
   */
  async performSecurityCheck(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return { passed: false, reason: 'User not found' };

      // Check minimum requirements
      if (!user.emailVerified) {
        return { passed: false, reason: 'Email must be verified' };
      }

      if (!user.steamTradeLink) {
        return { passed: false, reason: 'Steam trade link must be set' };
      }

      const accountAgeInDays = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
      if (accountAgeInDays < 0.5) {
        return { passed: false, reason: 'Account must be at least 12 hours old' };
      }

      const { score } = await this.calculateRiskScore(userId);
      if (score > 80) {
        return { passed: false, reason: 'High risk score - contact support' };
      }

      return { passed: true };
    } catch (error) {
      console.error('Error performing security check:', error);
      return { passed: false, reason: 'Security check failed' };
    }
  }
}

module.exports = new ScamProtectionService();
