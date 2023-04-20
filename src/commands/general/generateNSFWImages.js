import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { fetch } from "undici";

export default {
    data: new SlashCommandBuilder()
        .setName("show")
        .setNameLocalizations({
            ChineseCN: "显示",
            it: "mostra",
            tr: "nsfw",
        })
        .setDescription("See a NSFW image. It is for 18+ only.")
        .setDescriptionLocalizations({
            ChineseCN: "查看NSFW图片。仅限18+。",
            it: "Vedi un'immagine NSFW. È per 18+ solo.",
            tr: "NSFW resmini görün. Sadece 18+ için.",
        })
        .setNSFW(true)
        .setDMPermission(true)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("nsfw")
                .setNameLocalizations({
                    ChineseCN: "nsfw",
                    it: "nsfw",
                    tr: "göster",
                })
                .setDescription("See a NSFW image. It is for 18+ only.")
                .setDescriptionLocalizations({
                    ChineseCN: "查看NSFW图片。仅限18+。",
                    it: "Vedi un'immagine NSFW. È per 18+ solo.",
                    tr: "NSFW resmini görün. Sadece 18+ için.",
                })
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setNameLocalizations({
                            ChineseCN: "类型",
                            it: "tipo",
                            tr: "tip",
                        })
                        .setDescription("The type of NSFW image.")
                        .setDescriptionLocalizations({
                            ChineseCN: "NSFW图片的类型。",
                            it: "Il tipo di immagine NSFW.",
                            tr: "NSFW resminin türü.",
                        })
                        .setRequired(true)
                        .addChoices(
                            { name: "4k", value: "4k" },
                            { name: "anal", value: "anal" },
                            { name: "ass", value: "ass" },
                            { name: "boobs", value: "boobs" },
                            { name: "driff", value: "hmidriff" },
                            { name: "gonewild", value: "gonewild" },
                            { name: "hanal", value: "hanal" },
                            { name: "hentai", value: "hentai" },
                            { name: "hkitsune", value: "hkitsune" },
                            { name: "hneko", value: "hneko" },
                            { name: "hthigh", value: "hthigh" },
                            { name: "holo", value: "holo" },
                            { name: "kemonomimi", value: "kemonomimi" },
                            { name: "paizuri", value: "paizuri" },
                            { name: "porn gif", value: "pgif" },
                            { name: "pussy", value: "pussy" },
                            { name: "thigh", value: "thigh" },
                            { name: "tentacle", value: "tentacle" },
                            { name: "yaoi", value: "yaoi" },
                        ),
                )
                .addBooleanOption((option) =>
                    option
                        .setName("only-me")
                        .setNameLocalizations({
                            ChineseCN: "仅自己",
                            it: "solo-io",
                            tr: "sadece-ben",
                        })
                        .setDescription(
                            "Display the response as ephemeral or not?",
                        )
                        .setDescriptionLocalizations({
                            ChineseCN: "是否将响应显示为临时消息？",
                            it: "Visualizzare la risposta come epimerale o no?",
                            tr: "Görünümü geçici olarak görüntülemek mi yoksa değil mi?",
                        })
                        .setRequired(true),
                ),
        ),
    execute: async ({ interaction }) => {
        const type = interaction.options.getString("type");
        const onlyMe = interaction.options.getBoolean("only-me");

        try {
            const raw = await fetch(
                `https://nekobot.xyz/api/image?type=${type}`,
                {
                    method: "GET",
                },
            );
            const response = await raw.json();

            const NSFWEmbed = new EmbedBuilder()
                .setTitle("NSFW Image")
                .setDescription(
                    `Here is your NSFW image. If you can't see it, click the button below.`,
                )
                .setColor(0x1e1e1e)
                .setImage(response.message)
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });

            const displayOnBrowser = new ButtonBuilder()
                .setLabel("Display on Browser")
                .setURL(response.message)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder().addComponents(displayOnBrowser);

            await interaction.reply({
                embeds: [NSFWEmbed],
                components: [row],
                ephemeral: onlyMe,
            });
        } catch (error) {
            await interaction.reply({
                content: "An error occurred while fetching the image.",
                ephemeral: true,
            });
        }
    },
};
