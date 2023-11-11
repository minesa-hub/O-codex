import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import { bubble_leftEmoji, bubble_rightEmoji } from "../../shortcuts/emojis.js";

export default {
    data: {
        customId: "create-discussion-modal",
    },

    execute: async ({ interaction }) => {
        const discussionTitleInput =
            interaction.fields.getTextInputValue("discussion-title");
        const discussionDescriptionInput = interaction.fields.getTextInputValue(
            "discussion-description",
        );

        const discussionTitleCapitalized = discussionTitleInput
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        const embed = new EmbedBuilder()
            .setTitle(discussionTitleCapitalized)
            .setDescription(
                discussionDescriptionInput == ""
                    ? `${bubble_leftEmoji} Not shared their opinion.`
                    : `> ${bubble_leftEmoji} ${discussionDescriptionInput}`,
            );

        const button = new ButtonBuilder()
            .setCustomId("add-comment")
            .setLabel("Create Discussion")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(bubble_rightEmoji);

        const row = new ActionRowBuilder().addComponents(button);

        return interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });
    },
};
