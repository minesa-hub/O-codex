import { MessageFlags, PermissionFlagsBits, bold } from "discord.js";
import type {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    AnySelectMenuInteraction,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { emojis } from "./emojis.ts";

// For bot
export const defaultPermissionErrorForBot = (
    interaction:
        | MessageContextMenuCommandInteraction
        | ChatInputCommandInteraction
        | ButtonInteraction
        | ModalSubmitInteraction
        | AnySelectMenuInteraction,
    permission: bigint,
    additionalText: string = ""
): boolean => {
    const PERMISSION_NAME =
        Object.keys(PermissionFlagsBits).find(
            (key) =>
                PermissionFlagsBits[key as keyof typeof PermissionFlagsBits] ===
                permission
        ) ?? "Unknown Permission";

    const hasPermission =
        interaction.guild?.members.me?.permissions.has(permission) ?? false;

    if (!hasPermission) {
        interaction.reply({
            content: `${emojis.important} I don't have ${bold(
                PERMISSION_NAME
            )} permission to perform this action, <@${interaction.user.id}>.${
                additionalText ? `\n>>> ${additionalText}` : ""
            }`,
            flags: MessageFlags.Ephemeral,
        });
        return true;
    }

    return false;
};
