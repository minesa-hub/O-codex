/* 
    Description: This command will send the user's avatar when the user right-clicks on their name in the server.
 */

// Importing the required modules
import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";

// Exporting the command
export default {
    // The command data
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            ChineseCN: "用户头像",
            it: "Avatar Utente",
            tr: "Kullanıcı Avatarı-",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    // The command output
    execute: async ({ interaction }) => {
        // Deferring the reply
        await interaction.deferReply({ ephemeral: true });

        // Getting the target member from the interaction target ID
        const target = interaction.guild.members.cache.get(
            interaction.targetId,
        );

        // Getting the avatar URL of the target member
        const avatar = target.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        // Creating the embed
        const embed = new EmbedBuilder()
            .setTitle(`${target.user.tag}'s Avatar`)
            .setImage(avatar)
            .setColor(0x1e1e1e);

        // Editing the deferred reply
        await interaction.editReply({
            embeds: [embed],
        });
    },
};
