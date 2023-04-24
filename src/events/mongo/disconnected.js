// Import the chalk package
import chalk from "chalk";

// Export the event
export default {
    // The event name
    name: "disconnected",
    // execute function
    execute: () => {
        // Log that the bot is disconnected from MongoDB
        console.log(
            chalk.yellowBright("[Mongoose]: Disconnected from MongoDB!"),
        );
    },
};
