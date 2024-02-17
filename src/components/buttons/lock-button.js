import {
    ActionRowBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: {
        customId: "issue-lock-conversation",
    },
    execute: async ({ interaction }) => {
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;

        if (
            await defaultUserPermError(
                interaction,
                PermissionFlagsBits.ManageThreads,
            )
        )
            return;

        const lockButtonExplanation = new EmbedBuilder()
            .setTitle("Lock conversation on this issue")
            .setThumbnail(
                "https://media.discordapp.net/attachments/736571695170584576/1208128307166449664/d59654a9-100a-432d-8e9b-d6a026dffa7a.png?ex=65e2282a&is=65cfb32a&hm=e616682b0279995500c428b2cfd17b3dd890ab2f2a55838aefa211e9970dc6b9&=&format=webp&quality=lossless&width=1032&height=1032",
            )
            .setDescription(
                `* Other user(s) can’t add new comments to this issue.\n* You and other moderators with access to this channel can still leave comments that others can see.\n* You can always unlock this issue again in the future.`,
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
