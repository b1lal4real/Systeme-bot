const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'user',
    description: 'Get information about a user',
    aliases: ['u', 'userinfo', 'ui', 'infouser'],
    async execute(message, args) {
        let member;

        if (args.length === 0) {
            member = message.member;
        } else {
            const mention = message.mentions.members.first();
            if (mention) {
                member = mention;
            } else {
                const id = args[0];
                member = await message.guild.members.fetch(id).catch(() => null);
            }
        }

        if (!member) {
            return message.reply('User not found. Please mention a user or provide a valid user ID.');
        }

        const joinedDiscordTimestamp = Math.floor(member.user.createdAt.getTime() / 1000);
        const joinedServerTimestamp = Math.floor(member.joinedAt.getTime() / 1000);

        const embed = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addField('Joined Discord', `<t:${joinedDiscordTimestamp}:R>`, false)
            .addField('Joined Server', `<t:${joinedServerTimestamp}:R>`, false)
            .addField('Highest Role', `${member.roles.highest}`, true)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        message.channel.send({ embeds: [embed] });
    },
};
