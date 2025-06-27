const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dm',
    description: 'Send a direct message to a user',
    aliases: ['directmessage', 'pm', 'message'],
    async execute(message, args) {
        // Check if the user has administrator permissions
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` You do not have the required permissions to use this command.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Check if the user mentioned someone or provided an ID
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!targetMember) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please mention a user or provide a valid user ID.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Get the message to send
        const dmMessage = args.slice(1).join(' ');
        if (!dmMessage) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please provide a message to send.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Send the message
        try {
            const embedToSend = new MessageEmbed()
                .setDescription(dmMessage)
                .setColor('BLUE')
                .setFooter({ text: `Sent by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            await targetMember.send({ embeds: [embedToSend] });

            const embed = new MessageEmbed()
                .setDescription(`\`✅\` Successfully sent a message to <@${targetMember.id}>.`)
                .setColor('GREEN');
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('❓ Error sending DM:', error);
            const embed = new MessageEmbed()
                .setDescription('`⛔` There was an error sending the direct message.')
                .setColor('RED');
            message.reply({ embeds: [embed] });
        }
    }
};
