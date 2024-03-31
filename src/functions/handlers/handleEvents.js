import fs from "fs";
import chalk from "chalk";

export default async (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync("./src/events");

        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(`./src/events/${folder}`)
                .filter((file) => file.endsWith(".js"));

            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const { default: event } = await import(
                            `../../events/${folder}/${file}`
                        );
                        if (event.once) {
                            client.once(event.name, (...args) =>
                                event.execute(...args, client)
                            );
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`
                                )
                            );
                        } else {
                            client.on(event.name, (...args) =>
                                event.execute(...args, client)
                            );
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`
                                )
                            );
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    };
};
