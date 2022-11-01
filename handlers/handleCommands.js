import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";
import config from "../config.js";

const handleCommands = client => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                const command = (await import(`../commands/${folder}/${file}`)).default;
                client.commandArray.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            }
        }

        const rest = new REST({ version: "10" }).setToken(config.client_token);

        (async () => {
            try {
                console.log("Started refreshing Global Application (/) commands.");
                await rest.put(Routes.applicationCommands(config.client_id), {
                    body: client.commandArray,
                });
                console.log("Successfully reloaded Global Application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    };
};

export default handleCommands;
