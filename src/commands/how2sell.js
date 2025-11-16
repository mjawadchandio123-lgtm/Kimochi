const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'how2sell',
  description: 'Instructions on how to sell keys',
  cooldown: 3,

  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#4ECDC4')
      .setTitle('📖 How to Sell TF2 Keys')
      .setDescription('Follow these steps to sell your Mann Co. Supply Crate Keys:')
      .addFields(
        {
          name: '1️⃣ Set Your Trade Link',
          value: 'Use `!tradelink <your_steam_trade_url>` to register your Steam account.',
        },
        {
          name: '2️⃣ Check Available Keys',
          value: 'Use `!balance` to see your current TF2 key inventory.',
        },
        {
          name: '3️⃣ Place a Sell Order',
          value: 'Use `!sell <amount> <cryptocurrency>` to sell keys.',
          inline: false,
        },
        {
          name: 'Example',
          value: '`!sell 5 ETH` - Sell 5 keys for Ethereum',
          inline: false,
        },
        {
          name: '4️⃣ Accept Trade',
          value: 'A Steam trade offer will be sent to you. Accept it within 24 hours.',
          inline: false,
        },
        {
          name: '5️⃣ Receive Payment',
          value: 'Once accepted, crypto will be sent to your registered wallet.',
          inline: false,
        },
        {
          name: '💡 Tip',
          value: 'Use `!sellcost <amount> <crypto>` to calculate how much you\'ll receive.',
          inline: false,
        }
      )
      .setFooter({ text: 'Questions? Use !support for help' });

    message.reply({ embeds: [embed] });
  },
};
