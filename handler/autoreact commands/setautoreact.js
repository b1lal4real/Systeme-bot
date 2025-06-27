const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const AutoReact = require('../../models/autoReactModel'); // Ensure this path is correct

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautoreact')
        .setDescription('Set an auto react for a member.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to set auto react for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetMember = interaction.options.getMember('member');
        const emoji = interaction.options.getString('emoji');

        try {
            await AutoReact.findOneAndUpdate(
                { memberId: targetMember.id }, 
                { emoji: emoji }, 
                { upsert: true, new: true }
            );
            interaction.reply({ content: `Auto react set successfully for ${targetMember.displayName}.`, ephemeral: false });
        } catch (error) {
            console.error('Error setting auto react:', error);
            interaction.reply({ content: 'An error occurred while setting auto react.', ephemeral: true });
        }
    }
};
