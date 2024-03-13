import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js";
// import { connect } from "mongoose";
import fs from "fs";
import { config } from "dotenv";
import { setRPC } from "./rpc.js";
import { music_note } from "./shortcuts/emojis.js";

config();
setRPC();

const {
    TOKEN,
    // DATABASE_URI
} = process.env;

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
        status: "idle",
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

// music starts
const player = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    leaveOnEmpty: false,
    emptyCooldown: 0,
    emitAddSongWhenCreatingQueue: true,
    plugins: [new SpotifyPlugin()],
});

let queueVarCallback;
player.on("addSong", (queue, song) => {
    let message = `## ${music_note} Added new song\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Requested by:**__ ${song.user}`;

    if (queueVarCallback) {
        queueVarCallback(message);
    }
});

export function waitForQueueVar(callback) {
    queueVarCallback = callback;
}
export default player;
// music finished

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
// (async () => {
//     await connect(DATABASE_URI).catch(console.error);
// })();
