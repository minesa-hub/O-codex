import {
    EmbedBuilder,
    WebhookClient,
    ActionRowBuilder,
    ButtonBuilder,
    AttachmentBuilder,
    SlashCommandBuilder,
} from "discord.js";
import config from "../config.js";
const webhook = new WebhookClient({
    id: config.webhook_id,
    token: config.webhook_token,
});
import { inspect } from "util";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("— Developer only.")
        .addStringOption(option =>
            option.setName("input").setDescription("• Please input the code.").setRequired(true),
        ),
    run: async (client, interaction) => {
        const [debug_emoji, warning_emoji] = ["<:debug:1020403337738334208>", "<:warning:1020401563468058664>"];

        if (!"285118390031351809".includes(interaction.member.user.id))
            return interaction.reply({
                content: `${warning_emoji} You can not use this command.`,
                ephemeral: true,
            });

        try {
            let evaluated = eval(interaction.options.getString("input"));
            evaluated = typeof evaluated === "object" ? inspect(evaluated, { depth: 0, showHidden: false }) : evaluated;

            return interaction.reply({
                content: `${debug_emoji} **Output**\n\n>>> ***\`\`\`javascript\n${evaluated}\n\`\`\`***`,
            });
        } catch (error) {
            return interaction.reply({
                content: `${warning_emoji} An error occurred: \`${error.message}\``,
            });
        }
    },
};
