const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Removes a specified number of warnings from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove warnings from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The number of warnings to remove')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: 'You do not have permission to manage warnings.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const count = interaction.options.getInteger('count');

        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!settings) {
            return interaction.editReply({ content: 'No warnings found for this user.' });
        }

        // Perform unwarn logic here
        const updatedWarnings = settings.warnings.filter((warn, index) => index >= count);
        settings.warnings = updatedWarnings;
        await settings.save();

        await interaction.editReply({ content: `Successfully removed ${count} warnings from ${user.tag}.` });
    }
};
