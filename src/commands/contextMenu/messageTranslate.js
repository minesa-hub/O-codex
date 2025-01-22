import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
    ApplicationIntegrationType,
    InteractionContextType,
    MessageFlags,
} from "discord.js";
import translate from "@iamtraction/google-translate";
import {
    emoji_danger,
    emoji_info,
    emoji_translate,
    emoji_swap,
    emoji_globe,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Translate")
        .setNameLocalizations({
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
            ro: "Traduceți Mesajul",
            el: "Μετάφραση Μηνύματος",
            ChineseCN: "翻译消息",
            "pt-BR": "Traduzir Mensagem",
        })
        .setType(ApplicationCommandType.Message)
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall,
        ])
        .setContexts([
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild,
        ]),
    execute: async ({ interaction }) => {
        if (InteractionContextType.Guild) {
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
                )
            )
                return;
        }

        await interaction.deferReply();

        const message = interaction.options.getMessage("message");

        try {
            if (!message.content)
                return interaction.editReply({
                    content: `${emoji_info} This message seems to hold no content—nothing to translate across the threads of time.`,
                });

            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;

            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale }
            );

            await interaction.editReply({
                content: `# ${emoji_translate} Translation\n-# ————————————————————\n### ${emoji_globe} Original Message\n${message.content}\n\n### ${emoji_swap} Translated Message (${locale})\n${translated.text}\n\n-# I sent it on below if you need to copy the message.`,
            });

            return interaction.followUp({
                content: `${translated.text}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.log(error);
            await interaction.editReply({
                content: `${emoji_danger} Oh no! A temporal anomaly occurred while translating. Let’s try again later, shall we?`,
            });
        }
    },
};
