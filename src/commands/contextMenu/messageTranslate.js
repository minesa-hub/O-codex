// Importing the required modules
import translate from "@iamtraction/google-translate";
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { alertEmoji, infoEmoji } from "../../shortcuts/emojis.js";

// Exporting the command
export default {
    // The command data
    data: new ContextMenuCommandBuilder()
        .setName("Translate Message")
        .setNameLocalizations({
            ChineseCN: "翻译消息",
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
        })
        .setType(ApplicationCommandType.Message),
    // The command output
    execute: async ({ interaction }) => {
        // Getting the message from the interaction option
        const message = interaction.options.getMessage("message");

        // Checking if the message is not found
        try {
            // Checking if the message has content
            if (!message.content)
                return interaction.reply({
                    content: `${infoEmoji} Message has no content to translate.`,
                    ephemeral: true,
                });

            // Getting the locale
            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;
            // Translating the message
            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale },
            );

            // Sending the translated message
            await interaction.reply({
                content: translated.text,
            });
            // Catching the error
        } catch (error) {
            // Sending the error message
            await interaction.reply({
                content: `${alertEmoji} An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
