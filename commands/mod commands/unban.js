const { prefix } = require('../../config.json'); // تأكد من تعيين البريفكس في ملف config.json

module.exports = {
    name: 'unban',
    description: 'Unbans a user from the server.',
    execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply({ content: 'You do not have permission to unban members.' });
        }

        const userId = args[0];

        try {
            message.guild.bans.fetch().then(bannedUsers => {
                const userBan = bannedUsers.get(userId);

                if (!userBan) {
                    return message.reply({ content: 'This user is not banned.' });
                }

                message.guild.bans.remove(userId);
                message.reply({ content: `Successfully unbanned <@${userId}> from the server.` });
            });
        } catch (error) {
            console.error('Error unbanning the user:', error);
            message.reply({ content: 'There was an error trying to unban the user. Please check the provided ID and try again.' });
        }
    }
};
