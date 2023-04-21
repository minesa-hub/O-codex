import { time } from "discord.js";

async function setLockedAndUpdateMessage(interaction) {
    interaction.channel.setLocked(true);

    await interaction.update({
        content: `<:lock:1098978659890626671> Locked thread channel successfully.`,
        embeds: [],
        components: [],
    });
}

export default {
    data: {
        customId: "issue-lock-reason",
    },
    execute: async ({ interaction }) => {
        let value = interaction.values[0];
        const formattedTime = time(new Date(), "R");

        switch (value) {
            case "issue-lock-reason-other":
                setLockedAndUpdateMessage(interaction);

                await interaction.channel.send({
                    content: `<:lock:1098978659890626671> **${interaction.user.username}** locked and limited conversation to staffs ${formattedTime}.`,
                });
                break;
            case "issue-lock-reason-off-topic":
                setLockedAndUpdateMessage(interaction);

                await interaction.channel.send({
                    content: `<:lock:1098978659890626671> **${interaction.user.username}** locked as **off-topic** and limited conversation to staffs ${formattedTime}.`,
                });
                break;
            case "issue-lock-reason-too-heated":
                setLockedAndUpdateMessage(interaction);

                await interaction.channel.send({
                    content: `<:lock:1098978659890626671> **${interaction.user.username}** locked as **too heated** and limited conversation to staffs ${formattedTime}.`,
                });
                break;
            case "issue-lock-reason-resolved":
                setLockedAndUpdateMessage(interaction);

                await interaction.channel.send({
                    content: `<:lock:1098978659890626671> **${interaction.user.username}** locked as **resolved** and limited conversation to staffs ${formattedTime}.`,
                });
                break;
            case "issue-lock-reason-spam":
                setLockedAndUpdateMessage(interaction);

                await interaction.channel.send({
                    content: `<:lock:1098978659890626671> **${interaction.user.username}** locked as **spam** and limited conversation to staffs ${formattedTime}.`,
                });
                break;
            default:
                break;
        }
    },
};
