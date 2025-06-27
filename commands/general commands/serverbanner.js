const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'serverbanner',
    description: 'Displays the server\'s banner.',
    aliases: ['sb', 'guildbanner', 'serverbn', 'sbn', 'sbanner'],
    execute(message) {
        // التحقق مما إذا كانت الرسالة مرسلة في الخاص
        if (message.channel.type === 'DM') {
            return message.reply('This command can only be used in a server.');
        }

        // الحصول على بانر السيرفر
        const bannerURL = message.guild.bannerURL({ dynamic: true, size: 4096 });

        // إنشاء إمبد لعرض بانر السيرفر
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(bannerURL)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // إذا كان السيرفر لا يحتوي على بانر
        if (!bannerURL) {
            embed.setDescription('Server does not have a banner');
        }

        // إرسال الإمبد في القناة
        message.channel.send({ embeds: [embed] });
    },
};
