const fs = require('fs');
const path = require('path');

class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.cooldowns = new Map();
  }

  /**
   * Load all commands from the commands directory
   */
  loadCommands(commandsPath) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (command.name) {
        this.commands.set(command.name, command);
        console.log(`✓ Loaded command: ${command.name}`);
      } else {
        console.warn(`⚠ Command file ${file} is missing a name property`);
      }
    }
  }

  /**
   * Execute a command
   */
  async executeCommand(message, args, commandName) {
    const command = this.commands.get(commandName);

    if (!command) {
      return message.reply('❌ Command not found');
    }

    // Check cooldowns
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Map());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`⏱️ Please wait ${timeLeft.toFixed(1)}s before using this command again.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      message.reply('❌ An error occurred while executing this command.');
    }
  }

  /**
   * Get command by name
   */
  getCommand(name) {
    return this.commands.get(name);
  }

  /**
   * Get all commands
   */
  getAllCommands() {
    return Array.from(this.commands.values());
  }

  /**
   * Check if a command exists
   */
  hasCommand(name) {
    return this.commands.has(name);
  }
}

module.exports = CommandHandler;
