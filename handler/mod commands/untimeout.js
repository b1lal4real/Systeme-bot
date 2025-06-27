const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove a timeout from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove the timeout from')
                .setRequired(true)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to remove timeouts.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
        }

        try {
            // Removing timeout by setting it to null
            await member.timeout(null);
            interaction.reply({ content: `${user.tag} has been untimed out.` });
        } catch (error) {
            console.error('Error removing timeout:', error);
            interaction.reply({ content: 'Failed to remove timeout from the user.', ephemeral: true });
        }
    }
};
