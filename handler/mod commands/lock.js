const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the current channel to prevent users from sending messages.'),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply({ content: 'You do not have permission to lock channels.', ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Change permissions for @everyone role in this channel
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false
            });

            // Confirm the action to the user
            const embed = new MessageEmbed()
                .setTitle('Channel Locked')
                .setDescription(`${channel} is now locked. Users cannot send messages.`)
                .setColor('RED');
            
            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Error locking the channel:', error);
            await interaction.reply({ content: 'Failed to lock the channel.', ephemeral: true });
        }
    }
};
