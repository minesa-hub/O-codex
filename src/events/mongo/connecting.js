import chalk from "chalk";

export default {
    name: "connecting",
    execute: () => {
        console.log(chalk.blueBright("[Mongoose]: Connecting to MongoDB!"));
    },
};
