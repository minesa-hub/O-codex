import translate from "@iamtraction/google-translate";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
    swap_emoji,
} from "../../shortcuts/emojis.js";

export default {
    data: {
        name: "Translate Message",
        name_localizations: {
            "zh-CN": "翻译消息",
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
        },
        integration_types: [1],
        contexts: [0, 1, 2],
        dm_permission: "true",
        type: 3,
    },
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
                { to: locale }
            );

            await interaction.reply({
                content: `# ⇅ Translate Message\n**Original Message**\n${message.content}\n\n**Translated Message**\n${translated.text}`,
            });
        } catch (error) {
            await interaction.reply({
                content: `${exclamationmark_circleEmoji} An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
