const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/verif'); // تأكد من استخدام المسار الصحيح

module.exports = {
    name: 'vb',
    description: 'Verify a user if not already verified.',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.channel.send('You do not have permission to verify member.');
        }
        if (!args.length) {
            return message.channel.send('Please mention a user or provide their ID.');
        }

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!target) {
            return message.channel.send('Could not find the user. Please mention a valid user or provide a valid ID.');
        }

        const guildId = message.guild.id;
        const settings = await GuildSettings.findOne({ guildId: guildId });
        if (!settings) {
            return message.channel.send('Verification settings not configured.');
        }

        const member = await message.guild.members.fetch(target.id);
        const verifiedRole = message.guild.roles.cache.get(settings.verifiedRoleId);
        const unverifiedRole = message.guild.roles.cache.get(settings.unverifiedRoleId);
        const logChannel = message.guild.channels.cache.get(settings.logVerifChannelId);

        if (member.roles.cache.has(verifiedRole.id)) {
            return message.channel.send(`${member.user.tag} (${member.id}) is already verified.`);
        }

        await member.roles.add(verifiedRole);
        if (unverifiedRole) {
            await member.roles.remove(unverifiedRole);
        }

        const embed = new MessageEmbed()
            .setColor('#34D399') // A green color
            .setTitle('Verification Successful')
            .setDescription(`${member.user.tag} has been successfully verified!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setImage(message.guild.bannerURL({ size: 2048, dynamic: true, format: 'png' }) || null)
            .addField('User ID', member.id, false)
            .addField('Verified At', `<t:${Math.floor(Date.now() / 1000)}:R>`, false)
            .addField('Verified By', `${message.author.tag}`, false);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(message.guild.name)
                .setStyle('SECONDARY')
                .setCustomId('server-name')
                .setDisabled(true)
        );

        member.send({ embeds: [embed], components: [row] }).catch(console.error);

        const logEmbed = new MessageEmbed()
            .setColor('#2563EB') // A blue color
            .setTitle('New Verification')
            .setDescription(`${member.user.tag} has been verified by ${message.author.tag}.`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}:R>`, false);

        logChannel.send({ embeds: [logEmbed] });

        message.channel.send(`Verification process for ${member.user.tag} (${member.id}) completed successfully.`);
    }
};
