import { Events } from "discord.js";
import chalk from "chalk";

export default {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(chalk.green(`[READY] Logged in as ${client.user.tag}!`));
        logTimeAndDate();
    },
};

function logTimeAndDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const formattedTime = currentDate.toTimeString().split(" ")[0];
    console.log("Current time and date:", formattedDate + " " + formattedTime);
}
