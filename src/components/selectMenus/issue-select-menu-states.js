import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    time,
} from "discord.js";
import { lockButton } from "../modals/create-issue-title.js";

export default {
    data: {
        customId: "issue-select-menu",
    },
    execute: async ({ interaction }) => {
        let value = interaction.values[0];
        const formattedTime = time(new Date(), "R");

        switch (value) {
            case "issue-menu-close":
                const menu1 = new StringSelectMenuBuilder()
                    .setCustomId("issue-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen Issue")
                            .setValue("issue-menu-reopen")
                            .setEmoji("<:issue_reopen:1097285719577342002>")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as not planned")
                            .setValue("issue-menu-duplicate")
                            .setDescription(
                                "Won’t fix, can’t repo, duplicate, stale",
                            )
                            .setEmoji("<:skip:1097273560738832437>"),
                    );

                const row1 = new ActionRowBuilder().addComponents(menu1);
                if (interaction.channel.archived) {
                    await interaction.channel.setArchived(false);
                    await interaction.update({
                        components: [row1, lockButton],
                    });
                    await interaction.channel.send({
                        content: `<:issue_closed:1097273507383103631> **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`,
                    );
                } else {
                    await interaction.update({
                        components: [row1, lockButton],
                    });
                    await interaction.channel.send({
                        content: `<:issue_closed:1097273507383103631> **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                    });
                    await interaction.channel.setArchived(
                        true,
                        `${interaction.user.username} marked as completed`,
                    );
                }
                break;
            case "issue-menu-duplicate":
                const menu2 = new StringSelectMenuBuilder()
                    .setCustomId("issue-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Reopen Issue")
                            .setValue("issue-menu-reopen")
                            .setEmoji("<:issue_reopen:1097285719577342002>"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as completed")
                            .setValue("issue-menu-close")
                            .setDescription("Done, closed, fixed, resolved")
                            .setEmoji("<:issue_closed:1097273507383103631>")
                            .setDefault(false),
                    );

                const row2 = new ActionRowBuilder().addComponents(menu2);

                await interaction.update({ components: [row2, lockButton] });
                await interaction.channel.send({
                    content: `<:skip:1097273560738832437> **${interaction.user.username}** __closed__ this as not planned ${formattedTime}`,
                });
                await interaction.channel.setArchived(
                    true,
                    `${interaction.user.username} marked as not planned`,
                );
                break;
            case "issue-menu-reopen":
                await interaction.channel.fetch();
                let threadChannel = interaction.channel;
                await threadChannel.setArchived(
                    false,
                    `${interaction.user.username} marked as open`,
                );
                await interaction.channel.send({
                    content: `<:issue_reopen:1097285719577342002> **${interaction.user.username}** __reopened__ this ${formattedTime}`,
                });

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
                            .setEmoji("<:issue_closed:1097273507383103631>")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as not planned")
                            .setValue("issue-menu-duplicate")
                            .setDescription(
                                "Won’t fix, can’t repo, duplicate, stale",
                            )
                            .setEmoji("<:skip:1097273560738832437>"),
                    );

                const row3 = new ActionRowBuilder().addComponents(menu3);

                await interaction.update({ components: [row3, lockButton] });
                break;
            default:
                break;
        }
    },
};
