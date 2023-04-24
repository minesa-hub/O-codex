// Import the required modules
import {
    ActionRowBuilder,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    time,
} from "discord.js";
import { lockButton } from "../modals/create-issue-title.js";
import {
    issueClosedEmoji,
    issueReopenEmoji,
    skipEmoji,
} from "../../shortcuts/emojis.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

// Defining the menu
const menu3 = new StringSelectMenuBuilder()
    .setCustomId("issue-select-menu")
    .setDisabled(false)
    .setMaxValues(1)
    .setPlaceholder("Action to close issue")
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as completed")
            .setValue("issue-menu-close")
            .setDescription("Done, closed, fixed, resolved")
            .setEmoji(issueClosedEmoji)
            .setDefault(false),
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as not planned")
            .setValue("issue-menu-duplicate")
            .setDescription("Won’t fix, can’t repo, duplicate, stale")
            .setEmoji(skipEmoji),
    );
// exporting the menu
export const row3 = new ActionRowBuilder().addComponents(menu3);

// Exporting the command
export default {
    // The command data contains customID
    data: {
        customId: "issue-select-menu",
    },
    // The command
    execute: async ({ interaction }) => {
        // getting the value of the menu option
        let value = interaction.values[0];

        // getting the time
        const formattedTime = time(new Date(), "R");

        // Switching the value
        switch (value) {
            // If the value is issue-menu-close
            case "issue-menu-close":
                // Checking the permissions
                if (
                    await defaultBotPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;
                // Checking the permissions
                if (
                    await defaultUserPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;

                // Creating the menu
                const menu1 = new StringSelectMenuBuilder()
                    .setCustomId("issue-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen Issue")
                            .setValue("issue-menu-reopen")
                            .setEmoji(issueReopenEmoji)
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as not planned")
                            .setValue("issue-menu-duplicate")
                            .setDescription(
                                "Won’t fix, can’t repo, duplicate, stale",
                            )
                            .setEmoji(skipEmoji),
                    );
                // Creating the row
                const row1 = new ActionRowBuilder().addComponents(menu1);

                // Checking if the channel is archived
                if (interaction.channel.archived) {
                    // If it is archived, unarchive it
                    await interaction.channel.setArchived(false);
                    // Update the menu
                    await interaction.update({
                        components: [row1, lockButton],
                    });
                    // Send a message
                    await interaction.channel.send({
                        content: `${issueClosedEmoji} **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });
                    // Archive the channel
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`,
                    );
                } else {
                    // If it is not archived, update the menu
                    await interaction.update({
                        components: [row1, lockButton],
                    });
                    // Send a message
                    await interaction.channel.send({
                        content: `${issueClosedEmoji} **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });
                    // Archive the channel
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`,
                    );
                }
                break;
            // If the value is issue-menu-duplicate
            case "issue-menu-duplicate":
                // Checking the permissions
                if (
                    await defaultBotPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;
                // Checking the permissions
                if (
                    await defaultUserPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;

                // Creating the menu
                const menu2 = new StringSelectMenuBuilder()
                    .setCustomId("issue-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen Issue")
                            .setValue("issue-menu-reopen")
                            .setEmoji(issueReopenEmoji),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as completed")
                            .setValue("issue-menu-close")
                            .setDescription("Done, closed, fixed, resolved")
                            .setEmoji(issueClosedEmoji)
                            .setDefault(false),
                    );
                // Creating the row
                const row2 = new ActionRowBuilder().addComponents(menu2);

                // Update the menu
                await interaction.update({ components: [row2, lockButton] });
                // Send a message
                await interaction.channel.send({
                    content: `${skipEmoji} **${interaction.user.username}** __closed__ this as not planned ${formattedTime}`,
                });
                // Archive the channel
                await interaction.channel.setArchived(
                    true,
                    `${interaction.user.username} marked as not planned`,
                );
                break;
            // If the value is issue-menu-reopen
            case "issue-menu-reopen":
                // Checking the permissions
                if (
                    await defaultBotPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;
                // Checking the permissions
                if (
                    await defaultUserPermError(
                        interaction,
                        PermissionFlagsBits.ManageThreads,
                    )
                )
                    return;

                // defining the thread channel
                let threadChannel = interaction.channel;

                // Unarchive the channel
                await threadChannel.setArchived(
                    false,
                    `${interaction.user.username} marked as open`,
                );
                // Send a message
                await interaction.update({ components: [row3, lockButton] });
                break;
            // If the value is none of the above
            default:
                // do nothing :)
                break;
        }
    },
};
