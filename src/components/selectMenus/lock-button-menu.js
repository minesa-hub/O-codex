import { PermissionFlagsBits } from "discord.js";
import { setLockedAndUpdateMessage } from "../../shorthand/setLockedAndUpdateMessage.js";

export default {
    data: {
        customId: "issue-lock-reason",
    },
    execute: async ({ interaction }) => {
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageThreads,
            )
        )
            return interaction.reply({
                content: "You don't have permission to lock this issue.",
                ephemeral: true,
            });

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
