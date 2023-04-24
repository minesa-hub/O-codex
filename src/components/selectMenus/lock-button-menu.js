// Import the required modules
import { PermissionFlagsBits } from "discord.js";
import { setLockedAndUpdateMessage } from "../../shortcuts/setLockedAndUpdateMessage.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

// Exporting the command
export default {
    // The command data contains customID
    data: {
        customId: "issue-lock-reason",
    },
    // The command
    execute: async ({ interaction }) => {
        // Checking the permissions
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;
        // Checking the permissions
        if (
            await defaultUserPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;

        // getting the value of the menu option
        let value = interaction.values[0];

        // Switching the value
        switch (value) {
            // If the value is issue-lock-reason-other
            case "issue-lock-reason-other":
                // Calling the function
                setLockedAndUpdateMessage(interaction);
                break;
            // If the value is issue-lock-reason-off-topic
            case "issue-lock-reason-off-topic":
                // Calling the function
                setLockedAndUpdateMessage(interaction, "as **off-topic**");
                break;
            // If the value is issue-lock-reason-too-heated
            case "issue-lock-reason-too-heated":
                // Calling the function
                setLockedAndUpdateMessage(interaction, "as **too heated**");
                break;
            // If the value is issue-lock-reason-resolved
            case "issue-lock-reason-resolved":
                // Calling the function
                setLockedAndUpdateMessage(interaction, "as **resolved**");
                break;
            // If the value is issue-lock-reason-spam
            case "issue-lock-reason-spam":
                // Calling the function
                setLockedAndUpdateMessage(interaction, "as **spam**");
                break;
            // If none of the above
            default:
                // do nothing
                break;
        }
    },
};
