import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import {
    brain_emoji,
    exclamationmark_triangleEmoji,
    senstive_emoji,
} from "../../shortcuts/emojis.js";

import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("send")
        .setNameLocalizations({
            tr: "gönder",
            it: "invia",
            "zh-CN": "发送",
            el: "αποστολή",
            "pt-BR": "enviar",
            ro: "trimite",
        })
        .setNSFW(true)
        .setDMPermission(true)
        .setDescription("Sending the fun! ❣")
        .setDescriptionLocalizations({
            tr: "Eğlenceyi göndermek! ❣",
            it: "Inviando il divertimento! ❣",
            "zh-CN": "发送快乐！❣",
            el: "Αποστολή διασκέδασης! ❣",
            "pt-BR": "Enviando a diversão! ❣",
            ro: "Trimite distracția! ❣",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("meme")
                .setNameLocalizations({
                    ChineseCN: "梗图",
                    it: "meme",
                    tr: "mim",
                    "pt-BR": "meme",
                    ro: "meme",
                    el: "μεμέ",
                })
                .setDescription("Memes from my pocket")
                .setDescriptionLocalizations({
                    tr: "Cebimden gelen mimler",
                    it: "Meme dalla mia tasca",
                    "zh-CN": "口袋里的梗图",
                    el: "Μεμέδες από την τσέπη μου",
                    "pt-BR": "Memês do meu bolso",
                    ro: "Meme-uri din buzunarul meu",
                })
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("nsfw")
                .setNameLocalizations({
                    tr: "müstehcen",
                    it: "nsfw",
                    "zh-CN": "不安全的内容",
                    el: "άσεμνος",
                    "pt-BR": "nsfw",
                    ro: "nsfw",
                })
                .setDescription("Welcome to adult's place :3")
                .setDescriptionLocalizations({
                    tr: "Yetişkinlerin dünyasına hoş geldiniz :3",
                    it: "Benvenuti nel mondo degli adulti :3",
                    "zh-CN": "欢迎来到成人世界 :3",
                    el: "Καλώς ήλθατε στον κόσμο των ενηλίκων :3",
                    "pt-BR": "Bem-vindo ao mundo adulto :3",
                    ro: "Bine ați venit în lumea adulților :3",
                })

                .addStringOption((option) =>
                    option
                        .setName("category")
                        .setNameLocalizations({
                            tr: "kategori",
                            it: "categoria",
                            "zh-CN": "类别",
                            el: "κατηγορία",
                            "pt-BR": "categoria",
                            ro: "categorie",
                        })
                        .setDescription("I like the boobs one much 👀")
                        .setDescriptionLocalizations({
                            tr: "Göğüsler olanı daha çok seviyorum 👀",
                            it: "Mi piace molto quello delle tette 👀",
                            "zh-CN": "我更喜欢那个胸部的 👀",
                            el: "Μου αρέσει πολύ το ένα με τα στήθη 👀",
                            "pt-BR": "Eu gosto muito do dos seios 👀",
                            ro: "Îmi place mult cel cu sânii 👀",
                        })
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("visibility")
                        .setDescription("Do you want to see it only?")
                        .setRequired(true)
                )
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
        const { options } = interaction;
        const subcommand = options.getSubcommand();

        let API;
        let RESPONSE;
        let IMAGE_URL;

        switch (subcommand) {
            case "meme":
                try {
                    await interaction.deferReply();

                    API = await fetch("https://apis.duncte123.me/meme", {
                        method: "GET",
                    });

                    RESPONSE = await API.json();

                    await interaction.editReply({
                        content: `# ${
                            brain_emoji + " " + RESPONSE.data.title
                        }\n> ${RESPONSE.data.image}`,
                    });
                } catch (error) {
                    console.error(error);

                    await interaction.editReply({
                        content: `${exclamationmark_triangleEmoji} An error occurred while trying to fetch the meme. Try again in some time later.`,
                    });
                }

                break;
            case "nsfw":
                try {
                    const category = options.getString("category");
                    const visibility = options.getBoolean("visibility");

                    await interaction.deferReply({
                        ephemeral: visibility,
                    });

                    API = await fetch(
                        `https://nekobot.xyz/api/image?type=${category}`,
                        {
                            method: "GET",
                        }
                    );
                    RESPONSE = await API.json();
                    IMAGE_URL = RESPONSE.message;
                    const imageType = IMAGE_URL.endsWith(".gif")
                        ? "gif"
                        : IMAGE_URL.endsWith(".png")
                        ? "png"
                        : IMAGE_URL.endsWith(".jpg")
                        ? "jpg"
                        : "unknown";

                    const displayOnBrowser = new ButtonBuilder()
                        .setLabel("Display on Browser")
                        .setURL(IMAGE_URL)
                        .setStyle(ButtonStyle.Link);
                    const row = new ActionRowBuilder().addComponents(
                        displayOnBrowser
                    );

                    const file = new AttachmentBuilder(IMAGE_URL, {
                        name: `kaeru_nsfw.${imageType}`,
                        description: category,
                    });
                    file.setSpoiler(visibility ? false : true);

                    await interaction.editReply({
                        content: `# ${senstive_emoji} Sensitive Content\n\n> If you are a young person who attempts to see nsfw images, I recommend you to stop it for your sake.`,
                        components: [row],
                        files: [file],
                    });
                } catch (err) {
                    console.error(err);

                    await interaction.followUp({
                        content: `${exclamationmark_triangleEmoji} Woops! Something went wrong.`,
                        ephemeral: true,
                    });
                }
                break;
        }
    },
    async autocomplete({ interaction }) {
        const focusedValue = interaction.options.getFocused();

        const items = [
            { name: "Hentai", value: "hass" },
            { name: "Hmidriff", value: "hmidriff" },
            { name: "Pgif", value: "pgif" },
            { name: "4k", value: "4k" },
            { name: "Hentai", value: "hentai" },
            { name: "Holo", value: "holo" },
            { name: "Hneko", value: "hneko" },
            { name: "Neko", value: "neko" },
            { name: "Hkitsune", value: "hkitsune" },
            { name: "Kemonomimi", value: "kemonomimi" },
            { name: "Anal", value: "anal" },
            { name: "Hanal", value: "hanal" },
            { name: "Gonewild", value: "gonewild" },
            { name: "Kanna", value: "kanna" },
            { name: "Ass", value: "ass" },
            { name: "Pussy", value: "pussy" },
            { name: "Thigh", value: "thigh" },
            { name: "Hentai Thigh", value: "hthigh" },
            { name: "Paizuri", value: "paizuri" },
            { name: "Tentacle", value: "tentacle" },
            { name: "Boobs", value: "boobs" },
            { name: "Hentai Boobs", value: "hboobs" },
            { name: "Yaoi", value: "yaoi" },
        ];

        const filteredItems = items.filter((item) =>
            item.name.toLowerCase().startsWith(focusedValue.toLowerCase())
        );

        const autocompleteOptions = filteredItems.map((item) => ({
            name: item.name,
            value: item.value,
        }));

        await interaction.respond(autocompleteOptions);
    },
};
