import { Client, Collection, GatewayIntentBits } from "discord.js";

export interface ExtendedClient extends Client {
    handleCommands: () => Promise<void>;
    handleComponents: () => Promise<void>;
    buttons: Collection<string, any>;
    selectMenus: Collection<string, any>;
    modals: Collection<string, any>;
    commands: Collection<string, any>;
    commandArray: any[];
}

export const client = Object.assign(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    }),
    {
        buttons: new Collection<string, any>(),
        selectMenus: new Collection<string, any>(),
        modals: new Collection<string, any>(),
        commands: new Collection<string, any>(),
        commandArray: [],
        handleCommands: async () => {
            Promise<void>;
        },
        handleComponents: async () => {
            Promise<void>;
        },
    }
) as ExtendedClient;
