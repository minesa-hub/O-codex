import translate from "@iamtraction/google-translate";
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import {
    arrow_triangle_swapEmoji,
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
} from "../../shortcuts/emojis.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Translate Message")
        .setNameLocalizations({
            ChineseCN: "翻译消息",
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
        })
        .setType(ApplicationCommandType.Message),
    execute: async ({ interaction }) => {
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
                { to: locale },
            );

            await interaction.reply({
                content: `# ${arrow_triangle_swapEmoji} Translate Message\n**Original Message**\n${message.content}\n\n**Translated Message**\n${translated.text}`,
            });
        } catch (error) {
            await interaction.reply({
                content: `${exclamationmark_circleEmoji} An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
