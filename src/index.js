// Importing the required modules
import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js";
import { connect } from "mongoose";
import fs from "fs";
import { config } from "dotenv";
// calling the config function from the dotenv module
config();

// Getting the token and database uri from the .env
const { TOKEN, DATABASE_URI } = process.env;
// Defining the client
const client = new Client({
    // Defining the intents
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildScheduledEvents,
    ],
    // Defining the partials
    partials: [
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
    // Defining the bot presence and activity
    presence: {
        status: "dnd",
        activities: [
            {
                name: "What is happening? 👀",
                type: ActivityType.Watching,
            },
        ],
    },
});

// Collections
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

// defining the function folders variable
const functionFolders = fs.readdirSync("./src/functions");

// looping through all the folders
for (const folder of functionFolders) {
    // functionFiles variable to get all the files in the folder
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));

    // looping through all the files
    for (const file of functionFiles) {
        // importing the function
        const { default: func } = await import(`./functions/${folder}/${file}`);
        // calling the function
        func(client);
    }
}

// defining the functions that calling the functions/handlers
client.handleCommands();
client.handleEvents();
client.handleComponents();

// logging the bot in with the token
client.login(TOKEN);

// connecting to the database with the database uri and catching the error
(async () => {
    await connect(DATABASE_URI).catch(console.error);
})();
