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
} from "discord.js";
import {
    lockEmoji,
    exclamationmark_circleEmoji,
    ticket_created,
    checkmark_emoji,
    slash_emoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { getStaffRoleId } from "../../shortcuts/database.js";

let lockButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("ticket-lock-conversation")
        .setLabel("Lock Thread")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        .setEmoji(lockEmoji)
);

export default {
    data: {
        customId: "create-ticket-modal",
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
                PermissionFlagsBits.EmbedLinks
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.CreatePrivateThreads,
                `Please contact with a staff member saying "Kaeru can't create private thread due permission is missing".`
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessagesInThreads,
                `${exclamationmark_circleEmoji} Kaeru can't create the tread and add you to thread to send message to there. Please contact with a staff member. This has to be fixed.`
            )
        )
            return;

        const ticketTitle =
            interaction.fields.getTextInputValue("ticket-title");

        const embed = new EmbedBuilder()
            .setTitle("Now, we are here…")
            .setDescription(
                "Our staff member(s) will take care of this thread sooner. While they are on their way, why don’t you talk about your ticket?"
            )
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/736571695170584576/1217884073305964564/support.png?ex=6605a5ee&is=65f330ee&hm=479e2ab6d7143e563d2b6bc279de30562b4e70d8944df151e6354138361b24a7&"
            );

        const menu = new StringSelectMenuBuilder()
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

        const menuRow = new ActionRowBuilder().addComponents(menu);

        let thread = await interaction.channel.threads.create({
            name: `${ticketTitle}`,
            autoArchiveDuration: 1440,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened a thread for support`,
            invitable: false,
        });

        await interaction.reply({
            content: `# ${ticket_created} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members.`,
            ephemeral: true,
        });

        const staffRoleId = await getStaffRoleId(interaction.guild.id);

        let pinMessage = await thread.send({
            content: `${roleMention(staffRoleId)}`,
            embeds: [embed],
            components: [menuRow, lockButton],
        });

        await thread.members.add(interaction.user);
        if (
            interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        )
            await pinMessage.pin();
        else return;
    },
};

export { lockButton };
