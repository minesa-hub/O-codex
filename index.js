import { Client, Partials, GatewayIntentBits, Collection } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
    presence: {
        activities: [
            {
                name: "me cool!",
                type: 0,
            },
        ],
        status: "dnd",
    },
});
import config from "./src/config.js";
import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

const token = process.env.TOKEN || config.client_token;

client.commands = new Collection();

const log = l => {
    console.log(`${l}`);
};

// command-handler
const commands = [];
readdirSync(`./src/commands`).forEach(async file => {
    const command = await import(`./src/commands/${file}`).then(c => c.default);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
});

const rest = new REST({ version: "10" }).setToken(token);

client.on("ready", async () => {
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: commands,
        });

        log(`${client.commands.size} commands added and refreshed!`);
    } catch (error) {
        console.error(error);
    }
    log(`${client.user.username} is now online!`);
});

// event-handler
readdirSync("./src/events").forEach(async file => {
    const event = await import(`./src/events/${file}`).then(x => x.default);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});
//

client.login(token);
