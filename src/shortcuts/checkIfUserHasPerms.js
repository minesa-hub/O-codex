import { PermissionFlagsBits, bold } from "discord.js";
import { alertEmoji } from "./emojis.js";

export async function checkIfUserHasPerms(
    interaction,
    permission,
    ephemeral = true,
) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.member.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} You don't have ${bold(
                permissionName,
            )} to do that, <@${interaction.user.id}>.`,
            ephemeral,
        });
}
