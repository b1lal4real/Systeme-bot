const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');
const GuildSettings = require('../../models/verif'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-verification')
        .setDescription('Set verification roles and channel settings.')
        .addRoleOption(option => 
            option.setName('unverified_role')
                .setDescription('The role given to unverified members.')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('verified_role')
                .setDescription('The role given to verified members.')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('verified_girl_role')
                .setDescription('The role given to verified members identified as female.')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('verificator_role')
                .setDescription('The role allowed to verify new members.')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('log_verif')
                .setDescription('The channel where verification logs are sent.')
                .setRequired(true)),

    async execute(interaction) {
        // Check if the user has the Administrator permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
        }

        const unverifiedRole = interaction.options.getRole('unverified_role');
        const verifiedRole = interaction.options.getRole('verified_role');
        const verifiedGirlRole = interaction.options.getRole('verified_girl_role');
        const verificatorRole = interaction.options.getRole('verificator_role');
        const logVerifChannel = interaction.options.getChannel('log_verif');

        // Update or create verification settings in the database
        try {
            await GuildSettings.findOneAndUpdate(
                { guildId: interaction.guild.id },
                {
                    guildId: interaction.guild.id,
                    unverifiedRoleId: unverifiedRole.id,
                    verifiedRoleId: verifiedRole.id,
                    verifiedGirlRoleId: verifiedGirlRole.id,
                    verificatorRoleId: verificatorRole.id,
                    logVerifChannelId: logVerifChannel.id
                },
                { new: true, upsert: true }
            );

            interaction.reply({ content: 'Verification settings updated successfully!', ephemeral: true });
        } catch (error) {
            console.error('Failed to update verification settings:', error);
            interaction.reply({ content: 'Failed to update verification settings.', ephemeral: true });
        }
    }
};
