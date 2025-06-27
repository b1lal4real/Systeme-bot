const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'ban', // اسم الأمر
    description: 'Ban a user from the server.', // وصف الأمر
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return message.channel.send('You do not have permission to ban members.');
        }

        const userID = args[0];
        const reason = args.slice(2).join(' ') || 'No reason provided';
        const time = parseInt(args[1], 10);
        const deleteMessagesDays = isNaN(time) ? 0 : (time > 7 ? 7 : time);

        try {
            // محاولة جلب المستخدم من ذاكرة الكاش أو من API
            const user = message.mentions.users.first() || await message.client.users.fetch(userID).catch(() => null);

            if (!user) {
                return message.channel.send('You need to provide a valid user ID or mention the user.');
            }

            const member = await message.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return message.channel.send('User not found in the server.');
            }

            // Ban the user
            await member.ban({ days: deleteMessagesDays, reason: reason });
            message.channel.send(`${user.tag} has been banned from the server.`);

            const banEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('You have been banned!')
                .addField('Server', `${message.guild.name}`)
                .addField('Banned by', `${message.author.tag}`)
                .addField('Reason', `${reason}`)
                .addField('Time', `<t:${Math.floor(Date.now() / 1000) + (deleteMessagesDays * 86400)}:R>`);

            await user.send({ embeds: [banEmbed] }).catch(e => console.log("Could not send message to user."));
        } catch (err) {
            console.error(err);
            message.channel.send('There was an error trying to ban the user.');
        }
    }
};
