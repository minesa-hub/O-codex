import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('— Play a song.')
        .addStringOption((option) =>
            option.setName('song').setDescription('The song you want to play.').setRequired(true),
        ),
    async execute({ interaction, client }) {
        await interaction.deferReply();

        const song_name = interaction.options.getString('song');

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to play music!',
                ephemeral: true,
            });
        }

        // Create the player
        let player = client.manager.players.get(interaction.guildId);

        if (!player) {
            player = client.manager.create({
                guild: interaction.guildId,
                voiceChannel: interaction.member.voice.channelId,
                textChannel: interaction.channelId,
                selfDeafen: false,
            });
        }

        const songs = await client.manager.search(song_name);

        player.connect();

        player.queue.add(songs.tracks[0]);

        if (!player.playing) return player.play();

        interaction.reply({
            content: `Added ${songs.tracks[0].title} to the queue.`,
            ephemeral: true,
        });
    },
};
