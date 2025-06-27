// lock.js
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Locks the current channel to prevent users from sending messages.',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send('You do not have permission to lock channels.');
        }

        try {
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(() => {
                const embed = new MessageEmbed()
                    .setTitle('Channel Locked')
                    .setDescription(`${message.channel} is now locked. Users cannot send messages.`)
                    .setColor('RED');
                message.channel.send({ embeds: [embed] });
            });
        } catch (error) {
            console.error('Error locking the channel:', error);
            message.channel.send('Failed to lock the channel.');
        }
    }
};
