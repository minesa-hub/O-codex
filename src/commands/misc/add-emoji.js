import { SlashCommandBuilder, parseEmoji } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('— Adds an emoji to the server.')
        .setNameLocalizations({ tr: 'emojiekle', it: 'aggiungiemoji', ChineseCN: '添加表情' })
        .setDescriptionLocalizations({
            tr: '— Sunucuya bir emoji ekler.',
            it: '— Aggiunge un emoji al server.',
            ChineseCN: '— 将表情添加到服务器。',
        })
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('• The name of the emoji.')
                .setRequired(true)
                .setNameLocalizations({ tr: 'isim', it: 'nome', ChineseCN: '名称' })
                .setDescriptionLocalizations({
                    tr: '• Emojinin adı.',
                    it: "• Il nome dell'emoji.",
                    ChineseCN: '• 表情的名称。',
                }),
        )
        .addStringOption((option) =>
            option
                .setName('emoji')
                .setDescription('• The emoji.')
                .setRequired(true)
                .setNameLocalizations({ tr: 'emoji', it: 'emoji', ChineseCN: '表情' })
                .setDescriptionLocalizations({
                    tr: '• Emoji.',
                    it: '• Emoji.',
                    ChineseCN: '• 表情。',
                }),
        ),
    async execute({ interaction }) {
        // Adding "name" and "emoji" options for the slash
        const name = interaction.options.getString('name');
        const emoji = interaction.options.getString('emoji');

        // Regex
        const regex = RegExp(/(https?:\/\/[^\s]+)/g);

        // Parsing the emoji
        const parse = parseEmoji(emoji);

        try {
            let emojis;
            if (emoji.match(regex)) {
                emojis = await interaction.guild.emojis.create({ attachment: emoji, name });
            } else if (parse.id) {
                const link = `https://cdn.discordapp.com/emojis/${parse.id}.${
                    parse.animated ? 'gif' : 'png'
                }`;
                emojis = await interaction.guild.emojis.create({ attachment: link, name });
            }

            return interaction.reply({
                content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully added.`,
            });
        } catch (err) {
            console.error(err);

            return interaction.reply({
                content: "The emoji is invalid or we don't have more space.",
                ephemeral: true,
            });
        }
    },
};
