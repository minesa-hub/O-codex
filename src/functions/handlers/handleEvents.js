// Import the fs package and the chalk package
import fs from "fs";
import chalk from "chalk";

// Importing the mongoose package and destructuring the connection property
import mongoose from "mongoose";
const { connection } = mongoose;

// Exporting the function
export default async (client) => {
    // Defining the handleEvents function
    client.handleEvents = async () => {
        // Getting all the folders in the events folder
        const eventFolders = fs.readdirSync("./src/events");

        // Looping through all the folders
        for (const folder of eventFolders) {
            // Getting all the files in the folder
            const eventFiles = fs
                .readdirSync(`./src/events/${folder}`)
                .filter((file) => file.endsWith(".js"));

            // Switching through the folder name
            switch (folder) {
                // If the folder name is client
                case "client":
                    // Looping through all the files
                    for (const file of eventFiles) {
                        // Importing the event
                        const { default: event } = await import(
                            `../../events/${folder}/${file}`
                        );

                        // Checking if the event is once
                        if (event.once) {
                            // If the event is once, then add the event to the client once collection
                            client.once(event.name, (...args) =>
                                event.execute(...args, client),
                            );

                            // Logging the event name in green color
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`,
                                ),
                            );
                        } else {
                            // If the event is not once, then add the event to the client on collection
                            client.on(event.name, (...args) =>
                                event.execute(...args, client),
                            );

                            // Logging the event name in green color
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`,
                                ),
                            );
                        }
                    }
                    break;

                // If the folder name is mongo
                case "mongo":
                    // Looping through all the files
                    for (const file of eventFiles) {
                        // Importing the event
                        const { default: event } = await import(
                            `../../events/${folder}/${file}`
                        );

                        // Checking if the event is once
                        if (connection.once) {
                            // If the event is once, then add the event to the connection once collection
                            connection.once(event.name, (...args) =>
                                event.execute(...args, client),
                            );

                            // Logging the event name in green color
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`,
                                ),
                            );
                        } else {
                            // If the event is not once, then add the event to the connection on collection
                            connection.on(event.name, (...args) =>
                                event.execute(...args, client),
                            );

                            // Logging the event name in green color
                            console.log(
                                chalk.green(
                                    `[Events]: Loaded ${event.name} event.`,
                                ),
                            );
                        }
                    }
                    break;
                // If the folder name is not client or mongo
                default:
                    // do nothing again :D
                    break;
            }
        }
    };
};
