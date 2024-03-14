import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
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
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;

        try {
            await interaction.deferReply({ ephemeral: true });

            const user = client.users.fetch(interaction.targetId, {
                force: true,
            });

            user.then(async (resolved) => {
                const imageURI = resolved.bannerURL({ size: 4096 });

                const embed = new EmbedBuilder()
                    .setDescription(
                        `# ${photoEmoji} ${resolved.tag}\nYou're viewing ${resolved.tag}'s user banner.`
                    )
                    .setImage(imageURI)
                    .setColor(0x3b81f5);

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
            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} Are we sure they are a member in this guild?`,
                ephemeral: true,
            });
        }
    },
};
