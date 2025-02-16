import {
    ContextMenuCommandBuilder,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";
import { promises as fs } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loadCommands = async (client) => {
    client.handleCommands = async () => {
        const commandFolders = await fs.readdir(`${__dirname}/../../commands`);

        for (const folder of commandFolders) {
            const commandFiles = (
                await fs.readdir(`${__dirname}/../../commands/${folder}`)
            ).filter((file) => file.endsWith(".js"));
            const { commands, commandArray } = client;

            for (const file of commandFiles) {
                const { default: command } = await import(
                    `../../commands/${folder}/${file}`
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

                console.log(
                    chalk.green(
                        `[Commands]: Loaded ${command.data.name} command.`
                    )
                );
            }
        }

        const rest = new REST({ version: "10" }).setToken(
            process.env.CLIENT_TOKEN
        );

        try {
            console.log(
                chalk.cyan(
                    `[Commands] Started refreshing application (/) commands.`
                )
            );

            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: client.commandArray,
            });

            console.log(
                chalk.cyan(
                    `[Commands] Successfully reloaded application (/) commands.`
                )
            );
        } catch (error) {
            console.error(error);
        }
    };
};
