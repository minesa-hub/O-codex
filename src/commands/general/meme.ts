import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { emojis } from "../../shortcuts/emojis.ts";
import { checkIfUserInstalledCommand } from "../../shortcuts/checkGuild-UserCommand.ts";

export default {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Memes from my pocket")
        .setNameLocalizations({
            it: "meme",
            tr: "mim",
            ro: "meme",
            el: "μεμέ",
            "pt-BR": "meme",
            "zh-CN": "梗图",
        })
        .setDescriptionLocalizations({
            tr: "Cebimden gelen mimler",
            it: "Meme dalla mia tasca",
            el: "Μεμέδες από την τσέπη μου",
            ro: "Meme-uri din buzunarul meu",
            "pt-BR": "Memês do meu bolso",
            "zh-CN": "口袋里的梗图",
        }),
    execute: async ({
        interaction,
    }: {
        interaction: ChatInputCommandInteraction;
    }): Promise<void> => {
        await checkIfUserInstalledCommand(interaction);

        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply();
        }

        try {
            const response = await fetch("https://apis.duncte123.me/meme", {
                method: "GET",
            });
            const data = await response.json();

            await interaction.editReply({
                content: `# ${emojis.brain} ${data.data.title}\n> ${data.data.image}`,
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: `${emojis.important} An error occurred. Please try again later.`,
            });
        }
    },
} as const;
