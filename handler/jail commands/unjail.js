const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');
const JailSettings = require('../../models/JailSettings'); // تأكد من المسار

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unjail')
        .setDescription('Removes the jailed role from a user and assigns the unjailed role.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to unjail')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to manage roles.', ephemeral: true });
        }

        try {
            const settings = await JailSettings.findOne({ guildId: interaction.guild.id });
            if (!settings) {
                return interaction.reply({ content: 'Jail settings not configured.', ephemeral: true });
            }

            const target = interaction.options.getMember('target');
            const jailedRole = interaction.guild.roles.cache.get(settings.jailedRoleId);
            const unjailedRole = interaction.guild.roles.cache.get(settings.unjailedRoleId);

            if (!target.roles.cache.has(jailedRole.id)) {
                return interaction.reply({ content: 'This user is not jailed.', ephemeral: true });
            }

            await target.roles.remove(jailedRole);
            await target.roles.add(unjailedRole);

            interaction.reply({ content: `<@${target.user.id}> has been unjailed and assigned the unjailed role.`, ephemeral: false });
        } catch (error) {
            console.error('Failed to execute unjail command:', error);
            interaction.reply({ content: 'Failed to execute unjail command.', ephemeral: true });
        }
    }
};
