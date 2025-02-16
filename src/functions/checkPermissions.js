import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { emojis } from "../resources/emojis.js";

function hasRequiredPermissions(interaction, permission) {
    if (!interaction.guild) return false;

    const botMember = interaction.guild.members.cache.get(
        interaction.client.user.id
    );
    return botMember?.permissions.has(permission) ?? false;
}

export const checkPermissions = async (
    interaction,
    permissions,
    customMessage = ""
) => {
    try {
        for (const { permission, errorMessage } of permissions) {
            const hasPermission = hasRequiredPermissions(
                interaction,
                permission
            );

            if (!hasPermission) {
                await interaction.reply({
                    content: `${
                        emojis.important
                    } I don't have the necessary permission: \`${Object.keys(
                        PermissionFlagsBits
                    ).find(
                        (key) => PermissionFlagsBits[key] === permission
                    )}\`. ${errorMessage || customMessage}`,
                    flags: MessageFlags.Ephemeral,
                });
                return true;
            }
        }

        if (interaction.guild) {
            for (const { permission, errorMessage } of permissions) {
                let checkingPermission = true;
                if (interaction.member) {
                    checkingPermission =
                        interaction.member.permissions.has(permission);
                }

                if (!checkingPermission) {
                    await interaction.reply({
                        content: `${
                            emojis.important
                        } You don't have \`${Object.keys(
                            PermissionFlagsBits
                        ).find(
                            (key) => PermissionFlagsBits[key] === permission
                        )}\` permission to do this action, <@${
                            interaction.user.id
                        }>. ${errorMessage || ""}`,
                        flags: MessageFlags.Ephemeral,
                    });
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error("[Permission Error] Unexpected error:", error);
        return true;
    }
};
