import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    photoEmoji,
} from "../../shortcuts/emojis.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            ChineseCN: "用户横幅",
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    execute: async ({ interaction, client }) => {
        const user = client.users.fetch(interaction.targetId, { force: true });

        user.then(async (resolved) => {
            const imageURI = resolved.bannerURL({ dynamic: true, size: 4096 });

            const embed = new EmbedBuilder()
                .setDescription(
                    `# ${photoEmoji} ${resolved.tag}\nYou're viewing ${resolved.tag}'s user banner.`,
                )
                .setImage(imageURI)
                .setColor(0x3b81f5);

            if (imageURI === null) {
                await interaction.reply({
                    content: `${exclamationmark_circleEmoji} This user has no banner set.`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    },
};
