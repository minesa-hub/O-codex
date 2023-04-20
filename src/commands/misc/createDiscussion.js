import {
    ActionRowBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export default {
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
    execute: async ({ interaction }) => {
        const discussionModal = new ModalBuilder()
            .setCustomId("create-discussion-modal")
            .setTitle("Discussion Creation");

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

        const row = new ActionRowBuilder().addComponents(discussionTitleInput);
        const row2 = new ActionRowBuilder().addComponents(
            discussionDescriptionInput,
        );

        discussionModal.addComponents(row, row2);

        await interaction
            .showModal(discussionModal)
            .catch((e) => console.log(e));
    },
};
