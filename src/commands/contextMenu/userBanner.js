import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationIntegrationType,
    InteractionContextType,
} from "discord.js";
import {
    emoji_banner,
    emoji_danger,
    emoji_important,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
            ro: "Banner Utilizator",
            el: "Σημαιάκι Χρήστη",
            "pt-BR": "Banner do Usuário",
            ChineseCN: "用户横幅",
        })
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

                if (imageURI === null) {
                    await interaction.editReply({
                        content: `${emoji_important} Hmm, looks like this user doesn’t have a banner set. Maybe it’s lost in the folds of time?`,
                    });
                } else {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            `# ${emoji_banner} Hey there!\nYou're checking out @${resolved.username}'s banner. Pretty neat, right?`
                        )
                        .setImage(imageURI)
                        .setColor(EMBED_COLOR);

                    await interaction.editReply({
                        embeds: [embed],
                    });
                }
            });
        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `${emoji_danger} Oops! Something went wrong. Maybe a glitch in the timeline?`,
            });
        }
    },
};
