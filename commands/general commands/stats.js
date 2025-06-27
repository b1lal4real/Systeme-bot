const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'Display information about a voice channel member.',
    aliases: ['serverstats', 'vc'],
    async execute(message) {
        try {
            const guild = message.guild;
            const memberCount = guild.memberCount;
            const boostCount = guild.premiumSubscriptionCount;

            let totalVoiceMembers = 0;
            guild.channels.cache.forEach(channel => {
                if (channel.isVoice()) {
                    totalVoiceMembers += channel.members.size;
                }
            });

            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${guild.name} Stats`, guild.iconURL() || '')
                .addField('<:11pm_members:1251139064740974702> Members:', `${memberCount}`, false)
                .addField('<:11pm_voice:1251139065827430461> In Voice:', `${totalVoiceMembers}`, false)
                .addField('<a:Booster:1251139067433717801> Boosts:', `${boostCount}`, false)
                .setThumbnail(guild.iconURL())
                .setTimestamp();

            const button = new MessageButton()
                .setCustomId('button_vc')
                .setLabel(`Voice: ${totalVoiceMembers}`)
                .setStyle('SECONDARY')
                .setEmoji('1225145330417274973')
                .setDisabled(true);

            const row = new MessageActionRow().addComponents(button);

            // Delete the command message
            await message.delete();

            // Send the embed with the button
            await message.channel.send({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error executing vc command:', error);
            message.reply('An error occurred while retrieving information.');
        }
    },
};
