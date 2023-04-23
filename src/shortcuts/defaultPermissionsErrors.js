import { PermissionFlagsBits, bold } from "discord.js";
import { alertEmoji } from "./emojis.js";

export async function defaultBotPermError(interaction, permission) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.guild.members.me.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} I don't have ${bold(
                permissionName,
            )} permission to do that, <@${interaction.user.id}>.`,
            ephemeral: true,
        });
}

export async function defaultUserPermError(interaction, permission) {
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    if (!interaction.member.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} You don't have ${bold(
                permissionName,
            )} to do that, <@${interaction.user.id}>.`,
            ephemeral: true,
        });
}
