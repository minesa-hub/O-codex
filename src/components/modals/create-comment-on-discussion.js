// Importing the required modules
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import { arrowUpEmoji, discussionButtonEmoji } from "../../shortcuts/emojis.js";

// Exporting the command
export default {
    // The command data contains customID
    data: {
        customId: "create-discussion-modal",
    },
    // The command
    execute: async ({ interaction }) => {
        // Getting the values from the inputs
        const discussionTitleInput =
            interaction.fields.getTextInputValue("discussion-title");
        const discussionDescriptionInput = interaction.fields.getTextInputValue(
            "discussion-description",
        );
        // Capitalizing the title
        const discussionTitleCapitalized = discussionTitleInput
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        // Creating the embed
        const embed = new EmbedBuilder()
            .setTitle(discussionTitleCapitalized)
            .setDescription(discussionDescriptionInput)
            .setThumbnail(
                "https://media.discordapp.net/attachments/861208192121569280/1098398274714599434/8FCA1239-C15C-49CC-B854-EABD299893AF.png?width=473&height=473",
            )
            .setColor(0x1e1e1e)
            .setFooter({
                text: `Created by: ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
            });
        // Creating the button
        const button = new ButtonBuilder()
            .setCustomId("add-comment")
            .setLabel("Create Discussion")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(discussionButtonEmoji);
        // Creating the row
        const row = new ActionRowBuilder().addComponents(button);
        // Editing the reply
        const pollMessage = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });
        // Awaiting the reaction
        await pollMessage.react(arrowUpEmoji);
    },
};
