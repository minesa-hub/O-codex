import {
    MessageFlags,
    PermissionsBitField,
    BaseInteraction,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { emojis } from "./emojis.ts";

export type CommandInteraction =
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction;

function isRepliableInteraction(
    interaction: BaseInteraction
): interaction is CommandInteraction {
    if (!interaction) return false;

    const hasBasicProperties =
        interaction.type !== undefined && interaction.id !== undefined;

    if (!hasBasicProperties) {
        console.error("[Debug] Temel özellikler eksik");
        return false;
    }

    const isApplicationCommand =
        "commandType" in interaction &&
        (interaction.commandType === ApplicationCommandType.ChatInput ||
            interaction.commandType === ApplicationCommandType.Message ||
            interaction.commandType === ApplicationCommandType.User);

    if (!isApplicationCommand) {
        console.error("[Debug] ApplicationCommand tipi kontrolü başarısız");
        return false;
    }

    const hasReplyMethod =
        "reply" in interaction &&
        typeof (interaction as any).reply === "function";

    if (!hasReplyMethod) {
        console.error("[Debug] Reply metodu kontrolü başarısız");
        return false;
    }

    return true;
}

function hasRequiredPermissions(
    interaction: CommandInteraction,
    permission: bigint
): boolean {
    if (!interaction.guild) return false;

    const botMember = interaction.guild.members.cache.get(
        interaction.client.user.id
    );

    return botMember?.permissions.has(permission) ?? false;
}

export const defaultPermissionErrorForBot = async (
    interaction: BaseInteraction,
    permission: bigint,
    customMessage?: string
): Promise<boolean> => {
    try {
        if (!isRepliableInteraction(interaction)) {
            console.error(
                "[Permission Error] Etkileşim yanıtlanabilir değil:",
                {
                    type: interaction.type || "Tanımsız",
                    id: interaction.id || "Tanımsız",
                    constructor: interaction.constructor.name,
                }
            );
            return true;
        }

        if (!interaction.guild) {
            await interaction.reply({
                content: `${emojis.danger} Bu komut sadece sunucularda kullanılabilir.`,
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
                    } Bu işlem için gerekli izinlere sahip değilim:\n\`${new PermissionsBitField(
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
        console.error("[Permission Error] Beklenmeyen hata:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            interactionType: interaction.type || "Tanımsız",
            interactionId: interaction.id || "Tanımsız",
        });
        return true;
    }
};
