import { SlashCommandBuilder } from "discord.js";
import player, { waitForQueueVar } from "../../index.js";
import { exclamationmark_triangleEmoji } from "../../shortcuts/emojis.js";
import { DisTubeError } from "distube";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(".")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Pick, paste, play. Never been this easy!")
                .addStringOption((opt) =>
                    opt
                        .setName("query")
                        .setDescription("The URL or name of the song!")
                        .setRequired(true),
                ),
        ),
    execute: async ({ interaction }) => {
        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
        const vc = member.voice.channel;

        if (!vc)
            return interaction.reply({
                content: `${exclamationmark_triangleEmoji} You are not in a voice channel!`,
                ephemeral: true,
            });

        const botVoiceChannelId = guild.members.me.voice.channelId;
        if (botVoiceChannelId && member.voice.channelId !== botVoiceChannelId) {
            return interaction.reply({
                content: `${exclamationmark_triangleEmoji} The music player is already active in <#${guild.members.me.voice.channelId}>`,
                ephemeral: true,
            });
        }

        await interaction.deferReply();
        player
            .play(vc, query, { textChannel: channel, member: member })
            .catch((error) => {
                if (
                    error instanceof DisTubeError &&
                    error.message === "NOT_SUPPORTED_URL"
                ) {
                    interaction.followUp({
                        content: `${exclamationmark_triangleEmoji} The provided URL is not supported.`,
                    });
                } else {
                    console.error("An error occurred:", error);
                    interaction.followUp({
                        content: `${exclamationmark_triangleEmoji} The provided URL is not supported.`,
                    });
                }
            });

        waitForQueueVar((queueVarMessage) => {
            setTimeout(() => {
                interaction.followUp({
                    content: `${queueVarMessage}`,
                });
            }, 1000);
        });
    },
};
