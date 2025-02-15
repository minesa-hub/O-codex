import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ApplicationIntegrationType,
    InteractionContextType,
    ChannelType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    MessageContextMenuCommandInteraction,
    TextChannel,
    MessageFlags,
} from "discord.js";

import { emojis } from "../../shortcuts/emojis.ts";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.ts";
import { lockButton } from "../../components/modals/create-ticket-title.ts";
import { defaultTicketPermissions } from "../../interfaces/BotPermissions.ts";

const ticketMenuOptions = [
    {
        label: "Close as completed",
        value: "ticket-menu-close",
        description: "Done, closed, fixed, resolved",
        emoji: emojis.ticketDone,
        default: false,
    },
    {
        label: "Close as not planned",
        value: "ticket-menu-duplicate",
        description: "Won't fix, can't repo, duplicate, stale",
        emoji: emojis.ticketStale,
    },
];

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

    execute: async ({
        interaction,
    }: {
        interaction: MessageContextMenuCommandInteraction;
    }) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            for (const {
                permission,
                errorMessage,
            } of defaultTicketPermissions) {
                const hasError = await defaultPermissionErrorForBot(
                    interaction,
                    permission,
                    errorMessage
                );
                if (hasError) return;
            }

            const message = await interaction.channel?.messages.fetch(
                interaction.targetId
            );

            if (!message) {
                return await interaction.editReply({
                    content: `${emojis.info} Mesaj bulunamadı.`,
                });
            }

            if (message.channel.isThread()) {
                return await interaction.editReply({
                    content: `${emojis.info} Başka bir bilet threadi içinde bilet oluşturamazsınız.`,
                });
            }

            if (
                !interaction.channel ||
                !(interaction.channel instanceof TextChannel)
            ) {
                return await interaction.editReply({
                    content: `${emojis.danger} Bilet oluşturulamadı: Geçersiz kanal.`,
                });
            }

            const menu = new StringSelectMenuBuilder()
                .setCustomId("ticket-select-menu")
                .setDisabled(false)
                .setMaxValues(1)
                .setPlaceholder("Bileti kapatma işlemi");

            ticketMenuOptions.forEach((option) => {
                menu.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(option.label)
                        .setValue(option.value)
                        .setDescription(option.description)
                        .setEmoji(option.emoji)
                        .setDefault(option.default || false)
                );
            });

            const menuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    menu
                );

            try {
                const thread = await interaction.channel.threads.create({
                    name: `— ${interaction.user.username}'nin hızlı bileti`,
                    autoArchiveDuration: 60,
                    type: ChannelType.PrivateThread,
                    reason: `${interaction.user.username} destek için bir thread açtı`,
                    invitable: true,
                });

                await thread.send({
                    content: [
                        `## ${emojis.ticket} <@${interaction.user.id}>, bu mesaj için hızlı destek bileti açtınız`,
                        `> ${message.content}`,
                        `> -# [Mesaja git](${message.url})`,
                        `> -# ———————————————`,
                        `- Mesaj gönderen: __@${message.author.username}__`,
                    ].join("\n"),
                    components: [menuRow, lockButton],
                });

                return await interaction.editReply({
                    content: `# ${emojis.ticketCreated} <#${thread.id}> oluşturuldu\nŞimdi ekip üyeleriyle sorununuzu tartışabilirsiniz.`,
                });
            } catch (error) {
                console.error("[Thread Creation Error]:", error);
                return await interaction.editReply({
                    content: `${emojis.danger} Thread oluşturulurken bir hata oluştu.`,
                });
            }
        } catch (error) {
            console.error("[QuickTicket Error]:", error);
            return await interaction.editReply({
                content: `${emojis.danger} Bilet oluşturulurken bir hata oluştu.`,
            });
        }
    },
} as const;
