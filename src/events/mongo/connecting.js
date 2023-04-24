// Import the chalk package
import chalk from "chalk";

// Export the event
export default {
    // The event name
    name: "connecting",
    // execute function
    execute: () => {
        // Log that the bot is connecting to MongoDB
        console.log(chalk.blueBright("[Mongoose]: Connecting to MongoDB!"));
    },
};
