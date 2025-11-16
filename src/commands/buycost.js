const { EmbedBuilder } = require('discord.js');
const binanceService = require('../services/binanceService');

module.exports = {
  name: 'buycost',
  description: 'Calculate the cost to buy a certain amount of keys',
  usage: '!buycost <amount> <cryptocurrency>',
  cooldown: 5,

  async execute(message, args) {
    try {
      if (args.length < 2) {
        return message.reply('Usage: `!buycost <amount> <cryptocurrency>`');
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
      const totalCost = pricePerKey * keyAmount;

      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('💸 Buy Cost Calculator')
        .addFields(
          { name: 'Keys to Buy', value: `${keyAmount} keys`, inline: true },
          { name: 'Cryptocurrency', value: cryptocurrency, inline: true },
          { name: 'Price per Key', value: `${pricePerKey.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'Total Cost', value: `${totalCost.toFixed(8)} ${cryptocurrency}`, inline: false },
          { name: 'USD Value', value: `$${(price * totalCost).toFixed(2)}`, inline: false }
        )
        .setFooter({ text: 'Prices from Binance' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in buycost command:', error);
      message.reply('❌ An error occurred while calculating the cost.');
    }
  },
};
