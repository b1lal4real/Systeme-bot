const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'serveravatar',
    description: 'Displays the server\'s avatar.',
    aliases: ['sa', 'guildavatar', 'serverav', 'sav', 'savatar'],
    execute(message) {
        // التحقق مما إذا كانت الرسالة مرسلة في الخاص
        if (message.channel.type === 'DM') {
            return message.reply('This command can only be used in a server.');
        }

        const guild = message.guild;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setImage(guild.iconURL({ dynamic: true, size: 4096 }))
            .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
