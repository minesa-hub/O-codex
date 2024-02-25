import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js";
import { Player } from "discord-player";
import { connect } from "mongoose";
import fs from "fs";
import { config } from "dotenv";

config();

const { TOKEN, DATABASE_URI } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
    ],

    partials: [
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],

    presence: {
        status: "dnd",
        activities: [
            {
                name: "What is happening? 👀",
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
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

client.player.extractors.loadDefault();

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

client.login(TOKEN);
(async () => {
    await connect(DATABASE_URI).catch(console.error);
})();
