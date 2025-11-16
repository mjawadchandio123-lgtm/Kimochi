const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/User');

module.exports = {
  name: 'stats',
  description: 'Display your trading statistics',
  cooldown: 5,

  async execute(message) {
    try {
      const user = await User.findOne({ discordId: message.author.id });

      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('❌ No Account')
          .setDescription('You don\'t have an account yet. Use `!tradelink` to create one.');
        return message.reply({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('📊 Your Trading Statistics')
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
          {
            name: 'Total Purchases',
            value: `${user.stats.totalBuys} buys`,
            inline: true,
          },
          {
            name: 'Total Sales',
            value: `${user.stats.totalSells} sells`,
            inline: true,
          },
          {
            name: 'Total Keys Purchased',
            value: `${user.stats.totalKeysPurchased} keys`,
            inline: true,
          },
          {
            name: 'Total Keys Sold',
            value: `${user.stats.totalKeysSold} keys`,
            inline: true,
          },
          {
            name: 'Total Trading Volume',
            value: `$${user.stats.totalVolume.toFixed(2)} USD`,
            inline: true,
          },
          {
            name: 'Average Trade Value',
            value: `$${user.stats.averageTradeValue.toFixed(2)} USD`,
            inline: true,
          }
        )
        .setFooter({ text: `Member since: ${user.createdAt.toLocaleDateString()}` });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in stats command:', error);
      message.reply('❌ An error occurred while fetching your statistics.');
    }
  },
};
