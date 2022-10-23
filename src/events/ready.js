export default {
    name: "ready",
    once: true,
    execute: client => {
        // Fetching the message on rules channel to bot does not die from restart.
        client.channels.cache.get("889266702620176434").messages.fetch("1030252706696269854");
    },
};
