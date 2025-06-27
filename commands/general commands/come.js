const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'come',
    description: 'Move a user to your voice channel',
    aliases: ['aji','sir','ser'],
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` You need to be in a voice channel to use this command.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Get the mentioned user or the user ID
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!targetMember) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please mention a user or provide a valid user ID.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        if (!targetMember.voice.channel) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` The user you mentioned is not in a voice channel.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        try {
            await targetMember.voice.setChannel(voiceChannel);
            const embed = new MessageEmbed()
                .setDescription(`\`✅\` Successfully moved <@${targetMember.id}> to your voice channel.`)
                .setColor('GREEN');
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('❓ Error moving the user to the voice channel:', error);
            const embed = new MessageEmbed()
                .setDescription('`⛔` There was an error moving the user to your voice channel.')
                .setColor('RED');
            message.reply({ embeds: [embed] });
        }
    }
};
