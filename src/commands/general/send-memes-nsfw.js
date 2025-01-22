import {
    ActionRowBuilder,
    ApplicationCommandType,
    ApplicationIntegrationType,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import {
    emoji_brain,
    emoji_important,
    emoji_redirect,
    emoji_senstive,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setNSFW(true)
        .setName("send")
        .setDescription("Sending the fun! ❣")
        .setNameLocalizations({
            tr: "gönder",
            it: "invia",
            el: "αποστολή",
            ro: "trimite",
            "pt-BR": "enviar",
            ChineseCN: "发送",
        })
        .setDescriptionLocalizations({
            tr: "Eğlenceyi göndermek! ❣",
            it: "Inviando il divertimento! ❣",
            el: "Αποστολή διασκέδασης! ❣",
            ro: "Trimite distracția! ❣",
            "pt-BR": "Enviando a diversão! ❣",
            ChineseCN: "发送快乐！❣",
        })
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall,
        ])
        .setContexts([
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild,
        ])
        .addSubcommand((subcommand) =>
            subcommand
                .setName("meme")
                .setDescription("Memes from my pocket")
                .setNameLocalizations({
                    it: "meme",
                    tr: "mim",
                    ro: "meme",
                    el: "μεμέ",
                    "pt-BR": "meme",
                    ChineseCN: "梗图",
                })
                .setDescriptionLocalizations({
                    tr: "Cebimden gelen mimler",
                    it: "Meme dalla mia tasca",
                    el: "Μεμέδες από την τσέπη μου",
                    ro: "Meme-uri din buzunarul meu",
                    "pt-BR": "Memês do meu bolso",
                    ChineseCN: "口袋里的梗图",
                })
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("nsfw")
                .setDescription("Welcome to adult's place :3")
                .setNameLocalizations({
                    tr: "müstehcen",
                    it: "nsfw",
                    el: "άσεμνος",
                    ro: "nsfw",
                    "pt-BR": "nsfw",
                    ChineseCN: "不安全的内容",
                })
                .setDescriptionLocalizations({
                    tr: "Yetişkinlerin dünyasına hoş geldiniz :3",
                    it: "Benvenuti nel mondo degli adulti :3",
                    el: "Καλώς ήλθατε στον κόσμο των ενηλίκων :3",
                    ro: "Bine ați venit în lumea adulților :3",
                    "pt-BR": "Bem-vindo ao mundo adulto :3",
                    ChineseCN: "欢迎来到成人世界 :3",
                })
                .addStringOption((option) =>
                    option
                        .setAutocomplete(true)
                        .setName("category")
                        .setDescription("I like the boobs one much 👀")
                        .setNameLocalizations({
                            tr: "kategori",
                            it: "categoria",
                            el: "κατηγορία",
                            ro: "categorie",
                            "pt-BR": "categoria",
                            ChineseCN: "类别",
                        })
                        .setDescriptionLocalizations({
                            tr: "Göğüsler olanı daha çok seviyorum 👀",
                            it: "Mi piace molto quello delle tette 👀",
                            el: "Μου αρέσει πολύ το ένα με τα στήθη 👀",
                            ro: "Îmi place mult cel cu sânii 👀",
                            "pt-BR": "Eu gosto muito do dos seios 👀",
                            ChineseCN: "我更喜欢那个胸部的 👀",
                        })
                        .setRequired(true)
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
        ) {
            return;
        }

        const { options } = interaction;
        const subcommand = options.getSubcommand();

        try {
            switch (subcommand) {
                case "meme": {
                    await interaction.deferReply();

                    const API = await fetch("https://apis.duncte123.me/meme", {
                        method: "GET",
                    });
                    const RESPONSE = await API.json();

                    await interaction.editReply({
                        content: `# ${emoji_brain} ${RESPONSE.data.title}\n> ${RESPONSE.data.image}`,
                    });
                    break;
                }

                case "nsfw": {
                    const category = options.getString("category");
                    const visibility = options.getBoolean("visibility");

                    if (visibility) {
                        await interaction.deferReply();
                    } else {
                        await interaction.deferReply({
                            flags: MessageFlags.Ephemeral,
                        });
                    }

                    const API = await fetch(
                        `https://nekobot.xyz/api/image?type=${category}`,
                        { method: "GET" }
                    );
                    const RESPONSE = await API.json();
                    const IMAGE_URL = RESPONSE.message;

                    const imageType = IMAGE_URL.split(".").pop();

                    const displayOnBrowser = new ButtonBuilder()
                        .setLabel("View Through the Time Portal")
                        .setURL(IMAGE_URL)
                        .setStyle(ButtonStyle.Link)
                        .setEmoji(emoji_redirect);

                    const row = new ActionRowBuilder().addComponents(
                        displayOnBrowser
                    );

                    const file = new AttachmentBuilder(IMAGE_URL, {
                        name: `kaeru_nsfw.${imageType}`,
                        description: category,
                    });

                    await interaction.editReply({
                        content: `# ${emoji_senstive} Sensitive Content\n\n> If you are a young person attempting to view NSFW images, I recommend refraining for your own good.`,
                        components: [row],
                        files: [file],
                    });
                    break;
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: `${emoji_important} An error occurred. Please try again later.`,
            });
        }
    },

    async autocomplete({ interaction }) {
        const focusedValue = interaction.options.getFocused();
        const items = [
            { name: "Hentai", value: "hentai" },
            { name: "Midriff", value: "hmidriff" },
            { name: "Pgif", value: "pgif" },
            { name: "4k", value: "4k" },
            { name: "Holo", value: "holo" },
            { name: "Neko", value: "neko" },
            { name: "Kemonomimi", value: "kemonomimi" },
            { name: "Anal", value: "anal" },
            { name: "Gonewild", value: "gonewild" },
            { name: "Ass", value: "ass" },
            { name: "Thigh", value: "thigh" },
            { name: "Paizuri", value: "paizuri" },
            { name: "Tentacle", value: "tentacle" },
            { name: "Boobs", value: "boobs" },
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
