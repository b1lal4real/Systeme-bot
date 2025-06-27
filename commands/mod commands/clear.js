const { MessageEmbed, Permissions } = require('discord.js');

// Initialize cooldowns map if not already defined elsewhere
const cooldowns = new Map();

module.exports = {
    name: 'clear',
    description: 'Clears messages from the current channel.',
    async execute(message, args) {
        const userId = message.author.id;
        const now = Date.now();
        const cooldownAmount = 8000; // 8 seconds cooldown

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the 'clear' command.`);
            }
        }

        cooldowns.set(userId, now);

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send('You do not have permission to clear messages.');
        }

        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return message.channel.send('Please specify an amount between 1 and 100.');
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: amount });
            const deletedMessages = await message.channel.bulkDelete(messages, true);
            message.channel.send(`Successfully deleted ${deletedMessages.size} messages.`).then(sentMsg => {
                setTimeout(() => sentMsg.delete(), 5000);  // Deletes the confirmation message after 5 seconds
            });
        } catch (error) {
            console.error('Error deleting messages:', error);
            message.channel.send('Failed to delete messages. Ensure messages are not older than 2 weeks.');
        }
    }
};
