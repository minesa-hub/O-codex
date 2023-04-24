// Importing time from discord.js
import { time } from "discord.js";

// Exporting the setLockedAndUpdateMessage function
export async function setLockedAndUpdateMessage(interaction, reason = "") {
    // Getting the formatted time
    const formattedTime = time(new Date(), "R");

    // Setting the channel to locked
    interaction.channel.setLocked(true);

    // Updating the message
    await interaction.update({
        content: `<:lock:1098978659890626671> Locked this issue successfully. To unlock this issue, please enable it manually on "unlock" button.`,
        embeds: [],
        components: [],
    });

    // Sending the message
    await interaction.channel.send({
        content: `<:lock:1098978659890626671> **${
            interaction.user.username
        }** locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staffs ${formattedTime}`,
    });
}
