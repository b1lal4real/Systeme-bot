const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSettings = require('../../models/verif'); // تأكد من استخدام المسار الصحيح

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vg')
        .setDescription('Verify a user as a girl if not already verified.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to verify as a girl')
                .setRequired(false)), // Make this optional to allow self-verification
    
    async execute(interaction) {
        // Ensure the user has the Manage Roles permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to manage roles and verify members.', ephemeral: true });
        }

        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!settings) {
            return interaction.reply({ content: 'Verification settings not configured.', ephemeral: true });
        }

        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);
        const verifiedRole = interaction.guild.roles.cache.get(settings.verifiedRoleId);
        const verifiedGirlRole = interaction.guild.roles.cache.get(settings.verifiedGirlRoleId);
        const unverifiedRole = interaction.guild.roles.cache.get(settings.unverifiedRoleId);
        const logChannel = interaction.guild.channels.cache.get(settings.logVerifChannelId);

        if (member.roles.cache.has(verifiedRole.id)) {
            return interaction.reply({ content: `${target.tag} is already verified.`, ephemeral: true });
        }

        await member.roles.add([verifiedRole, verifiedGirlRole]);
        await member.roles.remove(unverifiedRole);

        const embed = new MessageEmbed()
            .setColor('#FF69B4') // A pink color
            .setTitle('Verification Successful')
            .setDescription(`${target.tag} has been successfully verified as a verified girl!`)
            .setThumbnail(target.displayAvatarURL())
            .setImage(interaction.guild.bannerURL({ size: 2048, dynamic: true, format: 'png' }) || null)
            .addField('Verified At', `<t:${Math.floor(Date.now() / 1000)}:R>`, false)
            .addField('Verified By', `${interaction.user.tag}`, false);

        // Button row with a disabled button showing the server name
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(interaction.guild.name) // Server name
                .setStyle('SECONDARY')
                .setCustomId('send from : ') // Custom ID is required, even if the button is disabled
                .setDisabled(true) // Disable the button
        );

        // Send a private message if possible
        member.send({ embeds: [embed], components: [row] }).catch(console.error);

        const logEmbed = new MessageEmbed()
            .setColor('#FF69B4')
            .setTitle('New Girl Verification')
            .setDescription(`${target.tag} has been verified as a girl by ${interaction.user.tag}.`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}:R>`, false);

        logChannel.send({ embeds: [logEmbed] });

        interaction.reply({ content: `Verification process for ${target.tag} completed successfully as a verified girl.`, ephemeral: true });
    }
};
