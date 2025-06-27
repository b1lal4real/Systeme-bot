const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/verif'); // تأكد من استخدام المسار الصحيح

module.exports = {
    name: 'vg',
    description: 'Verify a user as a girl if not already verified.',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.channel.send('You do not have permission to verify members.');
        }

        const guildId = message.guild.id;
        const settings = await GuildSettings.findOne({ guildId: guildId });
        if (!settings) {
            return message.channel.send('Verification settings not configured.');
        }

        // Determine if the target is mentioned or provided by ID
        let target = message.mentions.users.first();
        if (!target && args.length > 0) {
            try {
                target = await message.client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send('Invalid user ID provided.');
            }
        }
        if (!target) target = message.author; // If no user mentioned or ID provided, use the author
        const member = await message.guild.members.fetch(target.id);

        const verifiedRole = message.guild.roles.cache.get(settings.verifiedRoleId);
        const verifiedGirlRole = message.guild.roles.cache.get(settings.verifiedGirlRoleId);
        const unverifiedRole = message.guild.roles.cache.get(settings.unverifiedRoleId);
        const logChannel = message.guild.channels.cache.get(settings.logVerifChannelId);

        if (member.roles.cache.has(verifiedRole.id)) {
            return message.channel.send(`${target.tag} is already verified.`);
        }

        await member.roles.add([verifiedRole, verifiedGirlRole]);
        if (unverifiedRole) {
            await member.roles.remove(unverifiedRole);
        }

        const embed = new MessageEmbed()
            .setColor('#FF69B4')
            .setTitle('Verification Successful')
            .setDescription(`${target.tag} has been successfully verified as a verified girl!`)
            .setThumbnail(target.displayAvatarURL())
            .setImage(message.guild.bannerURL({ size: 2048, dynamic: true, format: 'png' }) || null)
            .addField('Verified At', `<t:${Math.floor(Date.now() / 1000)}:R>`, false)
            .addField('Verified By', `${message.author.tag}`, false);

        // Add a disabled button to show the server name
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(message.guild.name)
                .setStyle('SECONDARY')
                .setCustomId('server-name')
                .setDisabled(true)
        );

        // Send a private message if possible
        member.send({ embeds: [embed], components: [row] }).catch(console.error);

        const logEmbed = new MessageEmbed()
            .setColor('#FF69B4')
            .setTitle('New Girl Verification')
            .setDescription(`${target.tag} has been verified as a girl by ${message.author.tag}.`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}:R>`, false);

        logChannel.send({ embeds: [logEmbed] });

        message.channel.send(`Verification process for ${target.tag} completed successfully as a verified girl.`);
    }
};
