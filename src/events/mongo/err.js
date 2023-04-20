import chalk from "chalk";

export default {
    name: "err",
    execute: (err) => {
        console.log(chalk.red(`[Mongoose]: ${err}`));
    },
};
