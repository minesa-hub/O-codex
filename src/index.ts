import {
    botLogin,
    loadEvents,
    client,
    loadCommands,
    loadComponents,
} from "./config/exports.ts";

async function initializeApp() {
    try {
        loadEvents(client);
        loadCommands(client);
        loadComponents(client);

        if (typeof client.handleCommands === "function") {
            await client.handleCommands();
        } else {
            console.warn("handleCommands is not defined on the client.");
        }

        await botLogin();

        console.log("Application initialized successfully.");
    } catch (error) {
        console.error("Error during application initialization:", error);
    } finally {
        console.log("Initialization process has ended.");
    }
}

initializeApp();
