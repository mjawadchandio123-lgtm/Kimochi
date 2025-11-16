const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/User');
const scamProtection = require('../services/scamProtectionService');

module.exports = {
  name: 'tradelink',
  description: 'Set your Steam trade link',
  usage: '!tradelink <trade_url>',
  cooldown: 5,

  async execute(message, args) {
    try {
      if (args.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Missing Trade Link')
          .setDescription('Usage: `!tradelink <trade_url>`')
          .addFields({
            name: 'Example',
            value: 'https://steamcommunity.com/tradeoffer/new/?partner=12345678&token=abcdefgh',
          });
        return message.reply({ embeds: [embed] });
      }

      const tradeLink = args[0];

      // Validate trade link format
      if (!scamProtection.isValidSteamTradeUrl(tradeLink)) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ Invalid Trade Link')
          .setDescription('The trade link you provided is not valid.');
        return message.reply({ embeds: [embed] });
      }

      // Update or create user
      let user = await User.findOne({ discordId: message.author.id });

      if (!user) {
        user = new User({
          discordId: message.author.id,
          username: message.author.username,
          profilePicture: message.author.displayAvatarURL(),
        });
      }

      user.steamTradeLink = tradeLink;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#51CF66')
        .setTitle('✅ Trade Link Set')
        .setDescription('Your Steam trade link has been saved successfully.')
        .addFields({
          name: 'Trade Link',
          value: tradeLink,
        });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in tradelink command:', error);
      message.reply('❌ An error occurred while setting your trade link.');
    }
  },
};
