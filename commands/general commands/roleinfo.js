const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roleinfo',
    description: 'Displays information about a specific role.',
    aliases: ['ri', 'rinfo'],
    options: [
        {
            name: 'role',
            description: 'Select the role to display information about.',
            type: 'ROLE',
            required: true
        }
    ],
    execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

        if (!role) {
            return message.reply('Please mention a valid role or provide a role ID.');
        }

        const position = message.guild.roles.cache.size - role.position;

        const hasAdmin = role.permissions.has('ADMINISTRATOR') ? 'Yes' : 'No';

        const permissions = role.permissions.toArray().map(p => `\`${p}\``).join(', ');
        const permissionsDisplay = permissions.length ? permissions : 'No permissions';

        const embed = new MessageEmbed()
            .setColor(role.color)
            .setTitle('Role Information')
            .addFields(
                { name: 'Role', value: `<@&${role.id}>`, inline: false },
                { name: 'Role ID', value: role.id, inline: false },
                { name: 'Role Position', value: `${position}`, inline: false },
                { name: 'Hex Code', value: `#${role.color.toString(16).padStart(6, '0')}`, inline: false },
                { name: 'Administrator', value: hasAdmin, inline: false },
                { name: 'Permissions', value: permissionsDisplay, inline: false }
            )
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        if (role.icon) {
            const iconUrl = `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png`;
            embed.setThumbnail(iconUrl);
        }

        message.channel.send({ embeds: [embed] });
    },
};
