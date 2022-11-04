import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { fetch } from "undici";

const nsfwCommand = {
    data: new SlashCommandBuilder()
        .setName("nsfw")
        .setDescription("— Access to NSFW images.")
        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("• The category to toggle.")
                .setRequired(true)
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
                .setRequired(true),
        ),
    async execute(interaction, client) {
        const category = interaction.options.getString("category");
        const ephemeral = interaction.options.getBoolean("ephemeral");

        try {
            const raw = await fetch(`https://nekobot.xyz/api/image?type=${category}`, {
                method: "GET",
            });
            const response = await raw.json();

            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Display in Browser")
                    .setURL(response.message)
                    .setStyle(ButtonStyle.Link),
            );

            return interaction.reply({
                content: response.message,
                components: [button],
                ephemeral,
            });
        } catch (error) {
            return interaction.reply({
                content: "Nothing found for this search.",
                ephemeral: true,
            });
        }
    },
};

export default nsfwCommand;
