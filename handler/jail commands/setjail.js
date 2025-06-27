const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');
const JailSettings = require('../../models/JailSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-jail')
        .setDescription('Sets the jail roles and log channel for this server.')
        .addRoleOption(option => option.setName('jailed_role').setDescription('The role to assign when someone is jailed').setRequired(true))
        .addRoleOption(option => option.setName('unjailed_role').setDescription('The role to assign when someone is unjailed').setRequired(true))
        .addChannelOption(option => option.setName('jail_log').setDescription('The channel to log jail activities').setRequired(true)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        const jailedRole = interaction.options.getRole('jailed_role');
        const unjailedRole = interaction.options.getRole('unjailed_role');
        const jailLogChannel = interaction.options.getChannel('jail_log');

        await JailSettings.findOneAndUpdate(
            { guildId: interaction.guildId },
            {
                jailedRoleId: jailedRole.id,
                unjailedRoleId: unjailedRole.id,
                jailLogChannelId: jailLogChannel.id
            },
            { new: true, upsert: true }
        );

        interaction.reply({ content: `Jail settings updated successfully! Jailed role: ${jailedRole.name}, Unjailed role: ${unjailedRole.name}, Jail log channel: ${jailLogChannel.name}`, ephemeral: true });
    }
};
