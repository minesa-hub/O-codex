import { readdirSync } from "fs";
import { join } from "path";
import { Client } from "discord.js";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const loadEvents = (client: Client) => {
    const eventsPath = join(__dirname, "../events");
    const eventFiles = readdirSync(eventsPath).filter((file) =>
        file.endsWith(".ts")
    );

    console.log(`Loading ${eventFiles.length} events...`);

    for (const file of eventFiles) {
        // Use dynamic import instead of require
        import(join(eventsPath, file))
            .then((module) => {
                const event = module.default;

                if (!event || !event.name) {
                    console.warn(`Skipping invalid event file: ${file}`);
                    return;
                }

                if (event.once) {
                    client.once(event.name, (...args) =>
                        event.execute(client, ...args)
                    );
                } else {
                    client.on(event.name, (...args) =>
                        event.execute(client, ...args)
                    );
                }

                console.log(`✅ | [Events] Loaded event: ${event.name}`);
            })
            .catch((err) => {
                console.error(`Error loading event file: ${file}`, err);
            });
    }
};
