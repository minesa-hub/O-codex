import {
    ChannelType,
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    roleMention,
    MessageFlags,
    ModalSubmitInteraction,
    TextChannel,
} from "discord.js";
import { emojis } from "../../shortcuts/emojis.ts";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.ts";
import { getStaffRoleId } from "../../shortcuts/database.ts";

const lockButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("ticket-lock-conversation")
        .setLabel("Lock Ticket")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        .setEmoji(emojis.ticketLock)
);

interface PermissionCheck {
    permission: bigint;
    errorMessage?: string;
}

const requiredPermissions: PermissionCheck[] = [
    { permission: PermissionFlagsBits.ViewChannel },
    { permission: PermissionFlagsBits.UseExternalEmojis },
    { permission: PermissionFlagsBits.SendMessages },
    { permission: PermissionFlagsBits.EmbedLinks },
    {
        permission: PermissionFlagsBits.CreatePrivateThreads,
        errorMessage:
            'Please contact a staff member and say: "Kaeru can\'t create a private thread due to missing permissions."',
    },
    {
        permission: PermissionFlagsBits.SendMessagesInThreads,
        errorMessage: `${emojis.danger} Kaeru can't create the thread and add you to it. Please contact a staff member. This must be fixed.`,
    },
];

export default {
    data: {
        customId: "create-ticket-modal",
    },

    execute: async ({
        interaction,
    }: {
        interaction: ModalSubmitInteraction;
    }): Promise<void> => {
        // Checking permissions
        for (const { permission, errorMessage } of requiredPermissions) {
            const hasError = await defaultPermissionErrorForBot(
                interaction,
                permission,
                errorMessage
            );
            if (hasError) return;
        }

        const ticketTitle =
            interaction.fields.getTextInputValue("ticket-title");

        const embed = new EmbedBuilder()
            .setTitle(`${emojis.doorEnter} Now, we did it. Here we are!`)
            .setDescription(
                "Our staff member(s) will take care of this thread soon. While they are on their way, why don’t you talk about your ticket?"
            )
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/736571695170584576/1327617435418755185/23679.png"
            );

        // Ticket close menu
        const menu = new StringSelectMenuBuilder()
            .setCustomId("ticket-select-menu")
            .setDisabled(false)
            .setMaxValues(1)
            .setPlaceholder("Action to close ticket")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as completed")
                    .setValue("ticket-menu-done")
                    .setDescription("Done, closed, fixed, resolved")
                    .setEmoji(emojis.ticketDone),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("ticket-menu-duplicate")
                    .setDescription(
                        "Won’t fix, can’t reproduce, duplicate, stale"
                    )
                    .setEmoji(emojis.ticketStale),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close with comment")
                    .setValue("ticket-menu-close")
                    .setDescription("Close with a comment")
                    .setEmoji(emojis.ticketClose)
            );

        // Ticket label menu
        const labelMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket-label-menu")
            .setPlaceholder("Select labels for this ticket")
            .setMinValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bug")
                    .setValue("label-bug")
                    .setEmoji(emojis.bugLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Reward")
                    .setValue("label-reward")
                    .setEmoji(emojis.rewardLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Question")
                    .setValue("label-question")
                    .setEmoji(emojis.questionLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Discussion")
                    .setValue("label-discussion")
                    .setEmoji(emojis.discussionLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Help")
                    .setValue("label-help")
                    .setEmoji(emojis.helpLabel)
            );

        const menuRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
        const labelMenuRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                labelMenu
            );

        if (
            !interaction.channel ||
            !(interaction.channel instanceof TextChannel)
        ) {
            await interaction.reply({
                content: `${emojis.danger} Failed to create a ticket: Invalid channel.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const thread = await interaction.channel?.threads.create({
            name: `— Quick-ticket by ${interaction.user.username}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened a thread for support`,
            invitable: true,
        });

        await interaction.reply({
            content: `# ${emojis.ticketCreated} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members.`,
            flags: MessageFlags.Ephemeral,
        });

        const staffRoleId = getStaffRoleId(interaction.guild!.id);

        if (!staffRoleId) {
            await interaction.reply({
                content: `${emojis.danger} Staff role is not configured for this guild.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        let pinMessage = await thread.send({
            content: `${roleMention(staffRoleId)}`,
            embeds: [embed],
            components: [menuRow, labelMenuRow, lockButton],
        });

        await thread.members.add(interaction.user);

        if (
            interaction.guild!.members.me!.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        ) {
            await pinMessage.pin();
        }
    },
};

export { lockButton };
