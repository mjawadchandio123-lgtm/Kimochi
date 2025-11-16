const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'how2buy',
  description: 'Instructions on how to purchase keys',
  cooldown: 3,

  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#51CF66')
      .setTitle('📖 How to Buy TF2 Keys')
      .setDescription('Follow these steps to purchase Mann Co. Supply Crate Keys:')
      .addFields(
        {
          name: '1️⃣ Set Your Trade Link',
          value: 'Use `!tradelink <your_steam_trade_url>` to register your Steam account.',
        },
        {
          name: '2️⃣ Deposit Cryptocurrency',
          value: 'Use `!deposit` to get your unique wallet address for depositing crypto.',
        },
        {
          name: '3️⃣ Check Your Balance',
          value: 'Use `!balance` to see your current cryptocurrency balance.',
        },
        {
          name: '4️⃣ Place a Buy Order',
          value: 'Use `!buy <amount> <cryptocurrency>` to purchase keys.',
          inline: false,
        },
        {
          name: 'Example',
          value: '`!buy 10 BTC` - Buy 10 keys using Bitcoin',
          inline: false,
        },
        {
          name: '💡 Tip',
          value: 'Check `!prices <crypto>` to see current exchange rates before buying.',
          inline: false,
        }
      )
      .setFooter({ text: 'Questions? Use !support for help' });

    message.reply({ embeds: [embed] });
  },
};
