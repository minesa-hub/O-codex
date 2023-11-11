import { time, bold } from "discord.js";
import { lockEmoji } from "./emojis.js";

export async function setLockedAndUpdateMessage(interaction, reason = "") {
    const formattedTime = time(new Date(), "R");

    interaction.channel.setLocked(true);

    await interaction.update({
        content: `${lockEmoji} Locked this issue successfully. To unlock this issue, please enable it manually on "unlock" button.`,
        embeds: [],
        components: [],
    });

    await interaction.channel.send({
        content: `${lockEmoji} ${bold(interaction.user.username)} locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staffs ${formattedTime}`,
    });
}
