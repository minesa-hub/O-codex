import translate from "@iamtraction/google-translate";
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

const translateCommand = {
    data: new ContextMenuCommandBuilder()
        .setName("Translate")
        .setNameLocalizations({
            tr: "Çevir",
            it: "Tradurre",
            ChineseCN: "翻译",
        })
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        // Getting the message from the context menu
        const message = interaction.options.getMessage("message", true);
        await interaction.deferReply({ ephemeral: true });

        // Getting the language from the command arguments
        if (!message.content)
            return interaction.editReply({ content: "There is no text in this message." });

        try {
            // Translating the message
            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;
            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                {
                    to: locale,
                },
            );

            // Sending the translated message
            return interaction.editReply({ content: translated.text });
        } catch (error) {
            // Sending an error message
            return interaction.editReply({
                content: "An error occurred while translating the message.",
            });
        }
    },
};

export default translateCommand;
