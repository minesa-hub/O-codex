import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
} from "discord.js";
import {
    exclamationmark_triangleEmoji,
    person_profile,
} from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            "zh-CN": "用户头像",
            it: "Avatar Utente",
            tr: "Kullanıcı Avatarı",
            "pt-BR": "Avatar do Usuário",
            ro: "Avatar Utilizator",
            el: "Άβαταρ Χρήστη",
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
                content: `${exclamationmark_triangleEmoji} Are we sure this person exist?`,
            });
        }
    },
};
