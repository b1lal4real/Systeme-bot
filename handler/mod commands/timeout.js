const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Apply a timeout to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)), // استخدم setRequired(false) بدلاً من setOptional

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
        }

        // Convert duration from minutes to milliseconds
        const durationMs = duration * 60 * 1000;

        try {
            await member.timeout(durationMs, reason);
            interaction.reply({ content: `${user.tag} has been timed out for ${duration} minutes. Reason: ${reason}` });
        } catch (error) {
            console.error('Error applying timeout:', error);
            interaction.reply({ content: 'Failed to apply timeout to the user.', ephemeral: true });
        }
    }
};
