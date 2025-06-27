const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

// Load settings
let settings = require('../../settings.json');

module.exports = {
    name: 'removeautoreact',
    description: 'Remove an auto-react emoji for a user',
    aliases: ['removereact', 'autoreactremove'],
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` You do not have the required permissions to use this command.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        const user = message.mentions.users.first();

        if (!user) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` Please mention a user.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Check if the user has an auto-react setting
        if (!settings[user.id]) {
            const embed = new MessageEmbed()
                .setDescription('`⛔` This user does not have an auto-react set.')
                .setColor('RED');
            return message.reply({ embeds: [embed] });
        }

        // Remove the settings
        delete settings[user.id];
        fs.writeFileSync(path.join(__dirname, '../../settings.json'), JSON.stringify(settings, null, 2), 'utf8');

        const embed = new MessageEmbed()
            .setDescription(`\`✅\` Auto-react removed for ${user.tag}.`)
            .setColor('GREEN');
        message.reply({ embeds: [embed] });
    }
};
