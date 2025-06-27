const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a user from the server.',
    execute: async (message, args) => {
        // Checking permissions
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return message.reply('You do not have permissions to kick members.');
        }

        // Parsing user from message mention or ID
        const user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(err => {
            console.log(`Failed to fetch user: ${err}`);
            return null; // If user is not found by ID
        });

        if (!user) {
            return message.reply('You need to mention the user or provide their ID.');
        }
        
        const reason = args.slice(1).join(' ') || 'No specified reason';

        const member = await message.guild.members.fetch(user.id);
        if (!member) {
            return message.reply('User not found in the server.');
        }

        if (!member.kickable) {
            return message.reply('I cannot kick this user. They may have a higher role or I do not have permission.');
        }

        // Kick the member
        await member.kick(reason);

        // Inform the server
        message.channel.send(`${user.tag} has been kicked from the server for: ${reason}`);

        // Send a DM to the kicked user
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('You have been kicked!')
            .addField('Server', `${message.guild.name}`)
            .addField('Kicked by', `${message.author.tag}`)
            .addField('Reason', reason);

        user.send({ embeds: [embed] }).catch(err => console.log(`Failed to send DM: ${err}`));
    }
};
