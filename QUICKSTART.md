# Quick Start Guide

Get the TF2 Crypto Trading Bot up and running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- MongoDB (local or Atlas)
- Discord Bot Token
- Binance API Keys (optional for testnet)

## 1️⃣ Setup (2 minutes)

```bash
# Clone/Navigate to project
cd /workspaces/Kimochi

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## 2️⃣ Configure `.env` (2 minutes)

Edit `.env` and add your tokens:

```env
# Minimum required for testing
DISCORD_TOKEN=your_discord_token_here
MONGODB_URI=mongodb://localhost:27017/tf2-bot
BINANCE_TESTNET=true
```

Get tokens from:
- Discord: https://discord.com/developers/applications
- Binance: https://www.binance.com/en/account/api-management

## 3️⃣ Start Bot (1 minute)

```bash
# Terminal 1: Start bot
npm run dev

# You should see:
# ✓ Loaded command: balance
# ✓ Loaded command: buy
# ... (more commands)
# 🤖 Bot logged in as YourBotName#0000
# ✅ Connected to MongoDB
```

## 4️⃣ Test It Out

In your Discord server, try:

```
!balance      # Shows your balance
!prices BTC   # Shows current prices
!how2buy      # Shows how to buy keys
!tradelink <your_steam_trade_url>  # Set your trade link
```

## Admin Panel (Optional)

```bash
# Terminal 2: Start admin API
npm run admin:dev

# Visit: http://localhost:3000
# Login: admin / admin123
```

## Troubleshooting

### Bot not showing up in Discord?
1. Get OAuth2 URL from Developer Portal
2. Invite bot to your server
3. Ensure bot has message permissions

### Commands not working?
1. Use correct prefix: `!`
2. Make sure bot has message permissions
3. Check logs with: `tail -f logs/combined.log`

### MongoDB error?
1. Install MongoDB: `sudo apt install mongodb`
2. Start service: `sudo systemctl start mongodb`
3. Or use MongoDB Atlas (cloud)

## Next Steps

- Read [README.md](./README.md) for full features
- Follow [SETUP.md](./SETUP.md) for detailed configuration
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for architecture

## Key Commands

```
!balance           - Your wallet balance
!buy <amt> <coin>  - Buy TF2 keys
!sell <amt> <coin> - Sell TF2 keys
!stats             - Your trading stats
!prices <coin>     - Crypto prices
!tradelink <url>   - Set Steam account
!lang <code>       - Change language
```

## Important Files

| File | Purpose |
|------|---------|
| `.env` | Your configuration (API keys, tokens) |
| `src/index.js` | Main bot file |
| `src/commands/` | All bot commands |
| `config/config.js` | Centralized config |
| `logs/` | Bot logs |

## Support

1. Check [README.md](./README.md) for documentation
2. Review logs: `logs/error.log`
3. Test on Binance testnet first
4. Verify all .env variables are set

---

**Enjoy your TF2 Trading Bot! 🚀**
