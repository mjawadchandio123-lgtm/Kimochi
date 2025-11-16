const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/User');
const Transaction = require('../database/models/Transaction');
const binanceService = require('../services/binanceService');
const scamProtection = require('../services/scamProtectionService');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  name: 'sell',
  description: 'Sell your TF2 keys for cryptocurrency',
  usage: '!sell <key_amount> <cryptocurrency>',
  cooldown: 10,

  async execute(message, args) {
    try {
      if (args.length < 2) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Invalid Usage')
          .setDescription('Usage: `!sell <amount> <cryptocurrency>`')
          .addFields({
            name: 'Example',
            value: '`!sell 3 ETH` - Sell 3 keys for Ethereum',
          });
        return message.reply({ embeds: [embed] });
      }

      const keyAmount = parseInt(args[0]);
      const cryptocurrency = args[1].toUpperCase();

      if (isNaN(keyAmount) || keyAmount <= 0) {
        return message.reply('❌ Invalid key amount. Please specify a positive number.');
      }

      // Get user
      const user = await User.findOne({ discordId: message.author.id });
      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ No Account')
          .setDescription('Use `!tradelink` to create an account first.');
        return message.reply({ embeds: [embed] });
      }

      // Check if user has enough keys
      if (user.tf2KeyBalance < keyAmount) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Insufficient Keys')
          .setDescription(`You have ${user.tf2KeyBalance} keys but are trying to sell ${keyAmount}.`);
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
      const pricePerKey = price / 10;
      const totalReceive = pricePerKey * keyAmount;

      // Fee calculation (1% for example)
      const feePercent = 0.01;
      const fee = totalReceive * feePercent;
      const netReceive = totalReceive - fee;

      // Create transaction
      const transactionId = uuidv4();
      const transaction = new Transaction({
        transactionId,
        userId: user._id,
        discordId: message.author.id,
        type: 'SELL',
        cryptocurrency,
        cryptoAmount: netReceive,
        keysAmount: keyAmount,
        usdValue: price * totalReceive,
        rate: pricePerKey,
        fee,
        status: 'PENDING',
      });

      // Update user
      user.tf2KeyBalance -= keyAmount;
      user.stats.totalSells += 1;
      user.stats.totalKeysSold += keyAmount;
      user.stats.totalVolume += price * totalReceive;

      // Add to wallet
      let wallet = user.wallets.find(w => w.cryptocurrency === cryptocurrency);
      if (!wallet) {
        user.wallets.push({
          cryptocurrency,
          address: '',
          balance: netReceive,
        });
      } else {
        wallet.balance += netReceive;
      }

      await Promise.all([transaction.save(), user.save()]);

      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('✅ Sell Order Created')
        .addFields(
          { name: 'Transaction ID', value: transactionId, inline: false },
          { name: 'Keys to Sell', value: `${keyAmount} keys`, inline: true },
          { name: 'Price per Key', value: `${pricePerKey.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'Total (before fee)', value: `${totalReceive.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'Fee (1%)', value: `${fee.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'You Receive', value: `${netReceive.toFixed(8)} ${cryptocurrency}`, inline: true },
          { name: 'Status', value: 'Pending Trade Offer', inline: true }
        )
        .setFooter({ text: 'Please accept the Steam trade offer within 24 hours' });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in sell command:', error);
      message.reply('❌ An error occurred while processing your sell order.');
    }
  },
};
