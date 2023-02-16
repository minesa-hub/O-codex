import colors from 'colors';

export default {
    name: "ready",
    once: true,
    async execute(client) {
        // Initiates the manager and connects to all the nodes
        client.manager.init(client.user.id);
        // The bot starts, and logs in, successfully.
        console.log(`[READY] Logged in as ${client.user.tag}!`.green);

        // Fetching the message on rules channel to bot does not die from restart.
        client.channels.cache.get('889266702620176434').messages.fetch('1075866763616604170');
    },
};
