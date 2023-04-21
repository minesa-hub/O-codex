import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import {
    arrowUpEmoji,
    discussionButtonEmoji,
} from "../../shortcuts/emojis.js";

export default {
    data: {
        customId: "create-discussion-modal",
    },
    execute: async ({ interaction }) => {
        await interaction.deferReply();

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
            .setDescription(discussionDescriptionInput)
            .setThumbnail(
                "https://media.discordapp.net/attachments/861208192121569280/1098398274714599434/8FCA1239-C15C-49CC-B854-EABD299893AF.png?width=473&height=473",
            )
            .setColor(0x1e1e1e)
            .setFooter({
                text: `Created by: ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
            });
        const button = new ButtonBuilder()
            .setCustomId("add-comment")
            .setLabel("Create Discussion")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(discussionButtonEmoji);

        const row = new ActionRowBuilder().addComponents(button);

        const pollMessage = await interaction.editReply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        await pollMessage.react(arrowUpEmoji);
    },
};
