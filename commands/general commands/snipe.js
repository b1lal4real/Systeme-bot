const { MessageEmbed } = require('discord.js');
const deletedMessages = require('../../deletedMessages');

module.exports = {
    name: 'snipe',
    description: 'Display the last deleted message in the channel',
    async execute(message, args) {
        const snipedMessage = deletedMessages.get(message.channel.id);
        
        if (!snipedMessage) {
            return message.channel.send('There are no deleted messages to snipe!');
        }
        
        const embed = new MessageEmbed()
            .setAuthor(snipedMessage.author.tag, snipedMessage.author.displayAvatarURL({ dynamic: true }))
            .setDescription(snipedMessage.content || 'No content')
            .setFooter('Message deleted at')
            .setTimestamp(snipedMessage.timestamp);
        
        if (snipedMessage.image) {
            embed.setImage(snipedMessage.image);
        }

        message.channel.send({ embeds: [embed] });
    },
};
