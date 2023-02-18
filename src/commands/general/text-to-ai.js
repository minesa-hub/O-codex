import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import config from '../../../config.js';

// Creating the command
export default {
    data: new SlashCommandBuilder()
        .setName('ask-ai')
        .setDescription('— Ask to artificial intelligence anything in your mind!')
        .setNameLocalizations({
            tr: 'yapay-zekaya-sor',
            it: "chiedi-all'intelligenza-artificiale",
            'zh-CN': '问人工智能',
        })
        .setDescriptionLocalizations({
            tr: '— Aklınızdaki her şeyi yapay zekaya sorun!',
            it: "— Chiedi all'intelligenza artificiale qualsiasi cosa nella tua mente!",
            'zh-CN': '— 向人工智能询问您的想法！',
        })
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('• So... What is it?')
                .setRequired(true)
                .setNameLocalizations({ tr: 'konu', it: 'soggetto', 'zh-CN': '主题' })
                .setDescriptionLocalizations({
                    tr: '• Ehm... Ne soracaksın?',
                    'zh-CN': '• 嗯……你会问什么？',
                    it: '• Ehm... Cosa chiederai?',
                }),
        ),
    async execute({ interaction }) {
        // Configuration of openai
        const configuration = new Configuration({
            apiKey: config.openai.apiKey,
            organization: config.openai.organization,
        });
        const openai = new OpenAIApi(configuration);

        // OpenAI
        if (interaction.channel.id === '795473337697697837') {
            if (interaction.author.bot) return;
            
            try {
                const completion = await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: interaction.content,
                    temperature: 0.5,
                    max_tokens: 400,
                    top_p: 1.0,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.0,
                    stop: ['You:'],
                });

                interaction.reply(`${completion.data.choices[0].text}`);
            } catch (error) {
                interaction.reply({
                    content: `Sorry, couldn't answer that. I don't want to...`,
                    ephemeral: true,
                });
                console.log(error);
            }
        }
    },
};
