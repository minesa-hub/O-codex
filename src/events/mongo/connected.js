// Import the chalk package
import chalk from "chalk";

// Export the event
export default {
    // The event name
    name: "connected",
    // execute function
    execute: () => {
        // Log that the bot is connected to MongoDB
        console.log(chalk.green("[Mongoose]: Connected to MongoDB!"));
    },
};
