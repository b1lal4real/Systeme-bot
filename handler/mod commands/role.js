const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Assigns or removes a role from a user.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Choose to add or remove the role')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                ))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to modify the role for')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to add or remove')
                .setRequired(true)),
    
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = await interaction.guild.members.fetch(user.id);

        switch (action) {
            case 'add':
                if (member.roles.cache.has(role.id)) {
                    return interaction.reply({ content: 'This user already has the role.', ephemeral: true });
                }
                await member.roles.add(role);
                interaction.reply({ content: `Successfully added the role ${role.name} to ${user.tag}.`, ephemeral: true });
                break;
            case 'remove':
                if (!member.roles.cache.has(role.id)) {
                    return interaction.reply({ content: 'This user does not have the role.', ephemeral: true });
                }
                await member.roles.remove(role);
                interaction.reply({ content: `Successfully removed the role ${role.name} from ${user.tag}.`, ephemeral: true });
                break;
            default:
                interaction.reply({ content: 'Invalid action provided.', ephemeral: true });
                break;
        }
    }
};
