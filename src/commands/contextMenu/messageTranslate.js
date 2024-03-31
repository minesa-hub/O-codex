import translate from "@iamtraction/google-translate";
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
    swap_emoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Translate")
        .setNameLocalizations({
            ChineseCN: "翻译消息",
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
            "pt-BR": "Traduzir Mensagem",
            ro: "Traduceți Mesajul",
            el: "Μετάφραση Μηνύματος",
        })
        .setType(ApplicationCommandType.Message),
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
            )
        )
            return;

        const message = interaction.options.getMessage("message");

        try {
            if (!message.content)
                return interaction.reply({
                    content: `${exclamationmark_triangleEmoji} Message has no content to translate.`,
                    ephemeral: true,
                });

            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;

            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale }
            );

            await interaction.reply({
                content: `# ${swap_emoji} Translate Message\n**Original Message**\n${message.content}\n\n**Translated Message**\n${translated.text}`,
            });
        } catch (error) {
            await interaction.reply({
                content: `${exclamationmark_circleEmoji} An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
