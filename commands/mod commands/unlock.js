// unlock.js
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlocks the current channel to allow users to send messages again.',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send('You do not have permission to unlock channels.');
        }

        try {
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: null
            }).then(() => {
                const embed = new MessageEmbed()
                    .setTitle('Channel Unlocked')
                    .setDescription(`${message.channel} is now unlocked. Users can send messages again.`)
                    .setColor('GREEN');
                message.channel.send({ embeds: [embed] });
            });
        } catch (error) {
            console.error('Error unlocking the channel:', error);
            message.channel.send('Failed to unlock the channel.');
        }
    }
};
