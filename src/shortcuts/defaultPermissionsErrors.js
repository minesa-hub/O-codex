import { PermissionFlagsBits, bold } from "discord.js";
import { exclamationmark_triangleEmoji } from "./emojis.js";

export async function defaultBotPermError(
    interaction,
    permission,
    additionalText = "",
) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.guild.members.me.permissions.has(permission))
        return interaction.followUp({
            content: `${exclamationmark_triangleEmoji} I don't have ${bold(
                permissionName,
            )} permission to do this action, <@${interaction.user.id}>. ${
                additionalText == "" ? "" : "\n> " + additionalText
            }`,
            ephemeral: true,
        });
}

export async function defaultUserPermError(
    interaction,
    permission,
    additionalText = "",
) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.member.permissions.has(permission))
        return interaction.followUp({
            content: `${exclamationmark_triangleEmoji} You don't have ${bold(
                permissionName,
            )} to do this action, <@${interaction.user.id}>. ${
                additionalText == "" ? "" : "\n> " + additionalText
            }`,
            ephemeral: true,
        });
}
