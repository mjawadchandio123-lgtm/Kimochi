const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'how2deposit',
  description: 'Instructions on how to deposit cryptocurrency',
  cooldown: 3,

  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#FFD93D')
      .setTitle('📖 How to Deposit Cryptocurrency')
      .setDescription('Follow these steps to deposit funds into your account:')
      .addFields(
        {
          name: '1️⃣ Request Your Wallet Address',
          value: 'Use `!deposit` to get your unique deposit wallet address.',
        },
        {
          name: '2️⃣ Send Cryptocurrency',
          value: 'Send your cryptocurrency to the address provided. Ensure you\'re using the correct network.',
        },
        {
          name: '3️⃣ Wait for Confirmation',
          value: 'Deposits are confirmed after the required block confirmations (typically 1-30 minutes).',
        },
        {
          name: '4️⃣ Check Your Balance',
          value: 'Use `!balance` to verify your deposit was received.',
          inline: false,
        },
        {
          name: '⚠️ Important',
          value: '• Always use the correct network for your deposit\n• Double-check the address before sending\n• Contact support if your deposit doesn\'t arrive',
          inline: false,
        },
        {
          name: '💡 Minimum Deposit',
          value: 'Check `!mins <cryptocurrency>` for minimum deposit amounts.',
          inline: false,
        }
      )
      .setFooter({ text: 'Questions? Use !support for help' });

    message.reply({ embeds: [embed] });
  },
};
