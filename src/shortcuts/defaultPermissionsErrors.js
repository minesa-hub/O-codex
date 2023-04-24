// Importing the required modules
import { PermissionFlagsBits, bold } from "discord.js";
import { alertEmoji } from "./emojis.js";

// Exporting the defaultBotPermError function
export async function defaultBotPermError(interaction, permission) {
    // Getting the permission name from the PermissionFlagsBits object
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    // Checking if the bot has the permission
    if (!interaction.guild.members.me.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} I don't have ${bold(
                permissionName,
            )} permission to do that, <@${interaction.user.id}>.`,
            ephemeral: true,
        });
}

// Exporting the defaultUserPermError function
export async function defaultUserPermError(interaction, permission) {
    // Getting the permission name from the PermissionFlagsBits object
    const permissionName = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission,
    );
    // Checking if the user has the permission
    if (!interaction.member.permissions.has(permission))
        return interaction.reply({
            content: `${alertEmoji} You don't have ${bold(
                permissionName,
            )} to do that, <@${interaction.user.id}>.`,
            ephemeral: true,
        });
}
