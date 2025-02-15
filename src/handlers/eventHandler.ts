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
        import(join(eventsPath, file))
            .then((module) => {
                const event = module.default;

                if (!event || !event.name) {
                    console.warn(`Skipping invalid event file: ${file}`);
                    return;
                }

                if (event.once) {
                    client.once(event.name, (...args) => {
                        event.execute(...args, client); // Sırayı değiştirdik
                    });
                } else {
                    client.on(event.name, (...args) => {
                        event.execute(...args, client); // Sırayı değiştirdik
                    });
                }

                console.log(`✅ | [Events] Loaded event: ${event.name}`);
            })
            .catch((err) => {
                console.error(`Error loading event file: ${file}`, err);
            });
    }
};
