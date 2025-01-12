import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationIntegrationType,
    InteractionContextType,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
    person_banner,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            ChineseCN: "用户横幅",
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
            "pt-BR": "Banner do Usuário",
            ro: "Banner Utilizator",
            el: "Σημαιάκι Χρήστη",
        })
        .setType(ApplicationCommandType.User)
        .setType(ApplicationCommandType.User)
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall,
        ])
        .setContexts([
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild,
        ]),
    execute: async ({ interaction, client }) => {
        if (InteractionContextType.Guild) {
            if (
                defaultPermissionErrorForBot(
                    interaction,
                    PermissionFlagsBits.UseExternalEmojis
                ) ||
                defaultPermissionErrorForBot(
                    interaction,
                    PermissionFlagsBits.EmbedLinks
                )
            )
                return;
        }

        try {
            await interaction.deferReply();

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
                    });
                } else {
                    await interaction.editReply({
                        embeds: [embed],
                    });
                }
            });
        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} Something went wrong.`,
            });
        }
    },
};
