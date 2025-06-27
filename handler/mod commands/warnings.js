const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Displays warnings for a specified user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to display warnings for')
                .setRequired(true)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        // Fetch warnings from the database
        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        const warnings = settings ? settings.warnings.filter(w => w.userId === user.id) : [];

        if (warnings.length === 0) {
            return interaction.reply({ content: 'No warnings found for this user.', ephemeral: true });
        }

        const totalWarnings = warnings.length;
        const embeds = warnings.map((warning, index) => {
            const timestamp = Math.floor(new Date(warning.date).getTime() / 1000);
            return new MessageEmbed()
                .setTitle(`Warning #${index + 1}`)
                .addField('Reason', warning.reason)
                .addField('Date', `<t:${timestamp}:R>`)
                .setColor('YELLOW')
                .setFooter({ text: `Page ${index + 1} of ${totalWarnings}` }); // فوتر يظهر رقم الصفحة
        });

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
                .setDisabled(currentPage === embeds.length - 1)
        );

        await interaction.reply({ embeds: [embeds[currentPage]], components: [row], ephemeral: false });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async i => {
            switch (i.customId) {
                case 'previousbtn':
                    currentPage = currentPage > 0 ? --currentPage : 0;
                    break;
                case 'nextbtn':
                    currentPage = currentPage + 1 < embeds.length ? ++currentPage : currentPage;
                    break;
            }

            row.components[0].setDisabled(currentPage === 0);
            row.components[1].setDisabled(currentPage === embeds.length - 1);

            await i.update({ embeds: [embeds[currentPage]], components: [row] });
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
