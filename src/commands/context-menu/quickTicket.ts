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
    MessageContextMenuCommandInteraction,
    TextChannel,
} from "discord.js";

import { emojis } from "../../shortcuts/emojis";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors";
import { lockButton } from "../../components/modals/create-ticket-title";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Quick-Ticket")
        .setNameLocalizations({
            it: "Biglietto Rapido",
            tr: "Hızlı Bilet",
            ro: "Bilet Rapid",
            el: "Γρήγορο Εισιτήριο",
            "zh-CN": "快速票证",
            "pt-BR": "Ingresso Rápido",
        })
        .setType(ApplicationCommandType.Message)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .setContexts([InteractionContextType.Guild]),

    execute: async (interaction: MessageContextMenuCommandInteraction) => {
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
                `Please contact a staff member saying "Kaeru can't create a private thread due to missing permissions".`
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessagesInThreads,
                `${emojis.danger} Kaeru can't create the thread and add you to it. Please contact a staff member to fix this issue.`
            )
        ) {
            return;
        }

        const message = await interaction.channel?.messages.fetch(
            interaction.targetId
        );
        if (!message) {
            return interaction.reply({
                content: `${emojis.info} Unable to find the message.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (message.channel.isThread()) {
            return interaction.reply({
                content: `${emojis.info} You can't create a ticket inside another ticket thread.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
                    .setEmoji(emojis.ticketDone)
                    .setDefault(false),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("ticket-menu-duplicate")
                    .setDescription("Won’t fix, can’t repo, duplicate, stale")
                    .setEmoji(emojis.ticketStale)
            );

        const menuRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

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

        if (!thread) {
            return interaction.editReply({
                content: `${emojis.danger} Failed to create a support thread.`,
            });
        }

        await thread.send({
            content: `## ${emojis.ticket} <@${interaction.user.id}>, you have opened a quick-support ticket for this message\n> ${message.content}\n> -# Jump to [message](${message.url})\n> -# ———————————————\n- Message sent by __@${message.author.username}__`,
            components: [menuRow, lockButton],
        });

        await interaction.editReply({
            content: `# ${emojis.ticketCreated} Created <#${thread.id}>\nNow, you can discuss your issue with our staff members.`,
        });
    },
} as const;
