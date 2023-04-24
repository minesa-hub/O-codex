// Importing the required modules
import {
    ActionRowBuilder,
    ModalBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { defaultBotPermError } from "../../shortcuts/defaultPermissionsErrors.js";

// Exporting the command
export default {
    // The command data
    data: new SlashCommandBuilder()
        .setName("create-discussion")
        .setNameLocalizations({
            tr: "tartışma-oluştur",
            it: "crea-discussione",
            ChineseCN: "创建讨论",
        })
        .setDescription("Create a discussion about anything!")
        .setDescriptionLocalizations({
            tr: "Herhangi bir şey hakkında tartışma oluşturun!",
            it: "Crea una discussione su qualsiasi cosa!",
            ChineseCN: "创建关于任何事情的讨论！",
        })
        .setDMPermission(false),
    // The command is output
    execute: async ({ interaction }) => {
        // if the bot doesn't have the permission to add reactions
        if (defaultBotPermError(interaction, PermissionFlagsBits.AddReactions))
            return;

        // creating the modal
        const discussionModal = new ModalBuilder()
            .setCustomId("create-discussion-modal")
            .setTitle("Discussion Creation");
        // creating the modal inputs
        const discussionTitleInput = new TextInputBuilder()
            .setCustomId("discussion-title")
            .setLabel("What do you want to discuss?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("I think this bot is awesome!")
            .setMaxLength(100)
            .setMinLength(10);
        const discussionDescriptionInput = new TextInputBuilder()
            .setCustomId("discussion-description")
            .setLabel("Why do you think this?")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(
                "I think this bot is awesome because it's open source and it's free!",
            )
            .setMaxLength(1000)
            .setMinLength(10);
        // creating the modal rows
        const row = new ActionRowBuilder().addComponents(discussionTitleInput);
        const row2 = new ActionRowBuilder().addComponents(
            discussionDescriptionInput,
        );
        // adding the rows to the modal
        discussionModal.addComponents(row, row2);

        // sending the modal
        interaction.showModal(discussionModal).catch((e) => console.log(e));
    },
};
