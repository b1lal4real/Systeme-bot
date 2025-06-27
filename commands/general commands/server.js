const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'server',
  description: 'Displays information about the current server.',
  aliases: ['s', 'serverinfo', 'si', 'sinfo', 'guildinfo'],
  async execute(message) {
    const { guild } = message;

    // Fetch the guild to ensure all data is up to date
    await guild.fetch();

    // Get the owner
    const owner = await guild.members.fetch(guild.ownerId);
    const ownerName = owner ? owner.toString() : "Not Available";

    // Count bots
    const botCount = guild.members.cache.filter(member => member.user.bot).size;

    // Count channels
    const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const categoryChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size;

    const serverEmbed = new MessageEmbed()
      .setTitle(`${guild.name}`)
      .setColor('RANDOM')
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '**・**Owner', value: ownerName, inline: false },
        { name: '**・**Server ID', value: guild.id, inline: false },
        { name: '**・**Members', value: guild.memberCount.toString(), inline: true },
        { name: '**・**Bots', value: botCount.toString(), inline: true },
        { name: '**・**Channels', value: `Text: ${textChannels} **|** Voice: ${voiceChannels} **|** Category: ${categoryChannels}`, inline: false },
        { name: '**・**Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: '**・**Emojis', value: guild.emojis.cache.size.toString(), inline: true },
        { name: '**・**Created At', value: `<t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>`, inline: false },
      );

    message.channel.send({ embeds: [serverEmbed] });
  },
};
