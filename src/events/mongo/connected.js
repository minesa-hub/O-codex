import chalk from "chalk";

export default {
    name: "connected",
    execute: () => {
        console.log(chalk.green("[Mongoose]: Connected to MongoDB!"));
    },
};
