import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";

export default {
    data: {
        customId: "issue-lock-conversation",
    },
    execute: async ({ interaction }) => {
        const lockButtonExplanation = new EmbedBuilder()
            .setTitle("Lock conversation on this issue")
            .setThumbnail(
                "https://media.discordapp.net/attachments/861208192121569280/1098926903575986317/B7BA836F-E892-48DE-92B2-AA1FB5558DCF.png?width=473&height=473",
            )
            .setDescription(
                `・Other user(s) can’t add new comments to this issue.
・You and other staffs with access to this channel can still leave comments that others can see.
・You can always unlock this issue again in the future.`,
            )
            .setColor(0x1e1e1e)
            .setFooter({
                text: "Optionally, choose a reason for locking that others can see.",
            });

        const lockReasonsMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("issue-lock-reason")
                .setDisabled(false)
                .setMaxValues(1)
                .setPlaceholder("Choose a reason")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Other")
                        .setValue("issue-lock-reason-other"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Off-topic")
                        .setValue("issue-lock-reason-off-topic"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Too heated")
                        .setValue("issue-lock-reason-too-heated"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Resolved")
                        .setValue("issue-lock-reason-resolved"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Spam")
                        .setValue("issue-lock-reason-spam"),
                ),
        );
        await interaction.reply({
            embeds: [lockButtonExplanation],
            components: [lockReasonsMenu],
            ephemeral: true,
        });
    },
};
