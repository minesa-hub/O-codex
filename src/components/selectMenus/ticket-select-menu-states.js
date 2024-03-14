import {
    ActionRowBuilder,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    time,
} from "discord.js";
import { lockButton } from "../modals/create-ticket-title.js";
import {
    checkmark_emoji,
    return_emoji,
    slash_emoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

const menu3 = new StringSelectMenuBuilder()
    .setCustomId("ticket-select-menu")
    .setDisabled(false)
    .setMaxValues(1)
    .setPlaceholder("Action to close ticket")
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as completed")
            .setValue("ticket-menu-close")
            .setDescription("Done, closed, fixed, resolved")
            .setEmoji(checkmark_emoji)
            .setDefault(false),
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as not planned")
            .setValue("ticket-menu-duplicate")
            .setDescription("Won’t fix, can’t repo, duplicate, stale")
            .setEmoji(slash_emoji)
    );

export const row3 = new ActionRowBuilder().addComponents(menu3);

export default {
    data: {
        customId: "ticket-select-menu",
    },

    execute: async ({ interaction }) => {
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
                PermissionFlagsBits.ViewAuditLog,
                `It is needed to check last state of thread.`
            )
        )
            return;

        let value = interaction.values[0];

        const formattedTime = time(new Date(), "R");

        switch (value) {
            case "ticket-menu-close":
                const menu1 = new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen ticket")
                            .setValue("ticket-menu-reopen")
                            .setEmoji(return_emoji)
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as not planned")
                            .setValue("ticket-menu-duplicate")
                            .setDescription(
                                "Won’t fix, can’t repo, duplicate, stale"
                            )
                            .setEmoji(slash_emoji)
                    );

                const row1 = new ActionRowBuilder().addComponents(menu1);

                if (interaction.channel.archived) {
                    await interaction.channel.setArchived(false);

                    await interaction.update({
                        components: [row1, lockButton],
                    });

                    await interaction.channel.send({
                        content: `${checkmark_emoji} **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });

                    await interaction.channel.setLocked(true);
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`
                    );
                } else {
                    await interaction.update({
                        components: [row1, lockButton],
                    });

                    await interaction.channel.send({
                        content: `${checkmark_emoji} **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });

                    await interaction.channel.setLocked(true);
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`
                    );
                }
                break;

            case "ticket-menu-duplicate":
                const menu2 = new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen ticket")
                            .setValue("ticket-menu-reopen")
                            .setEmoji(return_emoji),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as completed")
                            .setValue("ticket-menu-close")
                            .setDescription("Done, closed, fixed, resolved")
                            .setEmoji(checkmark_emoji)
                            .setDefault(false)
                    );

                const row2 = new ActionRowBuilder().addComponents(menu2);

                await interaction.update({ components: [row2, lockButton] });

                await interaction.channel.send({
                    content: `${slash_emoji} **${interaction.user.username}** __closed__ this as not planned ${formattedTime}`,
                });

                await interaction.channel.setArchived(
                    true,
                    `${interaction.user.username} marked as not planned`
                );
                break;

            case "ticket-menu-reopen":
                await interaction.channel.setArchived(
                    false,
                    `${interaction.user.username} marked as open`
                );

                await interaction.update({ components: [row3, lockButton] });
                break;

            default:
                break;
        }
    },
};
