const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Displays all roles in the server.'),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to view roles.', ephemeral: true });
        }

        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const pages = [];
        const itemsPerPage = 5;
        for (let i = 0; i < roles.length; i += itemsPerPage) {
            const items = roles.slice(i, i + itemsPerPage);
            const embed = new MessageEmbed()
                .setTitle('Server Roles')
                .setDescription(items.join('\n'))
                .setColor(Math.floor(Math.random()*16777215).toString(16))
                .setFooter({ text: `Page ${Math.floor(i / itemsPerPage) + 1} of ${Math.ceil(roles.length / itemsPerPage)}` });
            pages.push(embed);
        }

        let currentPage = 0;

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setDisabled(currentPage === 0),
            new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setDisabled(pages.length === 1)
        );

        await interaction.reply({ embeds: [pages[currentPage]], components: [row], ephemeral: false });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: "You cannot control this menu.", ephemeral: true });
                return;
            }
            
            switch (i.customId) {
                case 'previousbtn':
                    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                    break;
                case 'nextbtn':
                    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
                    break;
            }
            row.components[0].setDisabled(currentPage === 0);
            row.components[1].setDisabled(currentPage === pages.length - 1);

            await i.update({ embeds: [pages[currentPage]], components: [row] });
        });

        collector.on('end', () => {
            const disabledRow = new MessageActionRow().addComponents(
                row.components[0].setDisabled(true),
                row.components[1].setDisabled(true)
            );
            interaction.editReply({ components: [disabledRow] });
        });
    }
};
