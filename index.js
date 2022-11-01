import { Client, Collection, ActivityType } from "discord.js";
import fs from "fs";
import config from "./config.js";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers"],
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    presence: {
        activities: [{ name: "Spotify", type: ActivityType.Listening }],
        status: "dnd",
    },
});

client.commands = new Collection();

const commands = fs.readdirSync("./commands");
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const handlers = fs.readdirSync("./handlers").filter(file => file.endsWith(".js"));

(async () => {
    for (const handler of handlers) {
        const imports = (await import(`./handlers/${handler}`)).default;
        imports(client);
    }
    client.handleCommands(commands, "./commands");
    client.handleEvents(events, "./events");
    client.login(config.client_token);
})();
