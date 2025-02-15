import {
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";

interface PermissionCheck {
    permission: bigint;
    errorMessage?: string;
}

type CommandInteraction =
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction;

const basePermissions: PermissionCheck[] = [
    { permission: PermissionFlagsBits.ViewChannel },
    { permission: PermissionFlagsBits.SendMessages },
    {
        permission: PermissionFlagsBits.UseExternalEmojis,
        errorMessage:
            "Please notify the staff that Kaeru can't use external emojis.",
    },
    {
        permission: PermissionFlagsBits.EmbedLinks,
        errorMessage: "Please notify the staff that Kaeru can't embed links.",
    },
    {
        permission: PermissionFlagsBits.AttachFiles,
        errorMessage: "Please notify the staff that Kaeru can't attach files.",
    },
];

const defaultTicketPermissions: PermissionCheck[] = [
    ...basePermissions,
    {
        permission: PermissionFlagsBits.CreatePrivateThreads,
        errorMessage:
            'Please forward "Kaeru can\'t create private thread" message to staff of the server.',
    },
    {
        permission: PermissionFlagsBits.SendMessagesInThreads,
        errorMessage:
            "Please notify the staff that Kaeru cannot create threads and add you.",
    },
];

const defaultLockTicketPermissions: PermissionCheck[] = [
    ...basePermissions,
    {
        permission: PermissionFlagsBits.ManageThreads,
        errorMessage:
            "Kaeru can't manage threads, so Kaeru can't lock tickets. 🥹",
    },
    {
        permission: PermissionFlagsBits.ViewAuditLog,
        errorMessage: "Kaeru can't view audit logs to receive information.",
    },
];

export {
    basePermissions,
    defaultTicketPermissions,
    defaultLockTicketPermissions,
    CommandInteraction,
};
