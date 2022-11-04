import { SlashCommandBuilder, parseEmoji } from "discord.js";

const addEmoji = {
    data: new SlashCommandBuilder()
        .setName("addemoji")
        .setDescription("— Adds an emoji to the server.")
        .addStringOption(option =>
            option.setName("name").setDescription("• The name of the emoji.").setRequired(true),
        )
        .addStringOption(option =>
            option.setName("emoji").setDescription("• The emoji.").setRequired(true),
        ),
    async execute(interaction) {
        // Adding "name" and "emoji" options for the slash
        const name = interaction.options.getString("name");
        const emoji = interaction.options.getString("emoji");

        // Regex
        const regex = RegExp(/(https?:\/\/[^\s]+)/g);

        // Parsing the emoji
        const parse = parseEmoji(emoji);

        try {
            let emojis;
            if (emoji.match(regex)) {
                emojis = await interaction.guild.emojis.create({ attachment: emoji, name });
            } else if (parse.id) {
                const link = `https://cdn.discordapp.com/emojis/${parse.id}.${
                    parse.animated ? "gif" : "png"
                }`;
                emojis = await interaction.guild.emojis.create({ attachment: link, name });
            }

            return interaction.reply({
                content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully added.`,
            });
        } catch (err) {
            console.error(err);

            return interaction.reply({
                content: "The emoji is invalid or we don't have more space.",
                ephemeral: true,
            });
        }
    },
};

export default addEmoji;
