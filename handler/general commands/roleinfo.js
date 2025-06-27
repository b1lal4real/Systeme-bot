const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Displays information about a specific role.')
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('Select the role to display information about.')
            .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        // Calculate role position
        const position = interaction.guild.roles.cache.size - role.position;

        // Check if the role has the administrator permission
        const hasAdmin = role.permissions.has('ADMINISTRATOR') ? 'Yes' : 'No';

        // Permissions
        const permissions = role.permissions.toArray().map(p => `\`${p}\``).join(', ');
        const permissionsDisplay = permissions.length ? permissions : 'No permissions';

        // Create an embed
        const embed = new MessageEmbed()
            .setColor(role.color)
            .setTitle('Role Information')
            .addFields(
                { name: 'Role', value: `<@&${role.id}>`, inline: false },
                { name: 'Role ID', value: role.id, inline: false },
                { name: 'Role Position', value: `${position}`, inline: false },
                { name: 'Hex Code', value: `#${role.color.toString(16).padStart(6, '0')}`, inline: false }, // Display hex code of the role color
                { name: 'Administrator', value: hasAdmin, inline: false },
                { name: 'Permissions', value: permissionsDisplay, inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });


        // Add role icon if it exists
        if (role.icon) {
            const iconUrl = `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png`;
            embed.setThumbnail(iconUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
