// Importing the modules
import { Client, Collection, ActivityType } from 'discord.js';
import { Manager } from 'erela.js';
import fs from 'fs';
import config from './config.js';

// Creating a new client
const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildVoiceStates', 'GuildMembers'],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    presence: {
        activities: [{ name: 'Spotify', type: ActivityType.Listening }],
        status: 'dnd',
    },
});

// Creating nodes for the manager
const nodes = [
    {
        host: config.music.lavalinkHost,
        password: config.music.lavalinkPassword,
        port: config.music.lavalinkPort,
        secure: true,
    },
];

// Assign Manager to the client variable
client.manager = new Manager({
    // The nodes to connect to, optional if using default lavalink options
    nodes,
    // Method to send voice data to Discord
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);

        if (guild) guild.shard.send(payload);
    },
});

client.manager.on('nodeConnect', (node) => {
    console.log(`Node "${node.options.identifier}" connected.`.blue);
});

client.manager.on('nodeError', (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`.red);
});

client.on('raw', (d) => client.manager.updateVoiceState(d));

// Creating a new collection for commands
client.commands = new Collection();

// Creating a new collection for application commands
const commands = fs.readdirSync('./src/commands');
const events = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));
const handlers = fs.readdirSync('./src/handlers').filter((file) => file.endsWith('.js'));

// Handling the commands
(async () => {
    for (const handler of handlers) {
        const imports = (await import(`./src/handlers/${handler}`)).default;
        imports(client);
    }
    client.handleCommands(commands, './src/commands');
    client.handleEvents(events, './src/events');
    client.login(config.token);
})();
