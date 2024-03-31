import {
    AttachmentBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import player from "../../index.js";
import {
    exclamationmark_triangleEmoji,
    info_bubbleEmoji,
    play_emoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("now")
        .setNameLocalizations({
            ChineseCN: "当前",
            it: "adesso",
            tr: "şimdi",
            "pt-BR": "agora",
            ro: "acum",
            el: "τώρα",
        })
        .setDescription("Display current status.")
        .setDescriptionLocalizations({
            ChineseCN: "显示当前状态。",
            it: "Mostra lo stato attuale.",
            tr: "Mevcut durumu göster.",
            "pt-BR": "Mostra o status atual.",
            ro: "Afișează starea curentă.",
            el: "Εμφάνιση τρέχουσας κατάστασης.",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playing")
                .setNameLocalizations({
                    ChineseCN: "播放中",
                    it: "in-riproduzione",
                    tr: "oynatıyor",
                    "pt-BR": "tocando",
                    ro: "redare",
                    el: "αναπαραγωγή",
                })
                .setDescription("What is playing?")
                .setDescriptionLocalizations({
                    ChineseCN: "正在播放什么？",
                    it: "Cosa sta riproducendo?",
                    tr: "Ne çalıyor?",
                    "pt-BR": "O que está tocando?",
                    ro: "Ce se redă?",
                    el: "Τι αναπαράγεται;",
                })
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
                PermissionFlagsBits.AttachFiles
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.Connect
            ) ||
            defaultPermissionErrorForBot(interaction, PermissionFlagsBits.Speak)
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
            content: `## ${play_emoji} Playing\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Added by:**__ ${song.user}`,
            attachment: [new AttachmentBuilder(song.thumbnail || "")],
        });
    },
};
