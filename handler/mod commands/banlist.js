const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Displays a list of banned users in the server.'),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to view the ban list.', ephemeral: true });
        }

        const banList = await interaction.guild.bans.fetch();

        if (!banList.size) {
            return interaction.reply({ content: 'There are no banned users in this server.', ephemeral: true });
        }

        const embeds = [];
        banList.forEach((ban) => {
            const createdAt = Math.floor(ban.user.createdTimestamp / 1000);
            const embed = new MessageEmbed()
                .setTitle(`Banned User: ${ban.user.tag}`)
                .addField('Username', ban.user.username, false)
                .addField('User ID', ban.user.id, false)
                .addField('Banned On', `<t:${createdAt}:R>`, false)
                .addField('Reason', ban.reason || 'No reason provided')
                .setColor('#ff4757');
            embeds.push(embed);
        });

        let currentPage = 0;

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER')
                .setDisabled(true),
            new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS')
                .setDisabled(embeds.length === 1)
        );

        const message = await interaction.reply({ embeds: [embeds[currentPage]], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async (i) => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === 'previousbtn' && currentPage !== 0) {
                    currentPage--;
                } else if (i.customId === 'nextbtn' && currentPage < embeds.length - 1) {
                    currentPage++;
                }

                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled(currentPage === embeds.length - 1);

                await i.update({ embeds: [embeds[currentPage]], components: [row] });
            } else {
                await i.reply({ content: "You cannot control this menu.", ephemeral: true });
            }
        });

        collector.on('end', () => {
            const disabledRow = new MessageActionRow().addComponents(
                row.components[0].setDisabled(true),
                row.components[1].setDisabled(true)
            );
            message.edit({ components: [disabledRow] });
        });
    }
};
