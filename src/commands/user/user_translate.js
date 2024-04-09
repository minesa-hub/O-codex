import translate from "@iamtraction/google-translate";
import { swap_emoji } from "../../shortcuts/emojis.js";
import { EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: {
        name: "Translate Message (Personal)",
        name_localizations: {
            "zh-CN": "翻译消息（个人的）",
            it: "Traduci Messaggio (Personale)",
            tr: "Mesajı Çevir (Kişisel)",
            "pt-BR": "Traduzir Mensagem (Pessoal)",
            ro: "Traduceți Mesajul (Personal)",
            el: "Μετάφραση Μηνύματος (Προσωπικό)",
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
                    content: `Message has no content to translate.`,
                    ephemeral: true,
                });

            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;

            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale }
            );

            const embed = new EmbedBuilder()
                .setDescription(`# ${swap_emoji} Translate Message`)
                .setFields([
                    {
                        name: "Original Message",
                        value: `${message.content}`,
                    },
                    {
                        name: "Translated Message",
                        value: `${translated.text}`,
                    },
                ])
                .setColor(EMBED_COLOR);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (error) {
            await interaction.reply({
                content: `An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
