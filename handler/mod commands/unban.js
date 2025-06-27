const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option =>
            option.setName('userid')
            .setDescription('The ID of the user to unban')
            .setRequired(true)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');

        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            const userBan = bannedUsers.get(userId);

            if (!userBan) {
                return interaction.reply({ content: 'This user is not banned.', ephemeral: true });
            }

            await interaction.guild.bans.remove(userId);
            interaction.reply({ content: `Successfully unbanned <@${userId}> from the server.` });
        } catch (error) {
            console.error('Error unbanning the user:', error);
            interaction.reply({ content: 'There was an error trying to unban the user. Please check the provided ID and try again.', ephemeral: true });
        }
    }
};
