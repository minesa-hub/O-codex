// Importing the modules
import { Client, Collection, ActivityType } from "discord.js";
import fs from "fs";
import config from "./config.js";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";

// Creating a new client
const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers"],
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    presence: {
        activities: [{ name: "Spotify", type: ActivityType.Listening }],
        status: "dnd",
    },
});

// Creating a new collection for commands
client.commands = new Collection();

client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
    ],
});

// Creating a new collection for application commands
const commands = fs.readdirSync("./commands");
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const handlers = fs.readdirSync("./handlers").filter(file => file.endsWith(".js"));

// Handling the commands
(async () => {
    for (const handler of handlers) {
        const imports = (await import(`./handlers/${handler}`)).default;
        imports(client);
    }
    client.handleCommands(commands, "./commands");
    client.handleEvents(events, "./events");
    client.login(config.client_token);
})();
