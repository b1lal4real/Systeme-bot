const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channelinfo',
    description: 'Displays information about a channel.',
    aliases: ['ci', 'channel'],
    usage: 'channelinfo [channel mention or channel ID]',
    execute(message, args) {
        let channel;
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setDescription('To use this command, mention a channel or provide its ID.')
                .setAuthor(message.guild ? message.guild.name : 'Direct Message', message.guild ? message.guild.iconURL({ dynamic: true }) : null)
                .addField('Usage', '!channelinfo [channel mention or channel ID]')
                .addField('Aliases', this.aliases.join(' **|** '));
            return message.channel.send({ embeds: [embed] });
        } else {
            if (!message.guild) {
                return message.reply('This command cannot be used in direct messages.');
            }
            
            const mention = message.mentions.channels.first();
            if (mention) {
                channel = mention;
            } else {
                const id = args[0];
                channel = message.guild.channels.cache.get(id);
                if (!channel) {
                    const embed = new MessageEmbed()
                        .setDescription('Invalid channel ID.')
                        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                        .setFooter('Usage: !channelinfo [channel mention or channel ID]')
                        .addField('Aliases', this.aliases.join(' **|** '));
                    return message.channel.send({ embeds: [embed] });
                }
            }
        }

        const channelType = channel.type === 'GUILD_VOICE' ? 'Voice Channel' : 'Text Channel';

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`<#${channel.id}>'s Information`)
            .addFields(
                { name: 'Channel Name', value: channel.toString(), inline: false },
                { name: 'Channel ID', value: channel.id, inline: false },
                { name: 'Type', value: channelType, inline: false },
                { name: 'Created At', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: false },
            )
            .setAuthor(message.guild ? message.guild.name : 'Direct Message', message.guild ? message.guild.iconURL({ dynamic: true }) : null)
            .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
