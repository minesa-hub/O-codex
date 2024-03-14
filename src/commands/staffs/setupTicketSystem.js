import {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    underscore,
    bold,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    button_emoji,
    ticket_created,
    ticket_emoji,
} from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .setName("setup-ticket")
        .setNameLocalizations({
            ChineseCN: "设置票",
            it: "configura-i-biglietti",
            tr: "bilet-kurulumu",
        })
        .setDescription("Setup ticket system with threads.")
        .setDescriptionLocalizations({
            ChineseCN: "使用线程设置票证系统。",
            it: "Configurazione del sistema di ticket con thread.",
            tr: "Alt başlıklarla bilet sistemi kurulumunu yap.",
        })
        .addStringOption((option) =>
            option
                .setName("description")
                .setNameLocalizations({
                    ChineseCN: "描述",
                    it: "descrizione",
                    tr: "açıklama",
                })
                .setDescription("Set description of embed message")
                .setDescriptionLocalizations({
                    ChineseCN: "设置嵌入消息的描述",
                    it: "Imposta la descrizione del messaggio incorporato",
                    tr: "Zengin mesajının açıklamasını ayarlayın",
                })
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("color")
                .setDescription("🔴🟠🟡🟢🔵🟣⚫️⚪️")
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
                    { name: "White", value: "#FFFFFF" }
                )
        ),

    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;
        if (interaction.channel.type !== ChannelType.GuildText)
            return interaction.reply({
                content: `${exclamationmark_circleEmoji} You **can not** setup this system in this channel, <@${interaction.user.id}>.\nPlease try again in __Text Channel__ type channel.`,
                ephemeral: true,
            });

        const embedDescription = interaction.options.getString("description");
        const embedColor = interaction.options.getString("color");

        const embed = new EmbedBuilder()
            .setDescription(
                embedDescription
                    ? embedDescription
                    : `# ${button_emoji} Create a Ticket\nIf you're experiencing an issue with our product or service, please use the "Create Ticket" button to report it. This includes any server-related issues you may be encountering in our Discord server.`
            )
            .setColor(embedColor ? embedColor : EMBED_COLOR)
            .setImage(
                "https://cdn.discordapp.com/attachments/736571695170584576/1217221352134807613/IMG_0212.png?ex=66033cb9&is=65f0c7b9&hm=aef4f257a97c8abf645a4e5d7294ca3dec849b46b36afe8ee324d62615ad780d&"
            )
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL(),
            });

        const createIssueButton = new ButtonBuilder()
            .setCustomId("create-issue")
            .setLabel("Create Issue")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(ticket_emoji);

        const row = new ActionRowBuilder().addComponents(createIssueButton);

        await interaction.reply({
            content: `${ticket_created} Created the issue system succesfully!`,
            ephemeral: true,
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });

        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        )
            return interaction.followUp({
                content: `${underscore("Recommending")}\nIf Kaeru has ${bold(
                    "Manage Messages"
                )} permission, it will be very easy to reach at first message with pinned messages for staff members.`,
                ephemeral: true,
            });
    },
};
