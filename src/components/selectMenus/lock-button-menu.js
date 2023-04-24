import { PermissionFlagsBits } from "discord.js";
import { setLockedAndUpdateMessage } from "../../shortcuts/setLockedAndUpdateMessage.js";
import { infoEmoji } from "../../shortcuts/emojis.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: {
        customId: "issue-lock-reason",
    },
    execute: async ({ interaction }) => {
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;
        if (
            await defaultUserPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;

        let value = interaction.values[0];

        switch (value) {
            case "issue-lock-reason-other":
                setLockedAndUpdateMessage(interaction);
                break;
            case "issue-lock-reason-off-topic":
                setLockedAndUpdateMessage(interaction, "as **off-topic**");
                break;
            case "issue-lock-reason-too-heated":
                setLockedAndUpdateMessage(interaction, "as **too heated**");
                break;
            case "issue-lock-reason-resolved":
                setLockedAndUpdateMessage(interaction, "as **resolved**");
                break;
            case "issue-lock-reason-spam":
                setLockedAndUpdateMessage(interaction, "as **spam**");
                break;
            default:
                break;
        }
    },
};
