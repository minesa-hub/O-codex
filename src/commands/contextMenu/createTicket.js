import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ApplicationIntegrationType,
    InteractionContextType,
    ChannelType,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
} from "discord.js";

import {
    emoji_ticketCreated,
    emoji_ticket_done,
    emoji_ticket_stale,
    emoji_ticket,
    emoji_info,
    emoji_danger,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { lockButton } from "../../components/modals/create-ticket-title.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Quick-Ticket")
        .setNameLocalizations({
            it: "Biglietto Rapido",
            tr: "Hızlı Bilet",
            ro: "Bilet Rapid",
            el: "Γρήγορο Εισιτήριο",
            ChineseCN: "快速票证",
            "pt-BR": "Ingresso Rápido",
        })
        .setType(ApplicationCommandType.Message)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .setContexts([InteractionContextType.Guild]),
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
                `${emoji_danger} Kaeru can't create the thread and add you to thread to send message to there. Please contact with a staff member. This has to be fixed.`
            )
        )
            return;

        const message = interaction.options.getMessage("message");

        if (message.channel.isThread()) {
            return interaction.reply({
                content: `${emoji_info} You can't create ticket inside ticket. Huh?`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });

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
                    .setEmoji(emoji_ticket_done)
                    .setDefault(false),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("ticket-menu-duplicate")
                    .setDescription("Won’t fix, can’t repo, duplicate, stale")
                    .setEmoji(emoji_ticket_stale)
            );

        const menuRow = new ActionRowBuilder().addComponents(menu);

        let thread = await interaction.channel.threads.create({
            name: `— Quick-ticket by ${interaction.user.username}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened a thread for support`,
            invitable: true,
        });

        await thread.send({
            content: `## ${emoji_ticket} <@${interaction.user.id}>, you have opened a quick-support for this message\n> ${message.content}\n> -# Jump to [message](${message.url})\n> -# ———————————————\n- Message sent by __@${message.author.username}__`,
            components: [menuRow, lockButton],
            flags: MessageFlags.HasThread,
        });

        await interaction.editReply({
            content: `# ${emoji_ticketCreated} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members.`,
        });
    },
};
