const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');
const JailSettings = require('../../models/JailSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jail')
        .setDescription('Jails a user, stripping all roles and assigning the jailed role.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to jail')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for jailing the user')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to jail members.', ephemeral: true });
        }

        const settings = await JailSettings.findOne({ guildId: interaction.guildId });
        if (!settings) {
            return interaction.reply({ content: 'Jail settings not configured. Please set up with /set_jail.', ephemeral: true });
        }

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason');
        const jailedRole = interaction.guild.roles.cache.get(settings.jailedRoleId);

        if (!jailedRole) {
            return interaction.reply({ content: 'Jailed role does not exist.', ephemeral: true });
        }

        await target.roles.set([jailedRole.id]); // Remove all roles and add jailed role
        settings.jailedMembers.push(target.id); // Add member to jailed list
        await settings.save(); // Save settings

        const embed = new MessageEmbed()
            .setTitle('Jail Notice')
            .setDescription(`<@${target.user.id}> has been jailed.`)
            .addField('Reason', reason)
            .setColor('DARK_RED')
            .setTimestamp();

        const logEmbed = new MessageEmbed()
            .setTitle('New Jail Activity')
            .setDescription(`<@${target.user.id}> was jailed by <@${interaction.user.id}>.`)
            .addField('Reason', reason)
            .setColor('RED')
            .setTimestamp();

        interaction.guild.channels.cache.get(settings.jailLogChannelId).send({ embeds: [logEmbed] });
        interaction.reply({ content: `${target.user.tag} has been successfully jailed for: ${reason}`, ephemeral: true });
    }
};
