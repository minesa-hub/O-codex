// Importing the required modules
import {
    ActionRowBuilder,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { defaultBotPermError } from "../../shortcuts/defaultPermissionsErrors.js";

// Exporting the command
export default {
    // The command data
    data: {
        customId: "create-issue",
    },
    // The command is output
    execute: async ({ interaction }) => {
        // if the bot doesn't have the permission to add reactions
        if (
            await defaultBotPermError(
                interaction,
                PermissionFlagsBits.CreatePrivateThreads,
            )
        )
            return;
        // creating the modal
        const modal = new ModalBuilder()
            .setCustomId("create-issue-modal")
            .setTitle("Issue Creation");
        // creating the modal inputs
        const input = new TextInputBuilder()
            .setCustomId("issue-title")
            .setLabel("Please explain your issue with a few words.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Cannot post memes")
            .setMaxLength(100);
        // creating the row
        const firstActionRow = new ActionRowBuilder().addComponents(input);

        // adding the row to the modal
        modal.addComponents(firstActionRow);

        // sending the modal
        interaction.showModal(modal).catch((e) => console.log(e));
    },
};
