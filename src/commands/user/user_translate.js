import translate from "@iamtraction/google-translate";

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
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getMessage("message");

        try {
            if (!message.content)
                return interaction.editReply({
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

            await interaction.editReply({
                content: `# Translate Message\n### Original Message\n${message.content}\n\n### Translated Message\n${translated.text}`,
            });
        } catch (error) {
            await interaction.editReply({
                content: `An error occurred while translating the message.`,
                ephemeral: true,
            });
        }
    },
};
