# TF2 Crypto Trading Bot 🤖

A comprehensive Discord bot for buying and selling Team Fortress 2 keys using various cryptocurrencies. Features a full admin panel, multi-language support, and advanced security measures.

## 🌟 Features

### Trading Features
- **Buy/Sell TF2 Keys**: Trade Mann Co. Supply Crate Keys for 400+ cryptocurrencies
- **Multi-Cryptocurrency Support**: BTC, ETH, USDT, USDC, BNB, and more
- **Instant Transactions**: Real-time Binance integration for accurate pricing
- **Wallet Management**: Built-in cryptocurrency wallets for users
- **Trade History**: Complete transaction logging and statistics

### Security Features
- 🛡️ **Scam Protection**: Risk scoring system for fraud detection
- ✅ **Email Verification**: Verify user accounts for safety
- 🔐 **Steam Trade Link Validation**: Ensure legitimate Steam accounts
- 📋 **KYC Checks**: Account age verification and security checks
- 🚫 **Rate Limiting**: Prevent abuse with cooldowns
- 🔒 **Account Locking**: Automatic lockdown for suspicious activity

### Admin Panel
- 📊 **Real-time Analytics**: 20+ customizable charts and statistics
- 👥 **User Management**: View, manage, and monitor all users
- 💰 **Stock Management**: Monitor and update TF2 key inventory
- 📈 **Revenue Tracking**: Monitor profits and transaction volumes
- 🌍 **Global Statistics**: Multi-language support statistics

### Internationalization
- 🇬🇧 **English**
- 🇪🇸 **Spanish** (Español)
- 🇨🇳 **Chinese** (中文)
- 🇷🇸 **Serbian** (Српски)
- 🇩🇪 **German** (Deutsch)

## 📋 Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Discord Bot Token
- Binance API Keys
- Steam API Key

## 🚀 Installation

### 1. Clone and Setup

```bash
cd /workspaces/Kimochi
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Discord Bot
DISCORD_TOKEN=your_token_here
BOT_PREFIX=!

# Steam API
STEAM_API_KEY=your_steam_api_key
STEAM_SHARED_SECRET=your_shared_secret
STEAM_IDENTITY_SECRET=your_identity_secret
STEAM_ACCOUNT_NAME=your_account
STEAM_PASSWORD=your_password

# Database
MONGODB_URI=mongodb://localhost:27017/tf2-bot

# Binance API
BINANCE_API_KEY=your_binance_key
BINANCE_API_SECRET=your_binance_secret
BINANCE_TESTNET=false

# Admin Panel
ADMIN_PORT=3000
ADMIN_SECRET_KEY=your_super_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. Run Bot

```bash
# Development
npm run dev

# Production
npm start
```

### 4. Run Admin Panel

```bash
# Development
npm run admin:dev

# Production
npm run admin
```

## 📖 Commands

### Account Setup
```
!tradelink <url>        - Set your Steam trade link
!lang <code>            - Change language (en, es, zh, sr, de)
```

### Information Commands
```
!how2buy                - How to purchase keys
!how2sell               - How to sell keys
!how2deposit            - How to deposit cryptocurrency
!how2withdraw           - How to withdraw funds
!help                   - Show all commands
```

### Trading Commands
```
!buy <amount> <crypto>        - Buy keys
!sell <amount> <crypto>       - Sell keys
!balance                      - Show your balance
!stats                        - Show your trading statistics
!prices <crypto>              - Show current prices
```

### Withdrawal & Deposits
```
!deposit                      - Get deposit address
!withdraw <amount> <crypto> <address> <network>  - Withdraw funds
```

### Alerts
```
!announcements on/off         - Toggle announcements
!stockalert on/off <amount>  - Set stock alert
```

## 🔧 Project Structure

```
src/
├── index.js                 - Main bot file
├── bot/
│   └── commandHandler.js   - Command system
├── commands/
│   ├── balance.js
│   ├── buy.js
│   ├── sell.js
│   ├── prices.js
│   └── ... (other commands)
├── database/
│   └── models/
│       ├── User.js
│       ├── Transaction.js
│       ├── BotStats.js
│       └── Withdrawal.js
├── services/
│   ├── binanceService.js   - Crypto operations
│   └── scamProtectionService.js - Security
├── admin/
│   └── server.js           - Admin API
├── utils/
│   └── logger.js
└── locales/
    ├── en.json
    ├── es.json
    ├── zh.json
    ├── sr.json
    └── de.json
```

## 📊 Database Schema

### User Model
- Discord ID, Steam ID, Email
- Language preferences
- Cryptocurrency wallets
- Trading statistics
- Risk score and security flags

### Transaction Model
- Transaction ID and type (BUY/SELL/WITHDRAW/DEPOSIT)
- Amount, crypto type, and fee
- Status tracking
- Risk assessment

### Bot Statistics
- Daily/monthly statistics
- Volume tracking
- Revenue analysis
- Platform-specific stats

## 🔐 Security Features

### Scam Protection
1. **Risk Scoring**: Analyzes account age, trading history, and patterns
2. **Email Verification**: Required for trading
3. **Steam Validation**: Trade link verification
4. **Transaction Monitoring**: Flags unusual patterns
5. **Address Validation**: Crypto address format checking

### Admin Security
- JWT authentication
- Token expiration (24h)
- Rate limiting on all endpoints
- Helmet security headers
- CORS protection

## 💰 Pricing & Fees

- **Withdrawal Fee**: 1.5% (configurable)
- **Trading Fee**: Built-in to buy/sell
- **Binance Integration**: Real-time pricing

## 📊 Admin Panel API

Base URL: `http://localhost:3000/api`

### Authentication
```
POST /auth/login
{
  "username": "admin",
  "password": "password"
}
```

### Endpoints
```
GET /stats                  - Bot statistics
GET /users                  - List all users
GET /users/:id             - User details
POST /admin/stock          - Update stock
GET /health                - Health check
```

## 🗂️ Configuration

Edit `config/config.js` to customize:
- Bot prefix
- Supported cryptocurrencies
- Trading limits
- Security settings
- Language support
- Logging levels

## 📝 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Errors only

## 🐛 Troubleshooting

### Bot not starting
- Check Discord token is correct
- Ensure MongoDB is running
- Verify Node.js version

### Transactions failing
- Check Binance API keys
- Verify user has sufficient balance
- Check security restrictions

### Admin panel not accessible
- Verify admin port is open
- Check JWT token validity
- Ensure MongoDB connection

## 📈 Future Enhancements

- [ ] Advanced chart analytics
- [ ] Automated withdrawals
- [ ] Multi-platform support (Telegram, etc.)
- [ ] Advanced ML fraud detection
- [ ] WebSocket real-time updates
- [ ] Proof of Reserve system
- [ ] Advanced reporting system

## 🤝 Support

For issues and support, contact the admin or check logs.

## 📄 License

MIT License - See LICENSE file

## ⚠️ Disclaimer

This bot handles real cryptocurrency transactions. Ensure proper testing, security audits, and compliance with local regulations before deploying to production.

---

**Made with ❤️ for the TF2 Community**