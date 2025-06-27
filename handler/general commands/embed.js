const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, WebhookClient, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create an embed via bot or webhook')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Choose the method to send the embed: bot or webhook')
                .setRequired(true)
                .addChoices(
                    { name: 'Bot', value: 'bot' },
                    { name: 'Webhook', value: 'webhook' }
                ))
        .addStringOption(option => 
            option.setName('footer_text')
                .setDescription('Footer text')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('footer_icon')
                .setDescription('URL of the footer icon')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('author_name')
                .setDescription('Author name')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('author_url')
                .setDescription('URL of the author link')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('thumbnail')
                .setDescription('URL of the thumbnail image')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('image')
                .setDescription('URL of the image')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Name for webhook')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('avatar')
                .setDescription('Avatar URL for webhook')
                .setRequired(false)),
    async execute(interaction) {
        // التحقق من صلاحيات العضو
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const type = interaction.options.getString('type');
        const footerText = interaction.options.getString('footer_text');
        const footerIcon = interaction.options.getString('footer_icon');
        const authorName = interaction.options.getString('author_name');
        const authorUrl = interaction.options.getString('author_url');
        const thumbnail = interaction.options.getString('thumbnail');
        const image = interaction.options.getString('image');
        const name = interaction.options.getString('name');
        const avatar = interaction.options.getString('avatar');

        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(Math.floor(Math.random() * 16777215).toString(16))
            .setDescription(description)
            .setFooter(footerText || '', footerIcon || undefined)
            .setAuthor(authorName || '', authorUrl || undefined)
            .setThumbnail(thumbnail || undefined)
            .setImage(image || undefined);

        if (type === 'bot') {
            await interaction.reply({ embeds: [embed] });
        } else if (type === 'webhook') {
            const channel = interaction.channel;
            const webhook = await channel.createWebhook(name || 'Webhook', {
                avatar: avatar,
                reason: 'Needed a webhook for sending embed'
            });
            const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

            await webhookClient.send({ embeds: [embed] });
            webhookClient.destroy();
            await interaction.reply({ content: 'Embed sent via webhook!', ephemeral: true });
        }
    }
};
