const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Displays information about a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to display information about.')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        // Fetch user to get banner
        const fullUser = await interaction.client.users.fetch(user.id, { force: true });
        const bannerUrl = fullUser.bannerURL({ size: 2048, dynamic: true, format: 'png' });

        // Create a roles list, excluding the @everyone role
        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join('| ');

        const embed = new MessageEmbed()
            .setColor(Math.floor(Math.random() * 16777215).toString(16))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField('Username', `${user.username}#${user.discriminator}`, false)
            .addField('User ID', user.id, false)
            .addField('Joined Discord', `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, false)
            .addField('Joined Server', `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, false)
            .addField('Roles Count', `${member.roles.cache.size}`, false)
            .addField('Roles', roles.length ? roles : 'No roles', false)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        if (bannerUrl) {
            embed.setImage(bannerUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
