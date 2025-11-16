const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/User');
const Transaction = require('../database/models/Transaction');
const binanceService = require('../services/binanceService');
const scamProtection = require('../services/scamProtectionService');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  name: 'buy',
  description: 'Buy TF2 keys with cryptocurrency',
  usage: '!buy <key_amount> <cryptocurrency>',
  cooldown: 10,

  async execute(message, args) {
    try {
      if (args.length < 2) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Invalid Usage')
          .setDescription('Usage: `!buy <amount> <cryptocurrency>`')
          .addFields({
            name: 'Example',
            value: '`!buy 5 BTC` - Buy 5 keys using Bitcoin',
          });
        return message.reply({ embeds: [embed] });
      }

      const keyAmount = parseInt(args[0]);
      const cryptocurrency = args[1].toUpperCase();

      if (isNaN(keyAmount) || keyAmount <= 0) {
        return message.reply('❌ Invalid key amount. Please specify a positive number.');
      }

      // Get or create user
      let user = await User.findOne({ discordId: message.author.id });
      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ No Account')
          .setDescription('Use `!tradelink` to create an account first.');
        return message.reply({ embeds: [embed] });
      }

      // Security check
      const securityCheck = await scamProtection.performSecurityCheck(user._id);
      if (!securityCheck.passed) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Security Check Failed')
          .setDescription(securityCheck.reason);
        return message.reply({ embeds: [embed] });
      }

      // Get cryptocurrency price
      const price = await binanceService.getPrice(cryptocurrency);
      const pricePerKey = price / 10; // TF2 key worth (adjustable)
      const totalCost = pricePerKey * keyAmount;

      // Check wallet balance
      const wallet = user.wallets.find(w => w.cryptocurrency === cryptocurrency);
      if (!wallet || (wallet.balance - wallet.locked) < totalCost) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Insufficient Balance')
          .setDescription(`You need ${totalCost.toFixed(8)} ${cryptocurrency} but only have ${wallet ? wallet.balance - wallet.locked : 0}.`)
          .addFields({
            name: 'Deposit More',
            value: 'Use `!deposit` to add more funds.',
          });
        return message.reply({ embeds: [embed] });
      }

      // Create transaction
      const transactionId = uuidv4();
      const transaction = new Transaction({
        transactionId,
        userId: user._id,
        discordId: message.author.id,
        type: 'BUY',
        cryptocurrency,
        cryptoAmount: totalCost,
        keysAmount: keyAmount,
        usdValue: price * totalCost,
        rate: pricePerKey,
        status: 'PENDING',
      });

      // Lock funds
      wallet.locked += totalCost;
      await Promise.all([transaction.save(), user.save()]);

      // Update stats
      user.stats.totalBuys += 1;
      user.stats.totalKeysPurchased += keyAmount;
      user.stats.totalVolume += price * totalCost;
      user.tf2KeyBalance += keyAmount;

      // Deduct from wallet
      wallet.balance -= totalCost;
      wallet.locked -= totalCost;

      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#51CF66')
        .setTitle('✅ Buy Order Created')
        .addFields(
          { name: 'Transaction ID', value: transactionId, inline: false },
          { name: 'Keys', value: `${keyAmount} keys`, inline: true },
          { name: 'Price per Key', value: `${pricePerKey.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'Total Cost', value: `${totalCost.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'Status', value: 'Pending', inline: true }
        )
        .setFooter({ text: 'Steam trade offer will be sent soon' });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in buy command:', error);
      message.reply('❌ An error occurred while processing your buy order.');
    }
  },
};
