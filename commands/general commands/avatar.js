const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Displays the avatar of a user.',
    aliases: ['a', 'av','pfp'],  
    usage: 'avatar [user mention or user ID]',
    execute(message, args) {
        let user;
        if (!args[0]) {
            user = message.author;
        } else {
            const mention = message.mentions.users.first();
            if (mention) {
                user = mention;
            } else {
                const id = args[0];
                user = message.client.users.cache.get(id);
                if (!user) return message.reply('Invalid user ID.');
            }
        }

        const embed = new MessageEmbed()
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
            .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
