import {
    ActionRowBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    bold,
} from "discord.js";
import {
    defaultPermissionErrorForBot,
    defaultPermissionErrorForMember,
} from "../../shortcuts/permissionErrors.js";
import { exclamationmark_triangleEmoji } from "../../shortcuts/emojis.js";

export default {
    data: {
        customId: "ticket-lock-conversation",
    },
    execute: async ({ interaction }) => {
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageThreads
            )
        )
            return interaction.reply({
                content: `${exclamationmark_triangleEmoji} You don't have ${bold(
                    "Manage Threads"
                )} permission to do this action, <@${interaction.user.id}>.`,
                ephemeral: true,
            });

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
            )
        )
            return;

        const lockButtonExplanation = new EmbedBuilder()
            .setTitle("Lock conversation on this ticket")
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/736571695170584576/1217897612653367296/locking.png?ex=6605b28a&is=65f33d8a&hm=895f9a5a074235cece4ba50b95cfdaf8513f6437b5ba024fd25001077ed20fe2&"
            )
            .setDescription(
                `* Other user(s) can’t add new comments to this ticket.\n* You and other moderators with access to this channel can still leave comments that others can see.\n* You can always unlock this ticket again in the future.`
            )
            .setFooter({
                text: "Optionally, choose a reason for locking that others can see.",
            });

        const lockReasonsMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticket-lock-reason")
                .setDisabled(false)
                .setMaxValues(1)
                .setPlaceholder("Choose a reason")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Other")
                        .setValue("ticket-lock-reason-other"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Off-topic")
                        .setValue("ticket-lock-reason-off-topic"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Too heated")
                        .setValue("ticket-lock-reason-too-heated"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Resolved")
                        .setValue("ticket-lock-reason-resolved"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Spam")
                        .setValue("ticket-lock-reason-spam")
                )
        );

        await interaction.reply({
            embeds: [lockButtonExplanation],
            components: [lockReasonsMenu],
            ephemeral: true,
        });
    },
};
