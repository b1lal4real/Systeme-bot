const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays user\'s avatar.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to display their avatar.')
                .setRequired(false)), // خيار اختياري لتحديد مستخدم آخر

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user; // إذا لم يتم تحديد مستخدم، استخدم الشخص الذي يستعمل الأمر
        
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 }); // جلب رابط الصورة بأكبر حجم متاح ودعم للصور المتحركة إذا وُجدت
        
        const embed = new MessageEmbed()
            .setTitle(`${user.tag}'s Avatar`)
            .setDescription(`[Avatar URL](${avatarUrl})`) // يمكن الضغط على الرابط لفتح الصورة في علامة تبويب جديدة
            .setImage(avatarUrl) // عرض الصورة في الإمبد
            .setColor(Math.floor(Math.random() * 16777215).toString(16)) // تعيين لون عشوائي
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }); // إضافة معلومات طالب الأمر في الفوتر

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Download Avatar')
                    .setStyle('LINK')
                    .setURL(avatarUrl) // الزر سيوجه المستخدم لرابط الصورة مباشرة للتحميل
            );

        await interaction.reply({ embeds: [embed], components: [row] }); // إرسال الإمبد مع الزر كرد
    }
};
