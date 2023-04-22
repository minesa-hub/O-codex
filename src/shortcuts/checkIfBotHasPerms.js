import { PermissionFlagsBits, bold } from "discord.js";
import { alertEmoji } from "./emojis.js";

export async function checkIfBotHasPerms(
    interaction,
    permission,
    ephemeral = true,
) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.guild.members.me.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} I don't have ${bold(
                permissionName,
            )} to do that, <@${interaction.user.id}>.`,
            ephemeral,
        });
}
