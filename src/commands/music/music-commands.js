import { PermissionFlagsBits, SlashCommandBuilder, bold } from "discord.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import {
    exclamationmark_triangleEmoji,
    foward_emoji,
    infinity_emoji,
    info_bubbleEmoji,
    play_emoji,
} from "../../shortcuts/emojis.js";
import player, { waitForQueueVar } from "../../index.js";
import { DisTubeError } from "distube";

export default {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music! ☕️")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("play")
                .setDescription("Play music!")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("youtube")
                        .setDescription(
                            "Pick, paste, play. Never been this easy!"
                        )
                        .addStringOption((option) =>
                            option
                                .setName("query")
                                .setNameLocalizations({
                                    ChineseCN: "查询",
                                    it: "query",
                                    tr: "sorgula",
                                    "pt-BR": "consulta",
                                    ro: "interogare",
                                    el: "ερώτημα",
                                })
                                .setDescription("The URL or name of the song!")
                                .setDescriptionLocalizations({
                                    ChineseCN: "歌曲的URL或名称！",
                                    it: "L'URL o il nome della canzone!",
                                    tr: "Şarkının URL'si veya adı!",
                                    "pt-BR": "O URL ou nome da música!",
                                    ro: "URL-ul sau numele cântecului!",
                                    el: "Το URL ή το όνομα του τραγουδιού!",
                                })
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("control")
                .setDescription("Control music :3")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("autoplay")
                        .setDescription("Let just me play music for ya!")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("skip")
                        .setDescription("Let's skip this. I aggreeee!")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("playing")
                        .setDescription("What is this track's name? 👀")
                )
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

        await interaction.deferReply();

        const { options, member, guild, channel } = interaction;
        const subgroup = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;
        const queue = player.getQueue(guild);

        const botVoiceChannelId = guild.members.me.voice.channelId;
        if (!voiceChannel) {
            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} You are not in a voice channel!`,
            });
        }
        if (botVoiceChannelId && member.voice.channelId !== botVoiceChannelId) {
            return interaction.reply({
                content: `${exclamationmark_triangleEmoji} The music player is already active in <#${guild.members.me.voice.channelId}>`,
                ephemeral: true,
            });
        }

        switch (subgroup) {
            case "play":
                switch (subcommand) {
                    case "youtube":
                        player
                            .play(voiceChannel, query, {
                                textChannel: channel,
                                member: member,
                            })
                            .catch((error) => {
                                if (
                                    error instanceof DisTubeError &&
                                    error.message === "NOT_SUPPORTED_URL"
                                ) {
                                    return interaction.followUp({
                                        content: `${exclamationmark_triangleEmoji} The provided URL is not supported.`,
                                    });
                                } else {
                                    console.error("An error occurred:", error);
                                    return interaction.followUp({
                                        content: `${exclamationmark_triangleEmoji} The provided URL is not supported.`,
                                    });
                                }
                            });

                        waitForQueueVar((queueVarMessage) => {
                            setTimeout(() => {
                                return interaction.followUp({
                                    content: `${queueVarMessage}`,
                                    allowedMentions: { parse: [] },
                                });
                            }, 1000);
                        });
                        break;
                }
                break;

            case "control":
                if (!queue) {
                    return interaction.reply({
                        content: `${info_bubbleEmoji} There is no queue.`,
                    });
                }

                switch (subcommand) {
                    case "autoplay":
                        const autoplay = queue.toggleAutoplay();

                        await interaction.editReply({
                            content: `${infinity_emoji} Autoplay is ${
                                autoplay ? bold("on") : bold("off")
                            } now.`,
                        });
                        break;
                    case "skip":
                        try {
                            const skippedTrack = queue.skip();
                            return interaction.editReply({
                                content: `# ${foward_emoji} Skipping to new track\n> Now playing: ${bold(
                                    (await skippedTrack).name
                                )}`,
                            });
                        } catch (error) {
                            if (
                                error instanceof DisTubeError &&
                                error.code === "NO_UP_NEXT"
                            ) {
                                return interaction.followUp({
                                    content: `${exclamationmark_triangleEmoji} There is no up next song to skip, eh. End of the list?`,
                                });
                            }
                        }
                        break;
                    case "playing":
                        const playedTrack = queue.songs[0];
                        const file = playedTrack.thumbnail || "";

                        await interaction.editReply({
                            content: `## ${play_emoji} Playing\n>>> **Song name:** ${playedTrack.name}\n**Song duration:** ${playedTrack.formattedDuration}\n__**Added by:**__ ${playedTrack.user}`,
                            files: [file],
                            allowedMentions: { parse: [] },
                        });
                        break;
                }
                break;
            default:
                break;
        }
    },
};
