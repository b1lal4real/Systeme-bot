const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/verif'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vb')
        .setDescription('Verify a user if not already verified.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to verify')
                .setRequired(false)), // Make this optional to allow self-verification as well
    
    async execute(interaction) {
        // Check if the user has the Manage Roles permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to verify members.', ephemeral: true });
        }

        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!settings) {
            return interaction.reply({ content: 'Verification settings not configured.', ephemeral: true });
        }

        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);
        const verifiedRole = interaction.guild.roles.cache.get(settings.verifiedRoleId);
        const unverifiedRole = interaction.guild.roles.cache.get(settings.unverifiedRoleId);
        const logChannel = interaction.guild.channels.cache.get(settings.logVerifChannelId);

        if (member.roles.cache.has(verifiedRole.id)) {
            return interaction.reply({ content: `${target.tag} is already verified.`, ephemeral: true });
        }

        await member.roles.add(verifiedRole);
        if (unverifiedRole) {
            await member.roles.remove(unverifiedRole);
        }

        const embed = new MessageEmbed()
            .setColor('#34D399') // A green color
            .setTitle('Verification Successful')
            .setDescription(`${target.tag} has been successfully verified!`)
            .setThumbnail(target.displayAvatarURL())
            .setImage(interaction.guild.bannerURL({ size: 2048, dynamic: true, format: 'png' }) || null)
            .addField('Verified At', `<t:${Math.floor(Date.now() / 1000)}:R>`, false)
            .addField('Verified By', `${interaction.user.tag}`, false);

        // Button row with a disabled button showing the server name
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(interaction.guild.name) // Server name
                .setStyle('SECONDARY')
                .setCustomId('server-name') // Custom ID is required
                .setDisabled(true) // Disable the button
        );

        // Send a private message if possible
        member.send({ embeds: [embed], components: [row] }).catch(console.error);

        const logEmbed = new MessageEmbed()
            .setColor('#2563EB') // A blue color
            .setTitle('New Verification')
            .setDescription(`${target.tag} has been verified by ${interaction.user.tag}.`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}:R>`, false);

        logChannel.send({ embeds: [logEmbed] });

        interaction.reply({ content: `Verification process for ${target.tag} completed successfully.`, ephemeral: true });
    }
};
