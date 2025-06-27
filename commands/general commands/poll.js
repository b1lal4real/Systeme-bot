const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Create a poll',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a question for the poll.');
        }

        const pollEmbed = new MessageEmbed()
            .setTitle('New Poll')
            .setDescription(args.join(' '))
            .setFooter({ text: `Poll created by ${message.author.tag}` })
            .setTimestamp();

        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

        await pollMessage.react('👍'); // Reaction for "Yes"
        await pollMessage.react('👎'); // Reaction for "No"

        const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;

        const collector = pollMessage.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('end', collected => {
            let yesVotes = collected.get('👍') ? collected.get('👍').count - 1 : 0;
            let noVotes = collected.get('👎') ? collected.get('👎').count - 1 : 0;

            pollMessage.edit({ content: `Poll ended. Yes: ${yesVotes}, No: ${noVotes}`, embeds: [] });
        });
    },
};
