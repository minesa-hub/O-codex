import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js";
import fs from "fs";
import { config } from "dotenv";
config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildScheduledEvents,
    ],

    partials: [
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],

    presence: {
        status: "idle",
        activities: [
            {
                name: "What is happening? 👀",
                type: ActivityType.Custom,
            },
        ],
    },
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");

for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));

    for (const file of functionFiles) {
        const { default: func } = await import(`./functions/${folder}/${file}`);

        func(client);
    }
}

client.handleCommands();
client.handleEvents();
client.handleComponents();

client.login(process.env.CLIENT_TOKEN);
