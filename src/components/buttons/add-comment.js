import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    ThreadAutoArchiveDuration,
} from "discord.js";
import {
    exclamationmark_triangleEmoji,
    bubble_left_and_rightEmoji,
    info_bubbleEmoji,
} from "../../shortcuts/emojis.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: {
        customId: "add-comment",
    },
    execute: async ({ interaction }) => {
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.CreatePublicThreads,
            )
        )
            return;

        if (
            await defaultUserPermError(
                interaction,
                PermissionFlagsBits.CreatePublicThreads,
            )
        )
            return;

        const disabledButton = new ButtonBuilder()
            .setCustomId("disabled-button")
            .setLabel("Created the Discussion")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            .setEmoji(bubble_left_and_rightEmoji);

        const row = new ActionRowBuilder().addComponents(disabledButton);

        if (interaction.message.hasThread) {
            await interaction.update({
                components: [row],
            });

            await interaction.followUp({
                content: `${info_bubbleEmoji} Discussion already created by <@${interaction.message.thread.ownerId}>.`,
                ephemeral: true,
            });
        }

        if (interaction.channel.type !== ChannelType.GuildText)
            await interaction.reply({
                content: `${exclamationmark_triangleEmoji} You **can not** create a discussion in this channel <@${interaction.user.id}>.`,
                ephemeral: true,
            });

        await interaction.channel.threads
            .create({
                name: interaction.message.embeds[0].title,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                type: ChannelType.PublicThread,
                reason: "For discussing",
                startMessage: interaction.message.id,
            })
            .then((poll) => {
                poll.members.add(interaction.user);

                interaction.update({ components: [row] });
            });
    },
};
