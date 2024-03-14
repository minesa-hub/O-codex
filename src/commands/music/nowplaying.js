import {
    AttachmentBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import player from "../../index.js";
import {
    exclamationmark_triangleEmoji,
    info_bubbleEmoji,
    music_note,
} from "../../shortcuts/emojis.js";

export default {
    data: new SlashCommandBuilder()
        .setName("now")
        .setDescription(".")
        .addSubcommand((subcommand) =>
            subcommand.setName("playing").setDescription("What is playing?")
        ),
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;
        const { member, guild } = interaction;
        const vc = member.voice.channel;

        if (!vc)
            return interaction.reply({
                content: `${exclamationmark_triangleEmoji} You are not in a voice channel!`,
                ephemeral: true,
            });

        // const botVoiceChannelId = guild.members.me.voice.channelId;
        // if (botVoiceChannelId && member.voice.channelId !== botVoiceChannelId) {
        //     return interaction.reply({
        //         content: `${exclamationmark_triangleEmoji} The music player is already active in <#${guild.members.me.voice.channelId}>`,
        //         ephemeral: true,
        //     });
        // }

        const queue = player.getQueue(guild);

        if (!queue) {
            return interaction.reply({
                content: `${info_bubbleEmoji} There is no queue.`,
            });
        }

        const song = queue.songs[0];

        return interaction.reply({
            content: `## ${music_note} Playing\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Added by:**__ ${song.user}`,
            attachment: [new AttachmentBuilder(song.thumbnail || "")],
        });
    },
};
