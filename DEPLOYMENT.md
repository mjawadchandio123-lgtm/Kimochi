# Deployment Guide

## Production Deployment

This guide covers deploying the TF2 Crypto Trading Bot to production.

## Prerequisites

- Ubuntu 20.04 LTS or similar
- Docker & Docker Compose (recommended)
- MongoDB Atlas account or self-hosted MongoDB
- PM2 for process management
- Nginx for reverse proxy

## Option 1: Docker Deployment (Recommended)

### 1. Create Docker Compose File

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    container_name: tf2-bot-mongo
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_PASSWORD}
    ports:
      - "27017:27017"
    restart: unless-stopped

  bot:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: tf2-bot
    environment:
      NODE_ENV: production
      DISCORD_TOKEN: ${DISCORD_TOKEN}
      MONGODB_URI: mongodb://admin:${MONGODB_PASSWORD}@mongodb:27017/tf2-bot
      STEAM_API_KEY: ${STEAM_API_KEY}
      BINANCE_API_KEY: ${BINANCE_API_KEY}
      BINANCE_API_SECRET: ${BINANCE_API_SECRET}
    depends_on:
      - mongodb
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

  admin-api:
    build:
      context: .
      dockerfile: Dockerfile.admin
    container_name: tf2-admin-api
    environment:
      NODE_ENV: production
      ADMIN_PORT: 3000
      MONGODB_URI: mongodb://admin:${MONGODB_PASSWORD}@mongodb:27017/tf2-bot
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    restart: unless-stopped

volumes:
  mongodb_data:
```

### 2. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["npm", "start"]
```

### 3. Deploy

```bash
docker-compose up -d
```

## Option 2: Traditional Server Deployment

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb-org

# Install PM2
sudo npm install -g pm2
```

### 2. Setup Application

```bash
# Clone repository
git clone <your-repo> /home/tf2bot/app
cd /home/tf2bot/app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with production values
nano .env
```

### 3. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'tf2-bot',
      script: './src/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'tf2-admin-api',
      script: './src/admin/server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-admin-error.log',
      out_file: './logs/pm2-admin-out.log',
    },
  ],
};
```

### 4. Start Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx Configuration

Create `/etc/nginx/sites-available/tf2bot`:

```nginx
upstream tf2_admin {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api {
        proxy_pass http://tf2_admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/tf2bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate

Using Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## Monitoring

### PM2 Monitoring

```bash
# Web dashboard
pm2 web

# Real-time logs
pm2 logs

# Check status
pm2 status
```

### System Monitoring

```bash
# CPU and Memory
htop

# Disk usage
df -h

# MongoDB status
sudo systemctl status mongod
```

## Backup Strategy

### Automated MongoDB Backup

```bash
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mongodump --username admin --password $MONGODB_PASSWORD \
          --authenticationDatabase admin \
          --out $BACKUP_DIR/dump_$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -name "dump_*" -mtime +7 -exec rm -rf {} \;
```

Add to crontab:

```bash
0 2 * * * /home/tf2bot/backup.sh
```

## Environment Variables for Production

```env
NODE_ENV=production
LOG_LEVEL=info

# Discord
DISCORD_TOKEN=xxxxxxxxxxx
BOT_PREFIX=!

# Steam
STEAM_API_KEY=xxxxxxxxxxx
STEAM_SHARED_SECRET=xxxxxxxxxxx
STEAM_IDENTITY_SECRET=xxxxxxxxxxx

# Database
MONGODB_URI=mongodb://admin:password@db:27017/tf2-bot

# Binance
BINANCE_API_KEY=xxxxxxxxxxx
BINANCE_API_SECRET=xxxxxxxxxxx
BINANCE_TESTNET=false

# Admin Panel
ADMIN_PORT=3000
ADMIN_SECRET_KEY=xxxxxxxxxxx
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xxxxxxxxxxx

# Trading Settings
TF2_KEY_STOCK=1000
MIN_WITHDRAWAL_AMOUNT=10
MAX_WITHDRAWAL_AMOUNT=10000

# Security
ENABLE_SCAM_PROTECTION=true
MAX_LOGIN_ATTEMPTS=3
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Update Node.js
sudo apt update
sudo apt install nodejs
```

### Database Maintenance

```bash
# MongoDB optimization
mongo
> use tf2-bot
> db.users.createIndex({ discordId: 1 })
> db.transactions.createIndex({ userId: 1 })
> db.transactions.createIndex({ createdAt: -1 })
```

## Troubleshooting

### Bot crashes frequently

1. Check logs: `pm2 logs tf2-bot`
2. Increase memory: `pm2 update`
3. Check MongoDB connection
4. Review API rate limits

### High CPU usage

1. Check for memory leaks
2. Review database queries
3. Check Binance API calls
4. Reduce refresh rate

### MongoDB connection errors

1. Verify credentials
2. Check firewall rules
3. Test connection: `mongosh -u admin -p`
4. Check disk space

## Security Checklist

- [ ] Change default admin credentials
- [ ] Enable two-factor authentication
- [ ] Restrict API access by IP
- [ ] Use SSL/TLS certificates
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Backup sensitive data
- [ ] Monitor suspicious activity
- [ ] Enable audit logging
- [ ] Regular penetration testing

## Performance Optimization

1. **Database Indexing**: Index frequently queried fields
2. **Caching**: Cache price data locally
3. **Rate Limiting**: Implement request rate limiting
4. **Load Balancing**: Use multiple bot instances
5. **CDN**: Cache static files

## Scaling

For high traffic:

1. Deploy multiple bot instances
2. Use Redis for caching
3. Implement message queuing (RabbitMQ)
4. Use MongoDB replica sets
5. Implement load balancing

---

For additional support, check system logs and MongoDB diagnostics.
