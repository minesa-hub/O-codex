import {
    ApplicationCommandType,
    MessageFlags,
    PermissionFlagsBits,
    PermissionsBitField,
} from "discord.js";
import { emojis } from "../resources/emojis.js";

// Checks if interaction is valid and can reply
function isRepliableInteraction(interaction) {
    if (!interaction) return false;

    const hasBasicProperties =
        interaction.type !== undefined && interaction.id !== undefined;

    if (!hasBasicProperties) {
        return false;
    }

    const isApplicationCommand =
        "commandType" in interaction &&
        (interaction.commandType === ApplicationCommandType.ChatInput ||
            interaction.commandType === ApplicationCommandType.Message ||
            interaction.commandType === ApplicationCommandType.User);

    if (!isApplicationCommand) {
        console.error("[Debug] ApplicationCommand type check failed");
        return false;
    }

    const hasReplyMethod =
        "reply" in interaction && typeof interaction.reply === "function";

    if (!hasReplyMethod) {
        console.error("[Debug] Reply method check failed");
        return false;
    }

    return true;
}

// Checks if the bot has the required permission
function hasRequiredPermissions(interaction, permission) {
    if (!interaction.guild) return false;

    const botMember = interaction.guild.members.cache.get(
        interaction.client.user.id
    );

    return botMember?.permissions.has(permission) ?? false;
}

// Permission error handler for the bot
export const defaultPermissionErrorForBot = async (
    interaction,
    permission,
    customMessage = ""
) => {
    try {
        if (!isRepliableInteraction(interaction)) {
            console.error("[Permission Error] Interaction is not repliable:", {
                type: interaction.type || "Undefined",
                id: interaction.id || "Undefined",
                constructor: interaction.constructor.name,
            });
            return true;
        }

        if (!interaction.guild) {
            await interaction.reply({
                content: `${emojis.danger} This command can only be used in servers.`,
                flags: MessageFlags.Ephemeral,
            });
            return true;
        }

        if (!hasRequiredPermissions(interaction, permission)) {
            await interaction.reply({
                content:
                    customMessage ||
                    `${
                        emojis.danger
                    } I don't have the necessary permissions to perform this action:\n\`${new PermissionsBitField(
                        permission
                    )
                        .toArray()
                        .join(", ")}\``,
                flags: MessageFlags.Ephemeral,
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error("[Permission Error] Unexpected error:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            interactionType: interaction.type || "Undefined",
            interactionId: interaction.id || "Undefined",
        });
        return true;
    }
};

// Permission error handler for members
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
        await interaction.reply({
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
