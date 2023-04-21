import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ThreadAutoArchiveDuration,
} from "discord.js";

export default {
    data: {
        customId: "add-comment",
    },
    execute: async ({ interaction }) => {
        const [discussionEmoji] = ["<:discussion_button:1098366305947635784>"];

        const disabledButton = new ButtonBuilder()
            .setCustomId("disabled-button")
            .setLabel("Created the Discussion")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            .setEmoji(discussionEmoji);

        const row = new ActionRowBuilder().addComponents(disabledButton);

        if (interaction.message.hasThread) {
            await interaction.update({
                components: [row],
            });

            return interaction.followUp({
                content: `${discussionEmoji} Discussion already created by <@${interaction.message.thread.ownerId}>.`,
                ephemeral: true,
            });
        }

        if (interaction.channel.type !== ChannelType.GuildText)
            return interaction.reply({
                content: `${discussionEmoji} You **can not** create a discussion in this channel.`,
                ephemeral: true,
            });

        interaction.channel.threads
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
