const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const { VoiceChannel } = require('discord.js');
const deletedMessages = require('./deletedMessages');
const settings = require('./settings.json');






const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); // إضافة GUILD_MESSAGES
client.commands = new Collection();
const prefix = '+';

// Load slash commands
const commands = [];
const commandsPath = path.join(__dirname, 'handler');
const commandFolders = fs.readdirSync(commandsPath);
for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if (!command.data || !command.data.name) {
            console.error(`Command '${file}' does not export a data object with a name.`);
            continue;
        }
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

// Load prefix commands
const prefixCommands = new Collection();
const prefixCommandsPath = path.join(__dirname, 'commands');
const prefixCommandFolders = fs.readdirSync(prefixCommandsPath);
for (const folder of prefixCommandFolders) {
    const folderPath = path.join(prefixCommandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        prefixCommands.set(command.name, command);
        if (command.aliases) {
            command.aliases.forEach(alias => {
                prefixCommands.set(alias, command);
            });
        }
    }
}


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});




client.on('messageDelete', message => {
    // Store the deleted message
    deletedMessages.set(message.channel.id, {
        content: message.content,
        author: message.author,
        timestamp: message.createdTimestamp,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    });
});


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Check if the user has an auto-react setting
    if (settings[message.author.id]) {
        try {
            await message.react(settings[message.author.id]);
        } catch (error) {
            console.error('❓ Error adding react:', error);
        }
    }
});


client.login(config.token);
