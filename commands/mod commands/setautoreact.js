const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

// Load settings
let settings = require('../../settings.json');

module.exports = {
    name: 'setautoreact',
    description: 'Set an auto-react emoji for a user',
    aliases: ['autoreact', 'reactset'],
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` You do not have the required permissions to use this command.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        const user = message.mentions.users.first();
        const emoji = args[1];

        if (!user) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please mention a user.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        if (!emoji) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please provide an emoji.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Save the settings
        settings[user.id] = emoji;
        fs.writeFileSync(path.join(__dirname, '../../settings.json'), JSON.stringify(settings, null, 2), 'utf8');

        const embed = new MessageEmbed()
            .setDescription(`\`✅\` Auto-react set for ${user.tag} with emoji ${emoji}.`)
            .setColor('GREEN');
        message.reply({ embeds: [embed] });
    }
};
