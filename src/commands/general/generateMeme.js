import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";
import {
    brain_emoji,
    exclamationmark_triangleEmoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
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
                })
        ),
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;

        try {
            await interaction.deferReply();

            const raw = await fetch("https://apis.duncte123.me/meme", {
                method: "GET",
            });
            const response = await raw.json();

            await interaction.editReply({
                content: `# ${brain_emoji + " " + response.data.title}\n> ${
                    response.data.image
                }`,
            });
        } catch (error) {
            console.error(error);

            await interaction.reply({
                content: `${exclamationmark_triangleEmoji} An error occurred while trying to fetch the meme. Try again in some time later.`,
                ephemeral: true,
            });
        }
    },
};
