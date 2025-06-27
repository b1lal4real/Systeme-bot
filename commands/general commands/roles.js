const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');

module.exports = {
    name: 'roles',
    description: 'Displays all roles in the server.',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.reply('You do not have permission to view roles.');
        }

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
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

        const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [row] });

        const filter = (i) => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'previousbtn' && currentPage !== 0) {
                currentPage--;
            } else if (i.customId === 'nextbtn' && currentPage < pages.length - 1) {
                currentPage++;
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
            msg.edit({ components: [disabledRow] });
        });
    }
};
