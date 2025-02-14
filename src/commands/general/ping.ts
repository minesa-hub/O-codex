import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";

interface CommandExecuteArgs {
    interaction: ChatInputCommandInteraction;
    client: Client;
}

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute({ interaction }: CommandExecuteArgs) {
        try {
            await interaction.reply("Pong!");
        } catch (error) {
            console.error("Error replying to the interaction:", error);
        }
    },
};
