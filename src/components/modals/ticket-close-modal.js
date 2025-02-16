import { time, MessageFlags, EmbedBuilder } from "discord.js";
import { emojis } from "../../functions/emojis.js";

export default {
    data: {
        customId: "ticket-close-modal",
    },

    execute: async ({ interaction }) => {
        const closeReason =
            interaction.fields.getTextInputValue("close-reason");

        const formattedTime = time(new Date(), "R");

        await interaction.channel.send({
            content: `${emojis.ticketClose} **${interaction.user.username}** __closed__ this ticket as completed at ${formattedTime}`,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${interaction.user.username} commented`,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setColor(0x388bfd)
                    .setDescription(closeReason),
            ],
        });

        await interaction.reply({
            content: `Ticket has been successfully closed with the reason: "${closeReason}".`,
            flags: MessageFlags.Ephemeral,
        });

        await interaction.channel.setLocked(true);
        await interaction.channel.setArchived(
            true,
            `${interaction.user.username} marked the ticket as completed with reason: ${closeReason}`
        );
    },
};
