const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'randomavatar',
    description: 'Displays a random member\'s avatar.',
    aliases: ['ra', 'rav','ravatar','rpfp','avatar random'],
    execute(message) {
        // Get a random member from the guild
        const randomMember = message.guild.members.cache.random();

        // Create the embed
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(randomMember.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setAuthor(randomMember.user.tag, randomMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};
