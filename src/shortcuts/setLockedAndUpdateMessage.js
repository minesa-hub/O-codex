import { time, bold } from "discord.js";
import { lockEmoji } from "./emojis.js";

export async function setLockedAndUpdateMessage(interaction, reason = "") {
    const formattedTime = time(new Date(), "R");

    await interaction.channel.setLocked(true);

    await interaction.update({
        content: `${lockEmoji} Locked this ticket successfully. To unlock this ticket, please enable it manually on "unlock" button.`,
        embeds: [],
        components: [],
    });

    await interaction.channel.send({
        content: `${lockEmoji} ${bold(interaction.user.username)} locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staffs ${formattedTime}`,
    });
}
