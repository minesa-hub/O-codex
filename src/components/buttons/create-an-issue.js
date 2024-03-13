import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export default {
    data: {
        customId: "create-issue",
    },
    execute: async ({ interaction }) => {
        const modal = new ModalBuilder()
            .setCustomId("create-issue-modal")
            .setTitle("Issue Creation");

        const input = new TextInputBuilder()
            .setCustomId("issue-title")
            .setLabel("Please explain your issue with a few words.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Cannot post memes")
            .setMaxLength(100);
        const firstActionRow = new ActionRowBuilder().addComponents(input);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal).catch((e) => console.log(e));
    },
};
