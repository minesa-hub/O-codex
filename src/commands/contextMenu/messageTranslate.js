import translate from "@iamtraction/google-translate";
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { alertEmoji, infoEmoji } from "../../shortcuts/emojis.js";

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
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getMessage("message");

        if (!message.content)
            interaction.editReply({
                content: `${infoEmoji} Message has no content to translate.`,
                ephemeral: true,
            });

        try {
            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;
            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale },
            );

            interaction.editReply({
                content: translated.text,
            });
        } catch (error) {
            interaction.editReply({
                content: `${alertEmoji} An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
