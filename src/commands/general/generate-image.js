// Importing openai
import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import config from '../../../config.js';

// Creating the command
export default {
    data: new SlashCommandBuilder()
        .setName('generate-image')
        .setDescription('— Generate images with A.I.!')
        .setNameLocalizations({
            tr: 'görüntü-oluştur',
            it: 'generare-immagine',
            ChineseCN: '生成图像',
        })
        .setDescriptionLocalizations({
            tr: '— Y.Z. ile görüntüler oluşturun!',
            it: "— Genera immagini con l'intelligenza artificiale!",
            ChineseCN: '— 用人工智能生成图像！',
        })
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('What is your imagination? 👀')
                .setRequired(true)
                .setNameLocalizations({ tr: 'konu' })
                .setDescriptionLocalizations({ tr: '• Hayal gücünde neler var? 👀' }),
        ),
    async execute({ interaction }) {
        await interaction.deferReply();
        
        // Configuration of openai
        const configuration = new Configuration({
            apiKey: config.openai.apiKey,
            organization: config.openai.organization,
        });
        const openai = new OpenAIApi(configuration);

        if (interaction.channel.id === '1071856982748844124') {

            if (interaction.author.bot) return;
            
            try {
                const imageUrl = await openai.createImage({
                    prompt: interaction.options.getString('text'),
                    n: 1,
                    size: '1024x1024',
                });
                interaction.editReply({ content: `${imageUrl.data.data[0].url}` });
            } catch (error) {
                interaction.reply({
                    content:
                        "Couldn't generate that image... Am I the problem or you? Can't decide...",
                    ephemeral: true,
                });
                console.log(error);
            }
        }
    },
};
