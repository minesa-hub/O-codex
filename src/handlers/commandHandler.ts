import {
    ContextMenuCommandBuilder,
    REST,
    Routes,
    SlashCommandBuilder,
    Client,
} from "discord.js";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

interface ExtendedClient extends Client {
    handleCommands: () => Promise<void>;
}

export const loadCommands = (client: ExtendedClient) => {
    client.handleCommands = async () => {
        console.log("[Commands] Starting to load command folders...");

        const commandFolders = await fs.readdir(
            `${process.cwd()}/src/commands`
        );
        console.log("[Commands] Command folders found:", commandFolders);

        for (const folder of commandFolders) {
            const folderPath = `${process.cwd()}/src/commands/${folder}`;
            const commandFiles = (await fs.readdir(folderPath)).filter((file) =>
                file.endsWith(".ts")
            );
            console.log(
                `[Commands] Command files found in ${folder}:`,
                commandFiles
            );

            const { commands, commandArray } = client as unknown as {
                commands: Map<string, any>;
                commandArray: any[];
            };

            for (const file of commandFiles) {
                console.log(`[Commands] Importing command from file: ${file}`);
                const { default: command } = await import(
                    `../../src/commands/${folder}/${file}`
                );

                commands.set(command.data.name, command);

                if (
                    command.data instanceof SlashCommandBuilder ||
                    command.data instanceof ContextMenuCommandBuilder
                ) {
                    commandArray.push(command.data.toJSON());
                } else {
                    commandArray.push(command.data);
                }

                console.log(`[Commands]: Loaded ${command.data.name} command.`);
            }
        }

        const token = process.env.CLIENT_TOKEN;
        if (!token) {
            throw new Error(
                "CLIENT_TOKEN is not defined in the environment variables."
            );
        }
        const rest = new REST({ version: "10" }).setToken(token);

        try {
            console.log(`[Commands] Started refreshing application commands.`);

            const clientId = process.env.CLIENT_ID;
            if (!clientId) {
                throw new Error(
                    "CLIENT_ID is not defined in the environment variables."
                );
            }
            await rest.put(Routes.applicationCommands(clientId), {
                body: (client as unknown as { commandArray: any[] })
                    .commandArray,
            });

            console.log(
                `✅ | [Commands] Successfully reloaded application commands.`
            );
        } catch (error) {
            console.error(error);
        }
    };
};
