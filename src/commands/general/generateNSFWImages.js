import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import fetch from "node-fetch";
import {
    exclamationmark_triangleEmoji,
    senstive_emoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setNSFW(true)
        .setName("see-nsfw")
        .setNameLocalizations({
            ChineseCN: "显示nsfw",
            it: "mostra-nsfw",
            tr: "nsfw-içerikler-gör",
            "pt-BR": "ver-nsfw",
            ro: "vezi-nsfw",
            el: "δες-nsfw",
        })
        .setDescription("See a NSFW image. It is for 18+ only.")
        .setDescriptionLocalizations({
            ChineseCN: "查看NSFW图片。仅限18+。",
            it: "Vedi un'immagine NSFW. È per 18+ solo.",
            tr: "NSFW resmini görün. Sadece 18+ için.",
            "pt-BR": "Veja uma imagem NSFW. Apenas para maiores de 18 anos.",
            ro: "Vezi o imagine NSFW. Este destinată doar celor de peste 18 ani.",
            el: "Δείτε μια εικόνα NSFW. Είναι μόνο για άνω των 18 ετών.",
        })
        .addStringOption((option) =>
            option
                .setName("type")
                .setNameLocalizations({
                    ChineseCN: "类型",
                    it: "tipo",
                    tr: "tip",
                    "pt-BR": "tipo",
                    ro: "tip",
                    el: "τύπος",
                })
                .setDescription("The type of NSFW image.")
                .setDescriptionLocalizations({
                    ChineseCN: "NSFW图片的类型。",
                    it: "Il tipo di immagine NSFW.",
                    tr: "NSFW resminin türü.",
                    "pt-BR": "O tipo de imagem NSFW.",
                    ro: "Tipul imaginii NSFW.",
                    el: "Ο τύπος της εικόνας NSFW.",
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
                    { name: "yaoi", value: "yaoi" }
                )
        )
        .addBooleanOption((option) =>
            option
                .setName("only-me")
                .setNameLocalizations({
                    ChineseCN: "仅自己",
                    it: "solo-io",
                    tr: "sadece-ben",
                    "pt-BR": "apenas-eu",
                    ro: "doar-eu",
                    el: "μόνο-εγώ",
                })
                .setDescription("Display the response as ephemeral or not?")
                .setDescriptionLocalizations({
                    ChineseCN: "是否将响应显示为临时消息？",
                    it: "Visualizzare la risposta come epimerale o no?",
                    tr: "Görünümü geçici olarak görüntülemek mi yoksa değil mi?",
                    "pt-BR": "Exibir a resposta como efêmera ou não?",
                    ro: "Afișează răspunsul ca efemer sau nu?",
                    el: "Εμφάνιση της απάντησης ως προσωρινή ή όχι;",
                })
                .setRequired(true)
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
            const type = interaction.options.getString("type");
            const onlyMe = interaction.options.getBoolean("only-me");

            await interaction.deferReply({ ephemeral: onlyMe });

            const raw = await fetch(
                `https://nekobot.xyz/api/image?type=${type}`,
                {
                    method: "GET",
                }
            );
            const response = await raw.json();

            const imageUrl = response.message;
            const NSFWMessage = `# ${senstive_emoji} Sensitive Content\nIf you are a young person who attempts to see nsfw images, I recommend you to stop it for your sake.`;

            const displayOnBrowser = new ButtonBuilder()
                .setLabel("Display on Browser")
                .setURL(imageUrl)
                .setStyle(ButtonStyle.Link);
            const row = new ActionRowBuilder().addComponents(displayOnBrowser);

            return interaction.editReply({
                content: NSFWMessage + "\n\n> Source: " + imageUrl,
                components: [row],
            });
        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} An error occurred while fetching the image.`,
                ephemeral: true,
            });
        }
    },
};
