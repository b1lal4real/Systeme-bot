const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'banner',
    description: 'Displays the banner of a user.',
    aliases: ['b', 'bn','banneruser'],  
    usage: 'banner [user mention or user ID]',
    async execute(message, args) {
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

        try {
            await user.fetch();

            const bannerURL = user.bannerURL({ dynamic: true, size: 4096, format: 'png', force: true });
            if (!bannerURL) return message.reply('This user does not have a banner.');

            const embed = new MessageEmbed()
                .setImage(bannerURL)
                .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
                .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while fetching the user\'s banner.');
        }
    },
};
