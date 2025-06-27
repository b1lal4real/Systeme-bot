const { Permissions, MessageEmbed } = require('discord.js');
const JailSettings = require('../../models/JailSettings');

module.exports = {
    name: 'jail',
    description: 'Jails a user, stripping all roles and assigning the jailed role.',
    async execute(message, args) {
        // التحقق من الأذونات
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.reply('You do not have permission to jail members.');
        }

        // استرجاع الإعدادات
        const settings = await JailSettings.findOne({ guildId: message.guild.id });
        if (!settings) {
            return message.reply('Jail settings not configured. Please set up with the appropriate command.');
        }

        // تحليل الأرجومنتس للحصول على المستخدم والسبب
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('You need to mention a user or provide their ID!');
        }

        const jailedRole = message.guild.roles.cache.get(settings.jailedRoleId);
        if (!jailedRole) {
            return message.reply('The jailed role does not exist.');
        }

        // تطبيق الدور
        await target.roles.set([jailedRole.id]); // Remove all roles and add jailed role
        settings.jailedMembers.push(target.id); // Add member to jailed list
        await settings.save(); // Save settings

        const embed = new MessageEmbed()
            .setTitle('Jail Notice')
            .setDescription(`<@${target.user.id}> has been jailed.`)
            .addField('Reason', reason)
            .setColor('DARK_RED')
            .setTimestamp();

        const logEmbed = new MessageEmbed()
            .setTitle('New Jail Activity')
            .setDescription(`<@${target.user.id}> was jailed by <@${message.author.id}>.`)
            .addField('Reason', reason)
            .setColor('RED')
            .setTimestamp();

        // إرسال المعلومات إلى قناة السجل
        message.guild.channels.cache.get(settings.jailLogChannelId).send({ embeds: [logEmbed] });
        message.channel.send({ content: `${target.user.tag} has been successfully jailed for: ${reason}` });
    }
};
