import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import player from "../../index.js";
import {
    exclamationmark_triangleEmoji,
    info_bubbleEmoji,
    music_note,
} from "../../shortcuts/emojis.js";

export default {
    data: new SlashCommandBuilder().setName("skip").setDescription("skip it!"),
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

        const queue = player.getQueue(guild);

        if (!queue) {
            return interaction.reply({
                content: `${info_bubbleEmoji} There is no queue.`,
            });
        }

        const song = queue.skip();

        return interaction.reply({
            content: `# ${music_note} Skipping to new song\n> Now playing ${
                (await song).name
            }.`,
        });
    },
};
