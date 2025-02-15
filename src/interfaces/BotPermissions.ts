import { PermissionFlagsBits } from "discord.js";

export interface PermissionCheck {
    permission: bigint;
    errorMessage?: string;
}

export const defaultTicketPermissions: PermissionCheck[] = [
    { permission: PermissionFlagsBits.ViewChannel },
    { permission: PermissionFlagsBits.UseExternalEmojis },
    { permission: PermissionFlagsBits.SendMessages },
    { permission: PermissionFlagsBits.EmbedLinks },
    {
        permission: PermissionFlagsBits.CreatePrivateThreads,
        errorMessage:
            'Lütfen yetkililere "Kaeru özel thread oluşturma iznine sahip değil" mesajını iletin.',
    },
    {
        permission: PermissionFlagsBits.SendMessagesInThreads,
        errorMessage:
            "Kaeru thread oluşturamıyor ve sizi ekleyemiyor. Lütfen yetkililere bildirin.",
    },
];

export const defaultMessagePermissions: PermissionCheck[] = [
    { permission: PermissionFlagsBits.ViewChannel },
    { permission: PermissionFlagsBits.UseExternalEmojis },
    { permission: PermissionFlagsBits.SendMessages },
];
