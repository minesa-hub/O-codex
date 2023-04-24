// Importing required modules
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    ThreadAutoArchiveDuration,
} from "discord.js";
import {
    alertEmoji,
    discussionButtonEmoji,
    infoEmoji,
} from "../../shortcuts/emojis.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

// Exporting the command
export default {
    // The command data contains customID
    data: {
        customId: "add-comment",
    },
    // The command
    execute: async ({ interaction }) => {
        // Checking if the bot has the required permissions
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.CreatePublicThreads,
            )
        )
            return;
        // Checking if the user has the required permissions
        if (
            await defaultUserPermError(
                interaction,
                PermissionFlagsBits.CreatePublicThreads,
            )
        )
            return;

        // Creating the button
        const disabledButton = new ButtonBuilder()
            .setCustomId("disabled-button")
            .setLabel("Created the Discussion")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            .setEmoji(discussionButtonEmoji);
        // Creating the row
        const row = new ActionRowBuilder().addComponents(disabledButton);

        // Checking if the message has a thread
        if (interaction.message.hasThread) {
            await interaction.update({
                components: [row],
            });

            // Checking if the thread is created by the user
            await interaction.followUp({
                content: `${infoEmoji} Discussion already created by <@${interaction.message.thread.ownerId}>.`,
                ephemeral: true,
            });
        }

        // Checking if the channel is not a guild text channel
        if (interaction.channel.type !== ChannelType.GuildText)
            await interaction.reply({
                content: `${alertEmoji} You **can not** create a discussion in this channel <@${interaction.user.id}>.`,
                ephemeral: true,
            });

        // Creating the thread
        await interaction.channel.threads
            .create({
                name: interaction.message.embeds[0].title,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                type: ChannelType.PublicThread,
                reason: "For discussing",
                startMessage: interaction.message.id,
            })
            .then((poll) => {
                // Adding the user to the thread
                poll.members.add(interaction.user);

                // Updating the message
                interaction.update({ components: [row] });
            });
    },
};
