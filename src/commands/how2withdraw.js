const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'how2withdraw',
  description: 'Instructions on how to withdraw cryptocurrency',
  cooldown: 3,

  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('📖 How to Withdraw Cryptocurrency')
      .setDescription('Follow these steps to withdraw your funds:')
      .addFields(
        {
          name: '1️⃣ Prepare Wallet Address',
          value: 'Have your external wallet address ready on the network you wish to use.',
        },
        {
          name: '2️⃣ Check Withdrawal Fees',
          value: 'Use `!fees <cryptocurrency>` to see current withdrawal fees.',
        },
        {
          name: '3️⃣ Place Withdrawal Request',
          value: 'Use `!withdraw <amount> <crypto> <address> <network>`',
        },
        {
          name: 'Example',
          value: '`!withdraw 0.5 BTC 1A1z7agoat... Bitcoin`',
          inline: false,
        },
        {
          name: '4️⃣ Confirm Transaction',
          value: 'Your withdrawal will be processed. Check the confirmation message.',
          inline: false,
        },
        {
          name: '⚠️ Important',
          value: '• Always use the correct network\n• Verify your address before confirming\n• Withdrawals are final - check twice!\n• Funds typically arrive within 30 minutes',
          inline: false,
        },
        {
          name: '💡 Check Minimums',
          value: 'Use `!mins <cryptocurrency>` to see minimum withdrawal amounts.',
          inline: false,
        }
      )
      .setFooter({ text: 'Questions? Use !support for help' });

    message.reply({ embeds: [embed] });
  },
};
