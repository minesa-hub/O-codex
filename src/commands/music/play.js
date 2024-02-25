import { QueryType } from "discord-player";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { defaultUserPermError } from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays music")
        .addStringOption((option) =>
            option
                .setName("search")
                .setDescription("Searching a song and plays it")
                .setRequired(true),
        ),
    execute: async ({ client, interaction }) => {
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({
                content: "Please join to a voice channel to play a music.",
                ephemeral: true,
            });

        if (defaultUserPermError(interaction, PermissionFlagsBits.ViewChannel))
            return;

        let queue;

        if (!client.player.nodes.has(interaction.guild)) {
            queue = client.player.nodes.create(interaction.guild);
        } else {
            queue = client.player.nodes.get(interaction.guild);
        }

        const songUrl = interaction.options.getString("search");
        const result = client.player.search(songUrl, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (result.tracks.length === 0) {
            return interaction.reply({
                content: "No results found.",
                ephemeral: true,
            });
        }

        const song = result.tracks[0];
        queue.addTrack(song);

        return interaction.reply({
            content: `Playing ${song}`,
            ephemeral: true,
        });
    },
};
