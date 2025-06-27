const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const AutoReact = require('../../models/autoReactModel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeautoreact')
        .setDescription('Remove auto react for a member.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to remove auto react from')
                .setRequired(true)),

    async execute(interaction) {
        // التحقق من صلاحيات العضو
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetMember = interaction.options.getMember('member');

        // محاولة إزالة رد الفعل التلقائي من قاعدة البيانات
        try {
            const removedAutoReact = await AutoReact.findOneAndDelete({ memberId: targetMember.id });
            if (!removedAutoReact) {
                return interaction.reply({ content: 'This member does not have an auto react set.', ephemeral: true });
            }
            return interaction.reply({ content: 'Auto react removed successfully.', ephemeral: false });
        } catch (error) {
            console.error('Error removing auto react:', error);
            return interaction.reply({ content: 'An error occurred while removing auto react.', ephemeral: true });
        }
    }
};
