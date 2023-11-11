import { Events } from "discord.js";
import chalk from "chalk";

export default {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(chalk.greenBright(`Logged in as ${client.user.tag}!`));
    },
};
