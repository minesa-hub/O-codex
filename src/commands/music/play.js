import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import player, { waitForQueueVar } from "../../index.js";
import { exclamationmark_triangleEmoji } from "../../shortcuts/emojis.js";
import { DisTubeError } from "distube";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(".")
        .setNameLocalizations({
            ChineseCN: "播放",
            it: "riproduci",
            tr: "çal",
            "pt-BR": "tocar",
            ro: "redă",
            el: "παίξε",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setNameLocalizations({
                    ChineseCN: "歌曲",
                    it: "canzone",
                    tr: "şarkı",
                    "pt-BR": "música",
                    ro: "cântec",
                    el: "τραγούδι",
                })
                .setDescription("Pick, paste, play. Never been this easy!")
                .setDescriptionLocalizations({
                    ChineseCN: "选取、粘贴、播放。从未如此简单！",
                    it: "Scegli, incolla, riproduci. Non è mai stato così facile!",
                    tr: "Seç, yapıştır, çal. Hiç bu kadar kolay olmamıştı!",
                    "pt-BR": "Escolha, cole, reproduza. Nunca foi tão fácil!",
                    ro: "Alege, lipește, redă. Nu a fost niciodată atât de ușor!",
                    el: "Επίλεξε, επικόλλησε, παίξε. Δεν ήταν ποτέ τόσο εύκολο!",
                })
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
