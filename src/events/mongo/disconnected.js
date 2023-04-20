import chalk from "chalk";

export default {
    name: "disconnected",
    execute: () => {
        console.log(
            chalk.yellowBright("[Mongoose]: Disconnected from MongoDB!"),
        );
    },
};
