// Importing the required modules
import {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    inlineCode,
} from "discord.js";
import {
    alertEmoji,
    issueOpenButtonEmoji,
    shieldLockEmoji,
} from "../../shortcuts/emojis.js";

// Exporting the command
export default {
    // The command data
    data: new SlashCommandBuilder()
        .setName("setup-ticket")
        .setDescription("Setup ticket system with threads.")
        .addStringOption((option) =>
            option
                .setName("title")
                .setDescription("Set title of embed message")
                .setRequired(false),
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("Set description of embed message")
                .setRequired(false),
        )
        .addStringOption((option) =>
            option
                .setName("color")
                .setDescription("Set color of embed message")
                .setRequired(false)
                .addChoices(
                    { name: "Lilac", value: "#D9B2FF" },
                    { name: "Powder Blue", value: "#BFEFFF" },
                    { name: "Mauve", value: "#FFB6C1" },
                    { name: "Pale Green", value: "#C8FFB0" },
                    { name: "Ivory", value: "#FFFFF0" },
                    { name: "Slate", value: "#B0C4DE" },
                    { name: "Mint", value: "#BDFCC9" },
                    { name: "Lavender Gray", value: "#C4C3D0" },
                    { name: "Pink", value: "#FFC0CB" },
                    { name: "Silver", value: "#C0C0C0" },
                    { name: "Peach", value: "#FFE5B4" },
                    { name: "Pale Yellow", value: "#FFFFB2" },
                    { name: "Light Gray", value: "#D3D3D3" },
                    { name: "Lavender", value: "#E6E6FA" },
                    { name: "Sky Blue", value: "#87CEEB" },
                    { name: "Beige", value: "#F5F5DC" },
                    { name: "Salmon", value: "#FFA07A" },
                    { name: "Platinum", value: "#E5E4E2" },
                    { name: "Misty Rose", value: "#FFE4E1" },
                    { name: "Light Cyan", value: "#E0FFFF" },
                    { name: "Light Pink", value: "#FFB6C1" },
                    { name: "Pale Turquoise", value: "#AFEEEE" },
                    { name: "Light Salmon", value: "#FFA07A" },
                    { name: "Black", value: "#000000" },
                    { name: "White", value: "#FFFFFF" },
                ),
        ),
    // The command output
    execute: async ({ interaction }) => {
        // Checking if the user has the required permissions
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageThreads ||
                    PermissionFlagsBits.ManageGuild ||
                    PermissionFlagsBits.Administrator,
            )
        )
            return interaction.reply({
                content: `${shieldLockEmoji} You **can not** setup this system <@${
                    interaction.user.id
                }>. You need ${inlineCode("Manage Threads")}, ${inlineCode(
                    "Manage Channels",
                )} or ${inlineCode(
                    "Administrator",
                )} permission to setup this system.`,
                ephemeral: true,
            });

        // Checking if the channel is a text channel
        if (interaction.channel.type !== ChannelType.GuildText)
            return interaction.reply({
                content: `${alertEmoji} You **can not** setup this system in this channel, <@${interaction.user.id}>.\nPlease try again in __Text Channel__ type channel.`,
                ephemeral: true,
            });

        // Getting the options
        const embedTitle = interaction.options.getString("title");
        const embedDescription = interaction.options.getString("description");
        const embedColor = interaction.options.getString("color");
        // Creating the embed
        const embed = new EmbedBuilder()
            .setTitle(
                embedTitle ? embedTitle : "Welcome to our support portal!",
            )
            .setDescription(
                embedDescription
                    ? embedDescription
                    : `If you're experiencing an issue with our product or service, please use the "Issue Creation" button to report it. This includes any server-related issues you may be encountering in our Discord server.

When creating a new issue, please provide a clear summary of the problem and any steps you took before encountering it. This information will help us resolve the issue as quickly as possible.

Thank you for helping us improve our product/service and Discord server!`,
            )
            .setColor(embedColor ? embedColor : "Random")
            .setThumbnail(
                "https://media.discordapp.net/attachments/861208192121569280/1097190943528067122/C540848F-771D-4676-835C-6F65B6A54FF4.png",
            )
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL(),
            });
        // Creating the button
        const createIssueButton = new ButtonBuilder()
            .setCustomId("create-issue")
            .setLabel("Create Issue")
            .setStyle(ButtonStyle.Success)
            .setEmoji(issueOpenButtonEmoji);
        // Creating the row
        const row = new ActionRowBuilder().addComponents(createIssueButton);

        // Sending the message
        await interaction.reply({
            content: `${shieldLockEmoji} Created the issue system succesfully!`,
            ephemeral: true,
        });

        // Sending the embed
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
