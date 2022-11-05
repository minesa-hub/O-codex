import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";

const pollCommand = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("— Create a poll.")
        .setNameLocalizations({ tr: "oylama", it: "sondaggio", ChineseCN: "投票" })
        .setDescriptionLocalizations({
            tr: "— Bir oylama oluştur.",
            it: "— Crea un sondaggio.",
            ChineseCN: "— 创建投票。",
        })
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("— The question to ask.")
                .setRequired(true)
                .setNameLocalizations({ tr: "soru", it: "domanda", ChineseCN: "问题" })
                .setDescriptionLocalizations({
                    tr: "— Sorulacak soru.",
                    it: "— La domanda da porre.",
                    ChineseCN: "— 要问的问题。",
                }),
        ),
    async execute(interaction) {
        // Gettings the question
        const question = interaction.options.getString("question");

        // Emojis
        const [thumbsup, thumbsdown, megaphone, discussion] = [
            "<:thumbsup:1020408053037793321>",
            "<:thumbsdown:1020408108998197331>",
            "<:megaphone:1020408969610670133>",
            "<:commentdiscussion:1020408196743037039>",
        ];

        // Creating the poll button
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("poll-discussion")
                .setLabel("Discuss it!")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(discussion),
        );

        // Creating the poll reply
        const msg = await interaction.reply({
            content: `${megaphone} **${question}**\n\n>>> ${thumbsup} — Definitely!\n\n${thumbsdown} — Definitely Not!\n\nʸᵒᵘ ᶜᵃⁿ ᵃˡˢᵒ ᵈᶦˢᶜᵘˢˢ`,
            components: [row],
            fetchReply: true,
        });

        // Adding the reactions to fetched reply
        msg.react("1020408053037793321");
        msg.react("1020408108998197331");
    },
};

export default pollCommand;
