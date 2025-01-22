import { time, bold, PermissionFlagsBits } from "discord.js";
import { emoji_ticket_lock } from "./emojis.js";
import { defaultPermissionErrorForBot } from "./permissionErrors.js";

export async function setLockedAndUpdateMessage(interaction, reason = "") {
    if (
        defaultPermissionErrorForBot(
            interaction,
            PermissionFlagsBits.ViewChannel
        ) ||
        defaultPermissionErrorForBot(
            interaction,
            PermissionFlagsBits.UseExternalEmojis
        ) ||
        defaultPermissionErrorForBot(
            interaction,
            PermissionFlagsBits.SendMessages
        ) ||
        defaultPermissionErrorForBot(
            interaction,
            PermissionFlagsBits.ManageThreads
        ) ||
        defaultPermissionErrorForBot(
            interaction,
            PermissionFlagsBits.ViewAuditLog
        )
    )
        return;

    const formattedTime = time(new Date(), "R");

    await interaction.channel.setLocked(true);

    await interaction.update({
        content: `${emoji_ticket_lock} Locked this ticket successfully. To unlock this ticket, please enable it manually on "unlock" button.`,
        embeds: [],
        components: [],
    });

    await interaction.channel.send({
        content: `${lockEmoji} ${bold(interaction.user.username)} locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staffs ${formattedTime}`,
    });
}
