import { Events } from "discord.js";
import { saveMessageCount } from "../../shortcuts/database.js";

let LINKED_ROLE_GUILD_ID;

export default {
    name: Events.MessageCreate,
    once: false,
    execute: async (message, client) => {
        // if (message.author.bot) return;
        // LINKED_ROLE_GUILD_ID = message.guild.id;
        // saveMessageCount(message.guild.id, message.author.id);
    },
};

export { LINKED_ROLE_GUILD_ID };
