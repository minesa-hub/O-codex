import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";

export default {
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
    execute: async ({ interaction }) => {
        await interaction.deferReply();

        try {
            const raw = await fetch("https://apis.duncte123.me/meme", {
                method: "GET",
            });
            const response = await raw.json();

            const embed = new EmbedBuilder()
                .setTitle(response.data.title)
                .setImage(response.data.image)
                .setColor(0x1e1e1e);

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                content: "An error occurred while trying to fetch the meme!",
                ephemeral: true,
            });
        }
    },
};
