// Importing the required modules
import { Events } from "discord.js";
import chalk from "chalk";

// Exporting the event
export default {
    // The event name
    name: Events.ClientReady,
    // The event is once?
    once: true,
    // The event execute function
    execute: async (client) => {
        // Logging the client tag in green color
        console.log(chalk.greenBright(`Logged in as ${client.user.tag}!`));
    },
};
