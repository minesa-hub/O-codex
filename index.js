// Importing the modules
import { Client, Collection, ActivityType } from "discord.js";
import { Manager } from "erela.js";
import fs from "fs";
import config from "./config.js";

// Creating a new client
const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers"],
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    presence: {
        activities: [{ name: "Spotify", type: ActivityType.Listening }],
        status: "dnd",
    },
});

// Creating nodes for the manager
const nodes = [
    {
        host: config.music.lavalink_host,
        password: config.music.lavalink_password,
        port: config.music.lavalink_port,
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

// Emitted whenever a node connects
client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`);
});

// Emitted whenever a node encountered an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`);
});

// THIS IS REQUIRED. Send raw events to Erela.js
client.on("raw", d => client.manager.updateVoiceState(d));

// Creating a new collection for commands
client.commands = new Collection();

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
