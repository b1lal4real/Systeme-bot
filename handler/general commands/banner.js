const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Displays a user\'s banner.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to get the banner for')
            .setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        try {
            const fullUser = await interaction.client.users.fetch(user.id, { force: true });
            const bannerUrl = fullUser.bannerURL({ size: 2048, dynamic: true, format: 'png' });

            if (bannerUrl) {
                const embed = new MessageEmbed()
                    .setTitle(`${user.tag}'s Banner`)
                    .setImage(bannerUrl)
                    .setDescription(`[Banner URL](${bannerUrl})`)
                    .setColor(Math.floor(Math.random() * 16777215).toString(16))
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Download Banner')
                            .setStyle('LINK')
                            .setURL(bannerUrl)
                    );

                await interaction.reply({ embeds: [embed], components: [row] });
            } else {
                await interaction.reply(`${user.tag} does not have a banner.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to retrieve user data.');
        }
    }
};
