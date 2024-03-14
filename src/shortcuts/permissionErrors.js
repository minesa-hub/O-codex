import { PermissionFlagsBits, bold } from "discord.js";
import { exclamationmark_triangleEmoji } from "./emojis.js";

// For bot
export const defaultPermissionErrorForBot = (
    interaction,
    permission,
    additionalText = ""
) => {
    const PERMISSION_NAME = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission
    );
    const checkingPermission =
        interaction.guild.members.me.permissions.has(permission);

    if (!checkingPermission) {
        interaction.reply({
            content: `${exclamationmark_triangleEmoji} I don't have ${bold(
                PERMISSION_NAME
            )} permission to do this action, <@${interaction.user.id}>. ${
                additionalText == `` ? `` : `\n>>> ${additionalText}`
            }`,
            ephemeral: true,
        });
        return true;
    }

    return false;
};

// For user
export const defaultPermissionErrorForMember = async (
    interaction,
    permission,
    additionalText = ""
) => {
    const PERMISSION_NAME = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission
    );
    const checkingPermission = interaction.member.permissions.has(permission);

    if (!checkingPermission) {
        interaction.reply({
            content: `${exclamationmark_triangleEmoji} You don't have ${bold(
                PERMISSION_NAME
            )} permission to do this action, <@${interaction.user.id}>. ${
                additionalText == `` ? `` : `\n>>> ${additionalText}`
            }`,
            ephemeral: true,
        });
        return true;
    }

    return false;
};
