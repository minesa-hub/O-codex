import { SlashCommandBuilder } from 'discord.js';
import { fetch } from 'undici';

const MemeCommand = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('— Sends a random meme from somewhere.')
        .setNameLocalizations({ tr: 'meme', it: 'meme', ChineseCN: '梗图' })
        .setDescriptionLocalizations({
            tr: '— Bir yerden rastgele bir meme gönderir.',
            it: '— Invia un meme casuale da qualche parte.',
            ChineseCN: '— 从某处发送一个随机梗图。',
        }),
    async execute(interaction) {
        // Deferring the reply
        await interaction.deferReply();

        try {
            // Fetching the meme
            const raw = await fetch('https://apis.duncte123.me/meme', { method: 'GET' });
            const response = await raw.json();

            // Sending the meme
            return interaction.editReply({ content: response.data.image });
        } catch (error) {
            // Sending an error message
            return interaction.editReply({
                content: 'An error occurred while fetching the meme.',
                ephemeral: true,
            });
        }
    },
};

export default MemeCommand;
