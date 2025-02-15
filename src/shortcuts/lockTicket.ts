import { time, bold, ButtonInteraction, ThreadChannel } from "discord.js";
import { emojis } from "./emojis.ts";
import { defaultPermissionErrorForBot } from "./permissionErrors.ts";
import { defaultTicketPermissions } from "../interfaces/BotPermissions.ts";

export async function setLockedAndUpdateMessage(
    interaction: ButtonInteraction,
    reason: string = ""
): Promise<void> {
    for (const { permission, errorMessage } of defaultTicketPermissions) {
        const hasError = await defaultPermissionErrorForBot(
            interaction,
            permission,
            errorMessage
        );
        if (hasError) return;
    }

    const formattedTime = time(new Date(), "R");

    if (!(interaction.channel instanceof ThreadChannel)) {
        await interaction.reply({
            content: `${emojis.important} This action can only be performed in a thread channel.`,
            ephemeral: true,
        });
        return;
    }

    await interaction.channel.setLocked(true);

    await interaction.update({
        content: `${emojis.ticketLock} Locked this ticket successfully. To unlock this ticket, please enable it manually using the "unlock" button.`,
        embeds: [],
        components: [],
    });

    await interaction.channel.send({
        content: `${emojis.ticketLock} ${bold(
            interaction.user.username
        )} locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staff members ${formattedTime}`,
    });
}
