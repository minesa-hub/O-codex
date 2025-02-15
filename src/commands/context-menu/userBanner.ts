import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationIntegrationType,
    InteractionContextType,
    MessageFlags,
    UserContextMenuCommandInteraction,
    Client,
} from "discord.js";
import type { ColorResolvable } from "discord.js";
import { emojis } from "../../shortcuts/emojis.ts";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.ts";

interface ExecuteParams {
    interaction: UserContextMenuCommandInteraction;
    client: Client;
}

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
            ro: "Banner Utilizator",
            el: "Σημαιάκι Χρήστη",
            "pt-BR": "Banner do Usuário",
            "zh-CN": "用户横幅",
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
    execute: async ({ interaction, client }: ExecuteParams): Promise<void> => {
        if (interaction.inGuild()) {
            if (
                (await defaultPermissionErrorForBot(
                    interaction,
                    PermissionFlagsBits.UseExternalEmojis
                )) ||
                (await defaultPermissionErrorForBot(
                    interaction,
                    PermissionFlagsBits.EmbedLinks
                ))
            ) {
                return;
            }
        }

        if (
            Object.keys(interaction.authorizingIntegrationOwners).every(
                (key) =>
                    key === ApplicationIntegrationType.UserInstall.toString()
            )
        ) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        } else {
            await interaction.deferReply();
        }

        try {
            const user = await client.users.fetch(interaction.targetId, {
                force: true,
            });
            const imageURI = user.bannerURL({ size: 4096 });

            if (!imageURI) {
                await interaction.editReply({
                    content: `${emojis.important} Hmm, looks like this user doesn’t have a banner set. Maybe it’s lost in the folds of time?`,
                });
            } else {
                const embed = new EmbedBuilder()
                    .setDescription(
                        `# ${emojis.banner} Hey there!\nYou're checking out @${user.username}'s banner. Pretty neat, right?`
                    )
                    .setImage(imageURI)
                    .setColor(process.env.EMBED_COLOR as ColorResolvable);

                await interaction.editReply({
                    embeds: [embed],
                });
            }
        } catch (error) {
            console.error("Error fetching user or banner:", error);
            await interaction.editReply({
                content: `${emojis.danger} Oops! Something went wrong. Maybe a glitch in the timeline?`,
            });
        }
    },
} as const;
