// Importing the required modules
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";
import { alertEmoji } from "../../shortcuts/emojis.js";

// Exporting the command
export default {
    // The command data
    data: new SlashCommandBuilder()
        .setName("send")
        .setNameLocalizations({
            ChineseCN: "显示",
            it: "mostra",
            tr: "mim",
        })
        .setDescription("Send a random meme from somewhere to enjoy!")
        .setDescriptionLocalizations({
            ChineseCN: "从某处发送一个随机梗图!",
            it: "Invia un meme casuale da qualche parte!",
            tr: "Rastgele bir mim gönder!",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("meme")
                .setNameLocalizations({
                    ChineseCN: "梗图",
                    it: "meme",
                    tr: "göster",
                })
                .setDescription("Send a random meme from somewhere to enjoy!")
                .setDescriptionLocalizations({
                    ChineseCN: "从某处发送一个随机梗图!",
                    it: "Invia un meme casuale da qualche parte!",
                    tr: "Rastgele bir mim gönder!",
                }),
        )
        .setDMPermission(false),
    // The command output
    execute: async ({ interaction }) => {
        // Deferring the reply
        await interaction.deferReply();

        // Trying to fetch the meme
        try {
            // Fetching the meme from the API
            const raw = await fetch("https://apis.duncte123.me/meme", {
                method: "GET",
            });
            // Parsing the response
            const response = await raw.json();
            // Creating the embed
            const embed = new EmbedBuilder()
                .setTitle(response.data.title)
                .setImage(response.data.image)
                .setColor(0x1e1e1e);

            // Editing the deferred reply
            return interaction.editReply({ embeds: [embed] });
            // Catching the error
        } catch (error) {
            // Logging the error
            console.error(error);
            // Editing the deferred reply
            return interaction.editReply({
                content: `${alertEmoji} An error occurred while trying to fetch the meme. Try again in some time later.`,
                ephemeral: true,
            });
        }
    },
};
