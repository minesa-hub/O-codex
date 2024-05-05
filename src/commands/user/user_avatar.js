import { EmbedBuilder, Integration } from "discord.js";
import {
    exclamationmark_triangleEmoji,
    person_profile,
} from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: {
        name: "User Avatar (Personal)",
        name_localizations: {
            "zh-CN": "用户头像（个人的）",
            it: "Avatar Utente (Personale)",
            tr: "Kullanıcı Avatarı (Kişisel)",
            "pt-BR": "Avatar do Usuário (Pessoal)",
            ro: "Avatar Utilizator (Personal)",
            el: "Άβαταρ Χρήστη (Προσωπικό)",
        },
        integration_types: [1],
        contexts: [0, 1, 2],
        dm_permission: "true",
        type: 2,
    },
    execute: async ({ interaction, client }) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.targetId;
            const user = await client.users.fetch(userId);
            const avatar = user.displayAvatarURL({
                size: 4096,
            });

            const embed = new EmbedBuilder()
                .setDescription(
                    `# ${person_profile} @${user.username}\nYou are viewing their profile picture now.`
                )
                .setImage(avatar)
                .setColor(EMBED_COLOR);

            await interaction.editReply({
                embeds: [embed],
            });
        } catch (error) {
            console.log(error);

            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} Are we sure they are a member in this guild?`,
            });
        }
    },
};
