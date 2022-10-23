import { readdirSync } from "fs";

export default {
    name: "interactionCreate",
    once: false,
    execute: async interaction => {
        let client = interaction.client;

        // If the command is a slash command
        if (interaction.isChatInputCommand()) {
            if (interaction.user.bot) return;

            readdirSync("./src/commands/").forEach(async file => {
                const command = await import(`../../src/commands/${file}`).then(x => x.default);
                if (interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
                    command.run(client, interaction);
                }
            });
        }

        // If the command is a user command
        if (interaction.isUserContextMenuCommand()) {
            if (interaction.user.bot) return;

            readdirSync("./src/commands/").forEach(async file => {
                const command = await import(`../../src/commands/${file}`).then(x => x.default);
                if (interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
                    command.run(client, interaction);
                }
            });
        }

        // If the command is a message command
        if (interaction.isMessageContextMenuCommand()) {
            if (interaction.user.bot) return;

            readdirSync("./src/commands/").forEach(async file => {
                const command = await import(`../../src/commands/${file}`).then(x => x.default);
                if (interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
                    command.run(client, interaction);
                }
            });
        }
    },
};
