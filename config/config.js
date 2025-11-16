// Configuration management
module.exports = {
  bot: {
    prefix: process.env.BOT_PREFIX || '!',
    token: process.env.DISCORD_TOKEN,
  },
  steam: {
    apiKey: process.env.STEAM_API_KEY,
    sharedSecret: process.env.STEAM_SHARED_SECRET,
    identitySecret: process.env.STEAM_IDENTITY_SECRET,
    accountName: process.env.STEAM_ACCOUNT_NAME,
    password: process.env.STEAM_PASSWORD,
  },
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tf2-bot',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
  binance: {
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET,
    testnet: process.env.BINANCE_TESTNET === 'true',
  },
  admin: {
    port: process.env.ADMIN_PORT || 3000,
    secretKey: process.env.ADMIN_SECRET_KEY,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  trading: {
    supportedCryptos: (process.env.SUPPORTED_CRYPTOCURRENCIES || 'BTC,ETH,USDT,USDC').split(','),
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
    tf2KeyStock: parseInt(process.env.TF2_KEY_STOCK) || 1000,
    minWithdrawal: parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT) || 10,
    maxWithdrawal: parseFloat(process.env.MAX_WITHDRAWAL_AMOUNT) || 10000,
    withdrawalFeePercent: parseFloat(process.env.WITHDRAWAL_FEE_PERCENT) || 1.5,
  },
  security: {
    enableScamProtection: process.env.ENABLE_SCAM_PROTECTION !== 'false',
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  },
  languages: {
    supported: (process.env.SUPPORTED_LANGUAGES || 'en,es,zh,sr,de').split(','),
    default: 'en',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    path: process.env.LOG_PATH || './logs',
  },
};
