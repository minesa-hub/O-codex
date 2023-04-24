// Importing chalk for coloring the console
import chalk from "chalk";

// Exporting the event
export default {
    // The event name
    name: "err",
    // execute function
    execute: (err) => {
        // Log the error
        console.log(chalk.red(`[Mongoose]: ${err}`));
    },
};
