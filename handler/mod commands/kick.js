const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('The user to kick')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Reason for the kick')
            .setRequired(false)),

    // Make sure this function is marked as 'async'
    async execute(interaction) {
        // Check if the user has the kick members permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permissions to kick members.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No specified reason';

        // Fetch the member from the guild
        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user. They may have a higher role or I do not have permission.', ephemeral: true });
        }

        // Kick the member
        await member.kick(reason);

        // Inform the user in the server
        interaction.reply({ content: `${user.tag} has been kicked from the server for: ${reason}`, ephemeral: false });

        // Send a DM to the kicked user
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('You have been kicked!')
            .addField('Server', `${interaction.guild.name}`)
            .addField('Kicked by', `${interaction.user.tag}`)
            .addField('Reason', reason);

        await user.send({ embeds: [embed] }).catch(err => console.log(`Failed to send DM: ${err}`));
    }
};
