import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import player from "../../index.js";
import {
    exclamationmark_triangleEmoji,
    infinity_emoji,
    info_bubbleEmoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setNameLocalizations({
            ChineseCN: "自动播放",
            it: "riproduzione-automatica",
            tr: "otomatik-oynatma",
            "pt-BR": "reprodução-automática",
            ro: "redare-automată",
            el: "αυτόματη-αναπαραγωγή",
        })
        .setDescription("Toggle autoplay!")
        .setDescriptionLocalizations({
            ChineseCN: "切换自动播放！",
            it: "Attiva/disattiva riproduzione automatica!",
            tr: "Otomatik oynatmayı aç/kapat!",
            "pt-BR": "Ativar/desativar reprodução automática!",
            ro: "Comută redarea automată!",
            el: "Εναλλαγή αυτόματης αναπαραγωγής!",
        }),
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

        const queue = player.getQueue(guild);

        if (!queue) {
            return interaction.reply({
                content: `${info_bubbleEmoji} There is no queue.`,
            });
        }

        const autoplay = queue.toggleAutoplay();

        return interaction.reply({
            content: `${infinity_emoji} Autoplay is ${
                autoplay ? "on" : "off"
            } now.`,
        });
    },
};
