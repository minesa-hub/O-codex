import { PermissionFlagsBits } from "discord.js";
import { setLockedAndUpdateMessage } from "../../shortcuts/setLockedAndUpdateMessage.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: {
        customId: "ticket-lock-reason",
    },
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ManageThreads
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewAuditLog
            )
        )
            return;

        let value = interaction.values[0];

        switch (value) {
            case "ticket-lock-reason-other":
                setLockedAndUpdateMessage(interaction);
                break;
            case "ticket-lock-reason-off-topic":
                setLockedAndUpdateMessage(interaction, "as **off-topic**");
                break;
            case "ticket-lock-reason-too-heated":
                setLockedAndUpdateMessage(interaction, "as **too heated**");
                break;
            case "ticket-lock-reason-resolved":
                setLockedAndUpdateMessage(interaction, "as **resolved**");
                break;
            case "ticket-lock-reason-spam":
                setLockedAndUpdateMessage(interaction, "as **spam**");
                break;
            default:
                break;
        }
    },
};
