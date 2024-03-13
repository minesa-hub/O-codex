import { PermissionFlagsBits } from "discord.js";
import { setLockedAndUpdateMessage } from "../../shortcuts/setLockedAndUpdateMessage.js";

export default {
    data: {
        customId: "issue-lock-reason",
    },
    execute: async ({ interaction }) => {
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
