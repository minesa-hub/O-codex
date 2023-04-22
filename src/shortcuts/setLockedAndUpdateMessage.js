import { time } from "discord.js";

export async function setLockedAndUpdateMessage(interaction, reason = "") {
    const formattedTime = time(new Date(), "R");
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
