import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import player from "../../index.js";
import {
    exclamationmark_triangleEmoji,
    foward_emoji,
    info_bubbleEmoji,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setNameLocalizations({
            ChineseCN: "跳过",
            it: "salta",
            tr: "atla",
            "pt-BR": "pular",
            ro: "sari",
            el: "παράλειψη",
        })
        .setDescription("skip it!")
        .setDescriptionLocalizations({
            ChineseCN: "跳过它！",
            it: "Salta!",
            tr: "atla!",
            "pt-BR": "pule!",
            ro: "sari!",
            el: "παράλειψη!",
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

        const song = queue.skip();

        return interaction.reply({
            content: `# ${foward_emoji} Skipping to new song\n> Now playing: **${
                (await song).name
            }**`,
        });
    },
};
