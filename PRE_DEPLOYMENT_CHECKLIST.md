# Pre-Deployment Checklist

Complete this checklist before deploying to production.

## Environment & Credentials

- [ ] Discord Bot token obtained from Discord Developer Portal
- [ ] Binance API key and secret obtained
- [ ] Steam API key obtained
- [ ] Steam account credentials secured (shared secret, identity secret)
- [ ] MongoDB connection string configured (Atlas or local)
- [ ] All `.env` variables filled in and tested
- [ ] Sensitive credentials NOT committed to Git
- [ ] `.env` file added to `.gitignore`

## Database Setup

- [ ] MongoDB user created with strong password
- [ ] Database name created: `tf2-bot`
- [ ] Database indexes created:
  ```
  users: { discordId: 1 }
  transactions: { userId: 1, createdAt: -1 }
  ```
- [ ] Backup strategy implemented
- [ ] Database authentication enabled
- [ ] MongoDB firewall rules configured
- [ ] Regular backup tests performed

## Bot Configuration

- [ ] All commands tested locally
- [ ] Command handler loads all commands without errors
- [ ] Bot prefix configured (default: `!`)
- [ ] All 5 languages configured and tested
- [ ] Supported cryptocurrencies list finalized
- [ ] Trading limits set (min/max withdrawal)
- [ ] Withdrawal fees configured (default: 1.5%)
- [ ] TF2 key stock initialized

## Security Configuration

- [ ] Scam protection enabled
- [ ] Email verification requirement enabled
- [ ] Admin password changed from default (admin123)
- [ ] Admin secret key randomized (ADMIN_SECRET_KEY)
- [ ] Max login attempts set (recommended: 3)
- [ ] Account lock duration configured (recommended: 24h)
- [ ] SSL/TLS certificates installed
- [ ] Helmet security headers enabled
- [ ] CORS properly configured
- [ ] Rate limiting configured
- [ ] Firewall rules set up

## Discord Integration

- [ ] Bot has required permissions in server:
  - [ ] Send Messages
  - [ ] Read Messages/View Channels
  - [ ] Embed Links
  - [ ] Attach Files
  - [ ] Read Message History
- [ ] Support server/channel created
- [ ] Admin log channel created
- [ ] Trade channels created
- [ ] Bot role properly configured
- [ ] Message intents enabled

## Binance Integration

- [ ] API credentials tested
- [ ] Testnet mode disabled for production
- [ ] API rate limits understood
- [ ] IP whitelist configured
- [ ] Withdrawal permissions enabled
- [ ] Price fetching tested with live data
- [ ] Network validation tested
- [ ] Fee calculation verified

## Testing

### Bot Commands
- [ ] `!tradelink` creates user account
- [ ] `!balance` displays correctly
- [ ] `!prices BTC` fetches live data
- [ ] `!buy 1 BTC` creates transaction (no actual purchase)
- [ ] `!sell 1 BTC` creates transaction
- [ ] `!stats` shows user statistics
- [ ] `!lang` changes language
- [ ] All help commands work
- [ ] Cooldowns function correctly

### Admin Panel
- [ ] Login works with credentials
- [ ] JWT token generation successful
- [ ] `/stats` endpoint returns data
- [ ] `/users` endpoint lists users
- [ ] `/users/:id` returns user details
- [ ] Stock update endpoint works
- [ ] Health check endpoint responds

### Security
- [ ] Risk score calculation works
- [ ] Email verification requirement enforced
- [ ] Steam trade link validation works
- [ ] Invalid addresses rejected
- [ ] Account locking triggers correctly
- [ ] Failed transaction handling works
- [ ] Fee calculations accurate

### Database
- [ ] All models save correctly
- [ ] Indexes working for performance
- [ ] Transactions recorded accurately
- [ ] User data persists
- [ ] Queries return expected results
- [ ] Database backups complete successfully

## Performance & Monitoring

- [ ] Response times < 1s for most queries
- [ ] Database queries optimized
- [ ] Logging configured (log level: info for production)
- [ ] PM2 configured for auto-restart
- [ ] Memory usage monitored
- [ ] CPU usage acceptable
- [ ] No memory leaks detected
- [ ] Error logging functional
- [ ] Alerts configured (optional)

## Documentation

- [ ] README.md updated with production info
- [ ] SETUP.md reviewed and accurate
- [ ] API_DOCUMENTATION.md complete
- [ ] DEPLOYMENT.md followed
- [ ] QUICKSTART.md tested
- [ ] Environment variables documented
- [ ] Support contacts listed
- [ ] Emergency procedures documented

## Deployment Steps

### Pre-Deployment
- [ ] All code committed to Git
- [ ] Last backup created
- [ ] Maintenance window scheduled
- [ ] Rollback plan prepared
- [ ] Team notified of deployment

### Deployment
- [ ] Production environment cloned
- [ ] Dependencies installed: `npm install --production`
- [ ] Environment variables set
- [ ] Database migrations run (if any)
- [ ] Bot started with PM2
- [ ] Admin API started
- [ ] Health checks pass
- [ ] Logs monitored for errors

### Post-Deployment
- [ ] All services running
- [ ] Bot responding to commands
- [ ] Admin panel accessible
- [ ] Database connected
- [ ] API endpoints responding
- [ ] Logs showing normal operation
- [ ] Performance metrics acceptable
- [ ] User notifications sent (if applicable)

## Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor bot status
- [ ] Verify admin panel access
- [ ] Check database performance

### Weekly
- [ ] Review trading statistics
- [ ] Check risk scores
- [ ] Monitor user growth
- [ ] Verify backups completed

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Dependency updates check
- [ ] Compliance review
- [ ] Backup restoration test

## Emergency Procedures

### Bot Crashes
- [ ] Check error logs
- [ ] Verify MongoDB connection
- [ ] Check API rate limits
- [ ] Restart bot: `pm2 restart tf2-bot`
- [ ] Check logs again
- [ ] Contact support if needed

### Database Issues
- [ ] Check MongoDB service status
- [ ] Verify connection string
- [ ] Check disk space
- [ ] Restore from backup if needed
- [ ] Notify users of service interruption

### Security Issues
- [ ] Immediately disable affected accounts
- [ ] Review audit logs
- [ ] Change compromised credentials
- [ ] Deploy security patch
- [ ] Notify affected users

## Rollback Plan

- [ ] Previous version backed up
- [ ] Rollback procedure documented
- [ ] Database backup for rollback ready
- [ ] Rollback time estimated (< 15 minutes)
- [ ] Communication plan for users

## Sign-Off

- [ ] Team lead reviewed deployment plan
- [ ] Security review completed
- [ ] Compliance review completed
- [ ] Performance testing passed
- [ ] Load testing passed (recommended)

## Post-Launch

- [ ] Monitor for first 24 hours continuously
- [ ] User feedback reviewed
- [ ] Performance metrics recorded
- [ ] Issue tracking started
- [ ] Documentation updated
- [ ] Team debriefing completed

## Additional Notes

```
Deployment Date: ________________
Deployed By: ________________
Version: ________________
Notes: ________________
```

---

**Status**: Ready for Production ✅
