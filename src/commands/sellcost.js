const { EmbedBuilder } = require('discord.js');
const binanceService = require('../services/binanceService');

module.exports = {
  name: 'sellcost',
  description: 'Calculate what you would receive for selling keys',
  usage: '!sellcost <amount> <cryptocurrency>',
  cooldown: 5,

  async execute(message, args) {
    try {
      if (args.length < 2) {
        return message.reply('Usage: `!sellcost <amount> <cryptocurrency>`');
      }

      const keyAmount = parseInt(args[0]);
      const cryptocurrency = args[1].toUpperCase();

      if (isNaN(keyAmount) || keyAmount <= 0) {
        return message.reply('❌ Invalid amount. Please specify a positive number.');
      }

      // Get price
      message.channel.sendTyping();
      const price = await binanceService.getPrice(cryptocurrency);
      
      const pricePerKey = price / 10;
      const totalReceive = pricePerKey * keyAmount;
      
      // 1% trading fee
      const fee = totalReceive * 0.01;
      const netReceive = totalReceive - fee;

      const embed = new EmbedBuilder()
        .setColor('#51CF66')
        .setTitle('💰 Sell Revenue Calculator')
        .addFields(
          { name: 'Keys to Sell', value: `${keyAmount} keys`, inline: true },
          { name: 'Cryptocurrency', value: cryptocurrency, inline: true },
          { name: 'Price per Key', value: `${pricePerKey.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'Gross Receive', value: `${totalReceive.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'Trading Fee (1%)', value: `${fee.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'Net Receive', value: `${netReceive.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'USD Value', value: `$${(price * netReceive).toFixed(2)}`, inline: false }
        )
        .setFooter({ text: 'Prices from Binance' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in sellcost command:', error);
      message.reply('❌ An error occurred while calculating the selling revenue.');
    }
  },
};
