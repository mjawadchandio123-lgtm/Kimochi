const { EmbedBuilder } = require('discord.js');
const binanceService = require('../services/binanceService');
const config = require('../../config/config');

module.exports = {
  name: 'prices',
  description: 'Display current cryptocurrency prices',
  usage: '!prices [cryptocurrency]',
  cooldown: 5,

  async execute(message, args) {
    try {
      message.channel.sendTyping();

      const cryptos = args.length > 0 ? [args[0].toUpperCase()] : config.trading.supportedCryptos;

      const prices = {};
      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('💹 Current Cryptocurrency Prices');

      for (const crypto of cryptos) {
        try {
          const price = await binanceService.getPrice(crypto);
          prices[crypto] = price;
          embed.addFields({
            name: `${crypto}/USDT`,
            value: `$${price.toFixed(2)}`,
            inline: true,
          });
        } catch (error) {
          embed.addFields({
            name: `${crypto}/USDT`,
            value: 'Error fetching price',
            inline: true,
          });
        }
      }

      embed.setFooter({ text: 'Prices updated from Binance' });
      embed.setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in prices command:', error);
      message.reply('❌ An error occurred while fetching prices.');
    }
  },
};
