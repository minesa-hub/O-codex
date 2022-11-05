import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";

const nsfwCommand = {
    data: new SlashCommandBuilder()
        .setName("nsfw")
        .setDescription("— Access to NSFW images.")
        .setNameLocalizations({ tr: "nsfw", it: "nsfw", ChineseCN: "nsfw" })
        .setDescriptionLocalizations({
            tr: "— NSFW resimlere erişim.",
            it: "— Accesso alle immagini NSFW.",
            ChineseCN: "— 访问NSFW图像。",
        })
        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("• The category to see.")
                .setRequired(true)
                .setNameLocalizations({ tr: "kategori" })
                .setDescriptionLocalizations({ tr: "• Seçmek istediğiniz kategori." })
                .addChoices(
                    { name: "driff", value: "hmidriff" },
                    { name: "porn gif", value: "pgif" },
                    { name: "4k", value: "4k" },
                    { name: "hentai", value: "hentai" },
                    { name: "holo", value: "holo" },
                    { name: "hneko", value: "hneko" },
                    { name: "hkitsune", value: "hkitsune" },
                    { name: "kemonomimi", value: "kemonomimi" },
                    { name: "anal", value: "anal" },
                    { name: "hanal", value: "hanal" },
                    { name: "gonewild", value: "gonewild" },
                    { name: "ass", value: "ass" },
                    { name: "pussy", value: "pussy" },
                    { name: "thigh", value: "thigh" },
                    { name: "hthigh", value: "hthigh" },
                    { name: "paizuri", value: "paizuri" },
                    { name: "tentacle", value: "tentacle" },
                    { name: "boobs", value: "boobs" },
                    { name: "yaoi", value: "yaoi" },
                ),
        )
        .addBooleanOption(option =>
            option
                .setName("ephemeral")
                .setDescription("• Display the response as ephemeral or not?")
                .setRequired(true)
                .setNameLocalizations({ tr: "kısmı_görünüm" })
                .setDescriptionLocalizations({
                    tr: "Resmi kısmi mesaj olarak göster veya gösterme, seçim senin?",
                }),
        ),
    async execute(interaction, client) {
        // Adding "category" and "ephemeral" options for the slash
        const category = interaction.options.getString("category");
        const ephemeral = interaction.options.getBoolean("ephemeral");

        try {
            // Fetching the url to get an image of the category
            const raw = await fetch(`https://nekobot.xyz/api/image?type=${category}`, {
                method: "GET",
            });
            const response = await raw.json();

            // Building a button
            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Display in Browser")
                    .setURL(response.message)
                    .setStyle(ButtonStyle.Link),
            );

            // Sending the response
            return interaction.reply({
                content: response.message,
                components: [button],
                ephemeral,
            });
        } catch (error) {
            // Sending the error
            return interaction.reply({
                content: "Nothing found for this search.",
                ephemeral: true,
            });
        }
    },
};

export default nsfwCommand;
