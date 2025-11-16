const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'balance',
  description: 'Display your current balance',
  cooldown: 3,

  async execute(message) {
    try {
      const User = require('../database/models/User');
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
        .setTitle('💰 Your Balance')
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
          {
            name: 'TF2 Keys',
            value: `${user.tf2KeyBalance} keys`,
            inline: true,
          }
        );

      // Add cryptocurrency balances
      if (user.wallets && user.wallets.length > 0) {
        let walletInfo = '';
        for (const wallet of user.wallets) {
          const available = wallet.balance - wallet.locked;
          walletInfo += `**${wallet.cryptocurrency}**\nBalance: ${wallet.balance}\nLocked: ${wallet.locked}\nAvailable: ${available}\n\n`;
        }
        embed.addFields({
          name: 'Cryptocurrency Wallets',
          value: walletInfo || 'No wallets',
        });
      }

      embed.setFooter({ text: `Account created: ${user.createdAt.toLocaleDateString()}` });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in balance command:', error);
      message.reply('❌ An error occurred while fetching your balance.');
    }
  },
};
