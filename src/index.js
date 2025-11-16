require('dotenv').config();
const { Client, IntentsBitField, ChannelType } = require('discord.js');
const mongoose = require('mongoose');
const path = require('path');
const CommandHandler = require('./bot/commandHandler');
const config = require('./config/config');
const logger = require('./utils/logger');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Initialize command handler
const commandHandler = new CommandHandler(client);

/**
 * Bot Ready Event
 */
client.on('ready', async () => {
  logger.info(`🤖 Bot logged in as ${client.user.tag}`);

  // Set bot status
  client.user.setActivity('!help | TF2 Key Trading', { type: 'PLAYING' });

  // Load commands
  const commandsPath = path.join(__dirname, 'commands');
  commandHandler.loadCommands(commandsPath);

  // Connect to database
  try {
    await mongoose.connect(config.database.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
  }
});

/**
 * Handle Messages
 */
client.on('messageCreate', async message => {
  // Ignore bot messages and non-prefix messages
  if (message.author.bot) return;

  // Handle DM commands
  if (message.channel.type === ChannelType.DM) {
    if (!message.content.startsWith(config.bot.prefix)) return;

    const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    logger.info(`[DM] ${message.author.username} used command: ${commandName}`);
    await commandHandler.executeCommand(message, args, commandName);
    return;
  }

  // Handle Guild commands
  if (!message.content.startsWith(config.bot.prefix)) return;

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  logger.info(`[${message.guild?.name}] ${message.author.username} used command: ${commandName}`);
  await commandHandler.executeCommand(message, args, commandName);
});

/**
 * Error Handling
 */
client.on('error', error => {
  logger.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  logger.error('Unhandled promise rejection:', error);
});

// Start bot
client.login(config.bot.token);

module.exports = client;
