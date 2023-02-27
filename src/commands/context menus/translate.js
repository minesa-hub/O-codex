import translate from '@iamtraction/google-translate';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('Translate')
        .setNameLocalizations({
            tr: 'Çevir',
            it: 'Tradurre',
            ChineseCN: '翻译',
        })
        .setType(ApplicationCommandType.Message),
    async execute({ interaction }) {
        // Getting the message from the context menu
        const message = interaction.options.getMessage('message', true);
        await interaction.deferReply({ ephemeral: true });

        // Getting the language from the command arguments
        if (!message.content)
            return interaction.editReply({ content: 'There is no text in this message.' });

        try {
            // Translating the message
            const locale = !['zh-CN', 'zh-TW'].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;
            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ''),
                {
                    to: locale,
                },
            );

            // Creating an embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: 'Translation',
                    iconURL: interaction.user.displayAvatarURL(),
                    url: 'https://discord.gg/Q8aTPfeNra',
                })
                .setThumbnail(
                    'https://media.discordapp.net/attachments/861208192121569280/1079837970309332992/Community_forum.png?width=473&height=473',
                )
                .setColor('#70a2ff')
                .addFields(
                    { name: 'Original', value: message.content, inline: true },
                    { name: 'Translated', value: translated.text, inline: true },
                )
                .setFooter({
                    text: 'Translated!',
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            // Sending the translated message
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            // Sending an error message
            return interaction.editReply({
                content: 'An error occurred while translating the message.',
            });
        }
    },
};
