const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/User');

module.exports = {
  name: 'lang',
  description: 'Change the bot language',
  usage: '!lang <language_code>',
  cooldown: 5,

  async execute(message, args) {
    const supportedLanguages = ['en', 'es', 'zh', 'sr', 'de'];

    if (args.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('Available Languages')
        .addFields({
          name: 'Codes',
          value: supportedLanguages.join(', '),
        }, {
          name: 'Usage',
          value: '`!lang <code>`',
        });
      return message.reply({ embeds: [embed] });
    }

    const langCode = args[0].toLowerCase();

    if (!supportedLanguages.includes(langCode)) {
      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('❌ Invalid Language')
        .setDescription(`Supported languages: ${supportedLanguages.join(', ')}`);
      return message.reply({ embeds: [embed] });
    }

    try {
      let user = await User.findOne({ discordId: message.author.id });

      if (!user) {
        user = new User({
          discordId: message.author.id,
          username: message.author.username,
          language: langCode,
        });
      } else {
        user.language = langCode;
      }

      await user.save();

      const languages = { en: 'English', es: 'Español', zh: '中文', sr: 'Српски', de: 'Deutsch' };

      const embed = new EmbedBuilder()
        .setColor('#51CF66')
        .setTitle('✅ Language Changed')
        .setDescription(`Your language has been set to ${languages[langCode]}`);

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in lang command:', error);
      message.reply('❌ An error occurred while changing your language.');
    }
  },
};
