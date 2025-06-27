const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the current channel to allow users to send messages again.'),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply({ content: 'You do not have permission to unlock channels.', ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Reset permissions for @everyone role in this channel
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: null
            });

            // Confirm the action to the user
            const embed = new MessageEmbed()
                .setTitle('Channel Unlocked')
                .setDescription(`${channel} is now unlocked. Users can send messages again.`)
                .setColor('GREEN');
            
            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Error unlocking the channel:', error);
            await interaction.reply({ content: 'Failed to unlock the channel.', ephemeral: true });
        }
    }
};
