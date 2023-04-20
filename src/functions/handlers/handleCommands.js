import { REST, Routes } from 'discord.js';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
    client.handleCommands = async () => {
        const commandFolders = await fs.readdir(`${__dirname}../../../commands`);

        for (const folder of commandFolders) {
            const commandFiles = (
                await fs.readdir(`${__dirname}../../../commands/${folder}`)
            ).filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const { default: command } = await import(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());

                console.log(chalk.green(`[Commands]: Loaded ${command.data.name} command.`));
            }
        }

        const clientId = '736561919292473454';
        // const guildId = '795473336998035486';
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            console.log(chalk.cyan(`[Commands] Started refreshing application (/) commands.`));
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray,
            });

            console.log(chalk.cyan(`[Commands] Successfully reloaded application (/) commands.`));
        } catch (error) {
            console.error(error);
        }
    };
};
