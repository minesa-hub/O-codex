import { MessageFlags, PermissionFlagsBits, bold } from "discord.js";
import { emojis } from "./emojis.js";

// For bot
export const defaultPermissionErrorForBot = (
    interaction,
    permission,
    additionalText = ""
) => {
    const PERMISSION_NAME = Object.keys(PermissionFlagsBits).find(
        (key) => PermissionFlagsBits[key] === permission
    );

    let checkingPermission = true;

    if (interaction.guild) {
        checkingPermission =
            interaction.guild.members.me.permissions.has(permission);
    }

    if (!checkingPermission) {
        interaction.reply({
            content: `${emojis.important} I don't have ${bold(
                PERMISSION_NAME
            )} permission to do this action, <@${interaction.user.id}>. ${
                additionalText === "" ? "" : `\n>>> ${additionalText}`
            }`,
            flags: MessageFlags.Ephemeral,
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

    let checkingPermission = true;

    if (interaction.guild) {
        checkingPermission = interaction.member.permissions.has(permission);
    }

    if (!checkingPermission) {
        interaction.reply({
            content: `${emojis.important} You don't have ${bold(
                PERMISSION_NAME
            )} permission to do this action, <@${interaction.user.id}>. ${
                additionalText === "" ? "" : `\n>>> ${additionalText}`
            }`,
            flags: MessageFlags.Ephemeral,
        });
        return true;
    }

    return false;
};
