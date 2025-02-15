import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    InteractionContextType,
    MessageFlags,
    UserContextMenuCommandInteraction,
    Client,
} from "discord.js";
import type { ColorResolvable } from "discord.js";
import { emojis } from "../../shortcuts/emojis.ts";
import { checkIfUserInstalledCommand } from "../../shortcuts/checkGuild-UserCommand.ts";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            tr: "Kullanıcı Avatarı",
            it: "Avatar Utente",
            ro: "Avatar Utilizator",
            el: "Άβαταρ Χρήστη",
            "pt-BR": "Avatar do Usuário",
            "zh-CN": "用户头像",
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
    execute: async ({
        interaction,
        client,
    }: {
        interaction: UserContextMenuCommandInteraction;
        client: Client;
    }): Promise<void> => {
        // Checking if the command ran in a guild and if the user has the required permissions
        await checkIfUserInstalledCommand(interaction);

        try {
            const userId = interaction.targetId;
            const user = await client.users.fetch(userId);
            const avatar = user.displayAvatarURL({
                size: 4096,
            });

            const embed = new EmbedBuilder()
                .setDescription(
                    `# ${emojis.avatar} Hey there!\nYou're checking out @${user.username}'s profile picture. Pretty cool, right?`
                )
                .setImage(avatar)
                .setColor(process.env.EMBED_COLOR as ColorResolvable);

            await interaction.editReply({
                embeds: [embed],
            });
        } catch (error) {
            console.error("Error fetching user or avatar:", error);

            await interaction.editReply({
                content: `${emojis.important} Hmm, looks like this person’s gone missing in action. Are you sure they’re around?`,
            });
        }
    },
} as const;
