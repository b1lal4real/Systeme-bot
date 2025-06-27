const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user with a reason and log it to the database.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(true)),
    
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: 'You do not have permissions to warn users.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const embed = new MessageEmbed()
            .setTitle('Warning')
            .setDescription(`You have been warned in ${interaction.guild.name}`)
            .addField('Reason', reason)
            .addField('Date', new Date().toLocaleDateString())
            .setColor('YELLOW');

        // Try to send a DM to the user
        user.send({ embeds: [embed] }).catch(error => console.log(`Failed to send DM: ${error}`));

        // Save the warning in the database
        try {
            await GuildSettings.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { $push: { warnings: { userId: user.id, reason: reason, warnedBy: interaction.user.id } } },
                { new: true, upsert: true }
            );
            interaction.reply({ content: `Successfully warned ${user.tag} for: ${reason}`, ephemeral: false });
        } catch (error) {
            console.error('Error saving the warning to the database:', error);
            interaction.reply({ content: 'Failed to save the warning to the database.', ephemeral: true });
        }
    }
};
