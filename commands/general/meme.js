import { SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";

const memeCommand = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("— Sends a random meme from somewhere."),
    async execute(interaction) {
        // Deferring the reply
        await interaction.deferReply();

        try {
            // Fetching the meme
            const raw = await fetch("https://apis.duncte123.me/meme", { method: "GET" });
            const response = await raw.json();

            // Sending the meme
            return interaction.editReply({ content: response.data.image });
        } catch (error) {
            // Sending an error message
            return interaction.editReply({
                content: "An error occurred while fetching the meme.",
                ephemeral: true,
            });
        }
    },
};

export default memeCommand;
