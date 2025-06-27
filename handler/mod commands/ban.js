const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('Duration of the ban in days')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const time = interaction.options.getInteger('time') || 0; // Default to 0 if not provided

        // Check if the executor has permissions to ban
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        try {
            // Check if the user is a member of the guild
            if (!interaction.guild.members.cache.has(user.id)) {
                return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
            }

            // Fetch the member
            const member = await interaction.guild.members.fetch(user.id);
            if (!member) {
                return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
            }

            const deleteMessagesDays = time > 7 ? 7 : time; // Ensure we do not exceed the Discord API limit

            // Ban the user
            await member.ban({ days: deleteMessagesDays, reason: reason });

            // Confirmation message to the executor
            await interaction.reply({ content: `${user.tag} has been banned from the server.` });

            // Send embed to the banned user
            const banEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('You have been banned!')
                .addField('Server', `${interaction.guild.name}`)
                .addField('Banned by', `${interaction.user.tag}`)
                .addField('Reason', `${reason}`)
                .addField('Time', `<t:${Math.floor(Date.now() / 1000) + (deleteMessagesDays * 86400)}:R>`); // Using a relative timestamp
            
            await user.send({ embeds: [banEmbed] }).catch(e => console.log("Could not send message to user."));
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to ban the user.', ephemeral: true });
        }
    }
};
