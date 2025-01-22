import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
} from "discord.js";
import { emoji_important, emoji_avatar } from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            tr: "Kullanıcı Avatarı",
            it: "Avatar Utente",
            ro: "Avatar Utilizator",
            el: "Άβαταρ Χρήστη",
            "pt-BR": "Avatar do Usuário",
            ChineseCN: "用户头像",
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
                    `# ${emoji_avatar} Hey there! You're checking out @${user.username}'s profile picture. Pretty cool, right?`
                )
                .setImage(avatar)
                .setColor(EMBED_COLOR);

            await interaction.editReply({
                embeds: [embed],
            });
        } catch (error) {
            console.log(error);

            return interaction.editReply({
                content: `${emoji_important} Hmm, looks like this person’s gone missing in action. Are you sure they’re around?`,
            });
        }
    },
};
