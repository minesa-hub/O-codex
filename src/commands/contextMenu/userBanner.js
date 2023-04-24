// Importing the required modules
import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";
import { infoEmoji } from "../../shortcuts/emojis.js";

// Exporting the command
export default {
    // The command data
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            ChineseCN: "用户横幅",
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    // The command output
    execute: async ({ interaction, client }) => {
        // Deferring the reply
        await interaction.deferReply({ ephemeral: true });

        // Getting the target member from the interaction target ID
        const user = client.users.fetch(interaction.targetId, { force: true });

        // Resolving the user
        user.then(async (resolved) => {
            // Getting the banner URL of the target member
            const imageURI = resolved.bannerURL({ dynamic: true, size: 4096 });
            // Creating the embed
            const embed = new EmbedBuilder()
                .setTitle(`${resolved.tag}'s Banner`)
                .setImage(imageURI)
                .setColor(0x1e1e1e);

            // Checking if the user has a banner set
            if (imageURI === null) {
                // Editing the deferred reply if the user has no banner set
                await interaction.editReply({
                    content: `${infoEmoji} User has no banner set.`,
                    ephemeral: true,
                });
            } else {
                // Editing the deferred reply if the user has a banner set
                await interaction.editReply({ embeds: [embed] });
            }
        });
    },
};
