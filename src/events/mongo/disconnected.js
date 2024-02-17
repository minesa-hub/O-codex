import chalk from "chalk";

export default {
    name: "disconnected",
    execute() {
        console.log(chalk.yellowBright("Disconnected from MongoDB!"));
    },
};
