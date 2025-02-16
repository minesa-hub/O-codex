import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
} from "discord.js";
import { emojis } from "../../shortcuts/emojis.ts";
import { checkIfUserInstalledCommand } from "../../shortcuts/checkGuild-UserCommand.ts";

export default {
    data: new SlashCommandBuilder()
        .setNSFW(true)
        .setName("nsfw")
        .setDescription("Welcome to adult's place :3")
        .setNameLocalizations({
            tr: "müstehcen",
            it: "nsfw",
            el: "άσεμνος",
            ro: "nsfw",
            "pt-BR": "nsfw",
            "zh-CN": "不安全的内容",
        })
        .setDescriptionLocalizations({
            tr: "Yetişkinlerin dünyasına hoş geldiniz :3",
            it: "Benvenuti nel mondo degli adulti :3",
            el: "Καλώς ήλθατε στον κόσμο των ενηλίκων :3",
            ro: "Bine ați venit în lumea adulților :3",
            "pt-BR": "Bem-vindo ao mundo adulto :3",
            "zh-CN": "欢迎来到成人世界 :3",
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
                    "zh-CN": "类别",
                })
                .setDescriptionLocalizations({
                    tr: "Göğüsler olanı daha çok seviyorum 👀",
                    it: "Mi piace molto quello delle tette 👀",
                    el: "Μου αρέσει πολύ το ένα με τα στήθη 👀",
                    ro: "Îmi place mult cel cu sânii 👀",
                    "pt-BR": "Eu gosto muito do dos seios 👀",
                    "zh-CN": "我更喜欢那个胸部的 👀",
                })
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("visibility")
                .setDescription("Do you want to see it only?")
                .setRequired(true)
        ),

    autocomplete: async ({
        interaction,
    }: {
        interaction: AutocompleteInteraction;
    }): Promise<void> => {
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
    execute: async ({
        interaction,
    }: {
        interaction: ChatInputCommandInteraction;
    }): Promise<void> => {
        await checkIfUserInstalledCommand(interaction);

        const category = interaction.options.getString("category")!;
        const visibility = interaction.options.getBoolean("visibility")!;

        const alreadyDeferred = interaction.deferred || interaction.replied;
        if (!alreadyDeferred) {
            if (visibility) {
                await interaction.deferReply();
            } else {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            }
        }

        const apiUrl: string = `https://nekobot.xyz/api/image?type=${category}`;
        var displayOnBrowser = new ButtonBuilder()
            .setLabel("View Through the Time Portal")
            .setURL(apiUrl)
            .setStyle(ButtonStyle.Link)
            .setEmoji(emojis.redirect);
        var row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            displayOnBrowser
        );

        try {
            const apiResponse = await fetch(apiUrl, { method: "GET" });
            const apiData = await apiResponse.json();
            const imageUrl: string = apiData.message;
            const imageType = imageUrl.split(".").pop() || "jpg";

            const file = new AttachmentBuilder(imageUrl, {
                name: `kaeru_nsfw.${imageType}`,
                description: category,
            });
            await interaction.editReply({
                content: `# ${emojis.sensitive} Sensitive Content\n\n> If you are a young person attempting to view NSFW images, I recommend refraining for your own good.`,
                components: [row],
                files: [file],
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: `${emojis.important} An error occurred. Please try again later.`,
                components: [row],
            });
        }
    },
} as const;
