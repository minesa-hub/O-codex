import { EmbedBuilder } from "discord.js";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
    person_banner,
} from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: {
        name: "User Banner (Personal)",
        name_localizations: {
            "zh-CN": "用户横幅（个人的）",
            it: "Banner Utente (Personale)",
            tr: "Kullanıcı Afişi (Kişisel)",
            "pt-BR": "Banner do Usuário (Pessoal)",
            ro: "Banner Utilizator (Personal)",
            el: "Σημαιάκι Χρήστη (Προσωπικό)",
        },
        integration_types: [1],
        contexts: [0, 1, 2],
        dm_permission: "true",
        type: 2,
    },
    execute: async ({ interaction, client }) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user = client.users.fetch(interaction.targetId, {
                force: true,
            });

            user.then(async (resolved) => {
                const imageURI = resolved.bannerURL({ size: 4096 });

                const embed = new EmbedBuilder()
                    .setDescription(
                        `# ${person_banner} ${resolved.tag}\nYou're viewing ${resolved.tag}'s user banner.`
                    )
                    .setImage(imageURI)
                    .setColor(EMBED_COLOR);

                if (imageURI === null) {
                    await interaction.editReply({
                        content: `${exclamationmark_circleEmoji} This user has no banner set.`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.editReply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }
            });
        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} Something went wrong.`,
                ephemeral: true,
            });
        }
    },
};
