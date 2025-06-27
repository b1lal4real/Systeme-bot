const { Permissions, MessageEmbed } = require('discord.js');
const JailSettings = require('../../models/JailSettings'); // تأكد من المسار الصحيح

module.exports = {
    name: 'unjail',
    description: 'Removes the jailed role from a user and assigns the unjailed role.',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.reply('You do not have permission to manage roles.');
        }

        const settings = await JailSettings.findOne({ guildId: message.guild.id });
        if (!settings) {
            return message.reply('Jail settings not configured. Please set up with the appropriate command.');
        }

        // استخراج العضو سواء بالمنشن أو بالأيدي
        let target;
        if (args[0]) {
            target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        }

        if (!target) {
            return message.reply('Please specify a valid member of this server.');
        }

        const jailedRole = message.guild.roles.cache.get(settings.jailedRoleId);
        const unjailedRole = message.guild.roles.cache.get(settings.unjailedRoleId);

        if (!target.roles.cache.has(jailedRole.id)) {
            return message.reply('This user is not currently jailed.');
        }

        await target.roles.remove(jailedRole);
        await target.roles.add(unjailedRole);

        message.reply(`<@${target.user.id}> has been unjailed and assigned the unjailed role.`);

        const logChannel = message.guild.channels.cache.get(settings.logChannelId);
        if (logChannel) {
            const embed = new MessageEmbed()
                .setTitle('Unjail Activity')
                .setDescription(`<@${target.user.id}> has been unjailed.`)
                .addField('Unjailed By', `<@${message.author.id}>`)
                .setColor('#009432')
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
};
