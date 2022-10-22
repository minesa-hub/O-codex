import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("— Create a poll.")
        .addStringOption(option =>
            option.setName("question").setDescription("— The question to ask.").setRequired(true),
        ),
    run: async (client, interaction) => {
        const question = interaction.options.getString("question");
        const [thumbsup, thumbsdown, megaphone, discussion] = [
            "<:thumbsup:1020408053037793321>",
            "<:thumbsdown:1020408108998197331>",
            "<:megaphone:1020408969610670133>",
            "<:commentdiscussion:1020408196743037039>",
        ];

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("poll-discussion")
                .setLabel("Discuss it!")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(discussion),
        );

        const msg = await interaction.reply({
            content: `${megaphone} **${question}**\n\n>>> ${thumbsup} — Definitely!\n\n${thumbsdown} — Definitely Not!\n\nʸᵒᵘ ᶜᵃⁿ ᵃˡˢᵒ ᵈᶦˢᶜᵘˢˢ`,
            components: [row],
            fetchReply: true,
        });
        msg.react("1020408053037793321");
        msg.react("1020408108998197331");
    },
};

export const config = {
    name: "poll",
    aliases: ["poll"],
    description: "— Create a poll.",
    usage: "poll <question>",
    example: "poll Should I eat pizza?",
    category: "misc",
};
