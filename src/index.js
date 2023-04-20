import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { connect } from 'mongoose';
import fs from 'fs';
import { config } from 'dotenv';
config();

const { TOKEN, DATABASE_URI } = process.env;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildScheduledEvents,
    ],
    partials: [Partials.GuildMember, Partials.GuildScheduledEvent],
    presence: {
        status: 'dnd',
        activities: [
            {
                name: 'What is happening? 👀',
                type: ActivityType.Watching,
            },
        ],
    },
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith('.js'));

    for (const file of functionFiles) {
        const { default: func } = await import(`./functions/${folder}/${file}`);
        func(client);
    }
}

client.handleCommands();
client.handleEvents();
client.handleComponents();
client.login(TOKEN);
(async () => {
    await connect(DATABASE_URI).catch(console.error);
})();
