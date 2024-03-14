import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export default {
    data: {
        customId: "create-ticket",
    },
    execute: async ({ interaction }) => {
        const modal = new ModalBuilder()
            .setCustomId("create-ticket-modal")
            .setTitle("ticket Creation");

        const input = new TextInputBuilder()
            .setCustomId("ticket-title")
            .setLabel("Please explain your ticket with a few words.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Cannot post memes")
            .setMaxLength(100);
        const firstActionRow = new ActionRowBuilder().addComponents(input);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal).catch((e) => console.log(e));
    },
};
