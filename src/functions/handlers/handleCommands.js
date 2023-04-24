// const commandFolders = `${__dirname}../../../commands`; for non-panels

// Importing the modules
import { REST, Routes } from "discord.js";
import { promises as fs } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

// Getting the current file path
const __filename = fileURLToPath(import.meta.url);
// Getting the current directory path
const __dirname = dirname(__filename);

// Exporting the function
export default async (client) => {
    // Defining the handleCommands function
    client.handleCommands = async () => {
        // Getting all the folders in the commands folder
        const commandFolders = await fs.readdir(
            `${__dirname}/../../commands`,
        );

        // Looping through all the folders
        for (const folder of commandFolders) {
            // Getting all the files in the folder
            const commandFiles = (
                await fs.readdir(`${__dirname}/../../commands/${folder}`)
            ).filter((file) => file.endsWith(".js"));
            // Defining the commands and commandArray variables
            const { commands, commandArray } = client;

            // Looping through all the files
            for (const file of commandFiles) {
                // Importing the command
                const { default: command } = await import(
                    `../../commands/${folder}/${file}`
                );
                // Setting the command in the commands collection
                commands.set(command.data.name, command);
                // Pushing the command data to the commandArray
                commandArray.push(command.data.toJSON());

                // Logging the command name in green color
                console.log(
                    chalk.green(
                        `[Commands]: Loaded ${command.data.name} command.`,
                    ),
                );
            }
        }
        // Defining the client id
        const clientId = "736561919292473454";
        /* Defining the guild id
        const guildId = '795473336998035486'; 
        */
        // Defining the rest variable and setting the token and version
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        try {
            // Logging the refreshing application commands
            console.log(
                chalk.cyan(
                    `[Commands] Started refreshing application (/) commands.`,
                ),
            );

            // Putting the application commands
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray,
            });

            // Logging the refreshing application commands
            console.log(
                chalk.cyan(
                    `[Commands] Successfully reloaded application (/) commands.`,
                ),
            );
        } catch (error) {
            // Logging the error
            console.error(error);
        }
    };
};
