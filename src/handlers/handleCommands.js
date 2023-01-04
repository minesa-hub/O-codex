import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { readdirSync } from 'fs';
import config from '../../config.js';
import colors from 'colors';

// Create a new REST instance
const handleCommands = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(`${path}/${folder}`).filter((file) =>
                file.endsWith('.js'),
            );

            for (const file of commandFiles) {
                const command = (await import(`../commands/${folder}/${file}`).then(command => command.default));

                console.log(`[COMMAND] ${command.data.name} loaded.`.underline.green);
                client.commandArray.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            }
        }

        const rest = new REST({ version: '10' }).setToken(config.token);

        (async () => {
            try {
                console.log('[REFRESHING] Global Application (/) commands.');
                await rest.put(Routes.applicationCommands(config.clientId), {
                    body: client.commandArray,
                });
                console.log(`[RELOADED] ${client.commands.size} commands loaded.`.red);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};

export default handleCommands;
