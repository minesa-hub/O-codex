import {
    ActionRowBuilder,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { defaultBotPermError } from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: {
        customId: "create-issue",
    },
    execute: async ({ interaction }) => {
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.CreatePrivateThreads,
            )
        )
            return;

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

        interaction.showModal(modal).catch((e) => console.log(e));
    },
};
