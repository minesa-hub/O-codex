import { time } from "discord.js";

export default {
    data: {
        customId: "issue-lock-reason",
    },
    execute: async ({ interaction }) => {
        let value = interaction.values[0];
        const formattedTime = time(new Date(), "R");

        async function setLockedAndUpdateMessage(interaction, reason = "") {
            interaction.channel.setLocked(true);

            await interaction.update({
                content: `<:lock:1098978659890626671> Locked this issue successfully. To unlock this issue, please enable it manually on "unlock" button.`,
                embeds: [],
                components: [],
            });

            await interaction.channel.send({
                content: `<:lock:1098978659890626671> **${
                    interaction.user.username
                }** locked${
                    reason ? ` ${reason}` : ""
                } and limited conversation to staffs ${formattedTime}`,
            });
        }

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
