import mongoose from 'mongoose';
import config from '../../config.js'
import colors from 'colors';

const mongoURL = config.mongo;

export default {
    name: "ready",
    once: true,
    async execute(client) {
        // Checking if connected to mongo
        if (!mongoURL) return;

        mongoose.connect(mongoURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if (mongoose.connect) {
            console.log("The database is running!")
        }

        // Initiates the manager and connects to all the nodes
        client.manager.init(client.user.id);
        // The bot starts, and logs in, successfully.
        console.log(`[READY] Logged in as ${client.user.tag}!`.green);

        // Fetching the message on rules channel to bot does not die from restart.
        client.channels.cache.get('889266702620176434').messages.fetch('1075866763616604170');
    },
};
