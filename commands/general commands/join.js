const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'join',
    description: 'Join a specified voice channel by ID',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` You do not have the required permissions to use this command.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }
        if (!message.guild) return;

        if (args.length < 1) {
            return message.reply('Please specify the ID of the voice channel.');
        }

        const voiceChannelId = args[0];
        const voiceChannel = message.guild.channels.cache.get(voiceChannelId);

        if (!voiceChannel || voiceChannel.type !== 'GUILD_VOICE') {
            return message.reply('Could not find the specified voice channel.');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            message.reply(`Joined the voice channel: ${voiceChannel.name}`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to join the specified voice channel.');
        }
    },
};
