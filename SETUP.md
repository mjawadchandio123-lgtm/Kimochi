# Setup & Configuration Guide

## Discord Bot Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your bot (e.g., "TF2 Trading Bot")
4. Go to "Bot" section
5. Click "Add Bot"
6. Copy the token and add to `.env` as `DISCORD_TOKEN`

### 2. Configure Bot Permissions

In Developer Portal:
1. Go to OAuth2 > URL Generator
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages
   - Read Messages/View Channels
   - Embed Links
   - Attach Files
   - Read Message History

Generate URL and invite bot to your server.

### 3. Server Setup

Create these channels in your Discord server:
- `#trading` - For trading commands
- `#support` - For help and support
- `#announcements` - For bot announcements
- `#admin-logs` - For admin-only logs

## Steam API Setup

### 1. Get Steam API Key

1. Go to [Steam Community Web API](https://steamcommunity.com/dev/apikey)
2. Accept the terms
3. Generate API key
4. Copy to `.env` as `STEAM_API_KEY`

### 2. Steam Account Setup

For automated trading, you'll need:
1. A dedicated Steam account
2. Shared Secret (enable 2FA, get from app files)
3. Identity Secret (enable 2FA, get from app files)

Windows Path: `%localappdata%\Steam\userdata\[userid]\config`

Add to `.env`:
```
STEAM_SHARED_SECRET=xxxxx
STEAM_IDENTITY_SECRET=xxxxx
STEAM_ACCOUNT_NAME=botaccountname
STEAM_PASSWORD=botpassword
```

## Binance API Setup

### 1. Create Binance Account

1. Go to [Binance.com](https://www.binance.com)
2. Create account and verify identity
3. Enable 2FA for security

### 2. Generate API Keys

1. Go to Account > API Management
2. Create new key
3. Enable these permissions:
   - Read
   - Enable Restricted IP
   - Set your server IP

4. Copy API Key and Secret to `.env`

### 3. Testnet Setup (Recommended First)

1. Use [Binance Testnet](https://testnet.binance.vision)
2. Set `BINANCE_TESTNET=true` in `.env`
3. Test all transactions before production

## MongoDB Setup

### Option A: Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create admin user
mongo
> use admin
> db.createUser({ user: "admin", pwd: "password", roles: ["root"] })
> use tf2-bot
> exit

# Set connection string
MONGODB_URI=mongodb://admin:password@localhost:27017/tf2-bot
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create new cluster
4. Add IP to whitelist (0.0.0.0/0 for development)
5. Create database user
6. Get connection string
7. Add to `.env` as `MONGODB_URI`

## Environment Variables

Create `.env` file:

```bash
cp .env.example .env
nano .env
```

Fill in all required values:

```env
# Required Fields
DISCORD_TOKEN=your_discord_token
STEAM_API_KEY=your_steam_key
BINANCE_API_KEY=your_binance_key
BINANCE_API_SECRET=your_binance_secret
MONGODB_URI=your_mongo_uri
ADMIN_SECRET_KEY=your_secret_key

# Optional Fields (defaults provided)
BOT_PREFIX=!
BINANCE_TESTNET=true
LOG_LEVEL=debug
```

## Installation Steps

### 1. Install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18+
npm --version
```

### 2. Clone Repository

```bash
cd /path/to/project
git clone <repository-url> .
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
nano .env
```

### 5. Start Bot (Development)

```bash
npm run dev
```

Monitor the output for errors. Common issues:
- MongoDB connection failed: Check `MONGODB_URI`
- Invalid token: Check `DISCORD_TOKEN`
- API key error: Verify Binance credentials

### 6. Start Admin Panel

In another terminal:

```bash
npm run admin:dev
```

Access at `http://localhost:3000`

Default credentials:
- Username: admin
- Password: admin123

## First Run Checklist

- [ ] Bot starts without errors
- [ ] Bot connects to Discord
- [ ] Bot connects to MongoDB
- [ ] `/health` endpoint returns 200
- [ ] Can execute `!balance` command (creates test user)
- [ ] Admin panel login works
- [ ] Price fetching works (`!prices BTC`)

## Troubleshooting

### MongoDB Connection Fails

```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Check connection string
mongosh "mongodb://admin:password@localhost:27017/tf2-bot"

# Enable MongoDB authentication
sudo nano /etc/mongod.conf
# Set: security:
#        authorization: "enabled"
```

### Discord Bot Not Responding

```bash
# Check token is correct
# Verify bot has message permissions in server
# Check bot online status in Discord
# Review logs for errors
```

### Binance API Errors

```bash
# Verify API credentials
# Check IP is whitelisted
# Verify API key has correct permissions
# Test on testnet first
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Testing

### Test Trading Flow

1. Add funds to test wallet: `!deposit`
2. Check balance: `!balance`
3. Try buy: `!buy 1 BTC`
4. Check stats: `!stats`

### Test Admin Panel

1. Login at `http://localhost:3000`
2. View stats
3. Check users list
4. View user details

### Test API

```bash
# Get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/stats
```

## Configuration Customization

### Change Bot Prefix

Edit `.env`:
```env
BOT_PREFIX=.
```

### Change Supported Cryptocurrencies

Edit `.env`:
```env
SUPPORTED_CRYPTOCURRENCIES=BTC,ETH,USDT,BNB,SOL
```

### Adjust Trading Fees

Edit `config/config.js`:
```javascript
trading: {
  withdrawalFeePercent: 2.0,  // Change from 1.5 to 2.0
}
```

### Add More Languages

1. Create file: `src/locales/fr.json`
2. Add translations
3. Update `config/config.js`:
```javascript
languages: {
  supported: ['en', 'es', 'zh', 'sr', 'de', 'fr'],
}
```

## Security Configuration

### 1. Change Admin Password

```bash
nano .env
# Update ADMIN_PASSWORD
```

### 2. Enable Email Verification

```env
REQUIRE_EMAIL_VERIFICATION=true
```

### 3. Configure Scam Protection

```env
ENABLE_SCAM_PROTECTION=true
MAX_LOGIN_ATTEMPTS=3
```

### 4. Set Up Firewall

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

## Logging Configuration

### Adjust Log Level

```env
LOG_LEVEL=debug  # Options: error, warn, info, debug
```

### View Logs

```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log

# Follow logs with grep
tail -f logs/combined.log | grep "ERROR"
```

## Next Steps

1. ✅ Complete all setup steps above
2. 🧪 Test in development environment
3. 🔐 Enable security features
4. 📊 Configure admin panel users
5. 🚀 Deploy to production
6. 📈 Monitor performance and logs
7. 🔄 Set up regular backups

For support, check the README.md or contact the development team.
