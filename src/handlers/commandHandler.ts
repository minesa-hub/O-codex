import {
    ContextMenuCommandBuilder,
    REST,
    Routes,
    SlashCommandBuilder,
    Client,
} from "discord.js";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ExtendedClient extends Client {
    handleCommands: () => Promise<void>;
    commands: Map<string, any>;
    commandArray: any[];
}

export const loadCommands = (client: ExtendedClient) => {
    // Map ve Array'i başlat
    client.commands = new Map();
    client.commandArray = [];

    client.handleCommands = async () => {
        try {
            console.log("[Commands] Starting to load command folders...");

            const commandsPath = join(process.cwd(), "src", "commands");
            const commandFolders = await fs.readdir(commandsPath);

            console.log("[Commands] Command folders found:", commandFolders);

            for (const folder of commandFolders) {
                const folderPath = join(commandsPath, folder);
                const commandFiles = (await fs.readdir(folderPath)).filter(
                    (file) => file.endsWith(".ts")
                );

                console.log(
                    `[Commands] Command files found in ${folder}:`,
                    commandFiles
                );

                for (const file of commandFiles) {
                    try {
                        console.log(
                            `[Commands] Importing command from file: ${file}`
                        );

                        const filePath = join(folderPath, file);
                        const fileUrl = `file://${filePath}`;

                        const { default: command } = await import(fileUrl);

                        if (!command.data || !command.execute) {
                            console.log(
                                `[Commands] Invalid command in ${file}`
                            );
                            continue;
                        }

                        client.commands.set(command.data.name, command);

                        if (
                            command.data instanceof SlashCommandBuilder ||
                            command.data instanceof ContextMenuCommandBuilder
                        ) {
                            client.commandArray.push(command.data.toJSON());
                        } else {
                            client.commandArray.push(command.data);
                        }

                        console.log(
                            `[Commands]: Loaded ${command.data.name} command.`
                        );
                    } catch (error) {
                        console.error(
                            `[Commands] Error loading ${file}:`,
                            error
                        );
                    }
                }
            }

            // Discord API'ye komutları kaydet
            const { CLIENT_TOKEN: token, CLIENT_ID: clientId } = process.env;

            if (!token || !clientId) {
                throw new Error("Missing environment variables");
            }

            const rest = new REST({ version: "10" }).setToken(token);

            try {
                console.log(
                    "[Commands] Started refreshing application commands."
                );

                await rest.put(Routes.applicationCommands(clientId), {
                    body: client.commandArray,
                });

                console.log(
                    "✅ | [Commands] Successfully reloaded application commands."
                );
            } catch (error) {
                console.error("[Commands] Error refreshing commands:", error);
            }
        } catch (error) {
            console.error("[Commands] Fatal error:", error);
        }
    };
};
