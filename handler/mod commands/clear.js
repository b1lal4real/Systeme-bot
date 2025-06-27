const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

// Initialize cooldowns map
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears messages from the current channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (up to 100)')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownAmount = 8000; // 8 seconds cooldown

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the 'clear' command.`, ephemeral: true });
            }
        }

        cooldowns.set(userId, now);

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: 'You do not have permission to clear messages.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You can delete 1 to 100 messages at a time.', ephemeral: true });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            const deletedMessages = await interaction.channel.bulkDelete(messages, true);
            interaction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            interaction.reply({ content: 'Failed to delete messages. Ensure messages are not older than 2 weeks.', ephemeral: true });
        }
    }
};
