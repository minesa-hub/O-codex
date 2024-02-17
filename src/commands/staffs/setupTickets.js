import {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
    inlineCode,
    PermissionFlagsBits,
    underscore,
    bold,
} from "discord.js";
import {
    exclamationmark_circleEmoji,
    plus_messageEmoji,
    lock_shieldEmoji,
    exclamationmark_triangleEmoji,
} from "../../shortcuts/emojis.js";

export default {
    data: new SlashCommandBuilder()
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
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
                .setRequired(false),
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
                    { name: "White", value: "#FFFFFF" },
                ),
        ),

    execute: async ({ interaction }) => {
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageThreads ||
                    PermissionFlagsBits.ManageGuild ||
                    PermissionFlagsBits.Administrator,
            )
        )
            return interaction.reply({
                content: `${lock_shieldEmoji} You **can not** setup this system <@${
                    interaction.user.id
                }>. You need ${inlineCode("Manage Threads")}, ${inlineCode(
                    "Manage Channels",
                )} or ${inlineCode(
                    "Administrator",
                )} permission to setup this system.`,
                ephemeral: true,
            });

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
                    : `If you're experiencing an issue with our product or service, please use the "Issue Creation" button to report it. This includes any server-related issues you may be encountering in our Discord server.

                    When creating a new issue, please provide a clear summary of the problem and any steps you took before encountering it. This information will help us resolve the issue as quickly as possible.

                    Thank you for helping us improve our product/service and Discord server!`,
            )
            .setColor(embedColor ? embedColor : "Random")
            .setImage(
                "https://media.discordapp.net/attachments/736571695170584576/1208117619165757570/Bluefire_Support_Card-ai-brush-removebg-zogyn14l.png?ex=65e21e36&is=65cfa936&hm=7da084b5a1d1854883afe8deba9f6f7319a1183b9350bafaeb452d7f462e9c98&=&format=webp&quality=lossless&width=1100&height=430",
            )
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL(),
            });

        const createIssueButton = new ButtonBuilder()
            .setCustomId("create-issue")
            .setLabel("Create Issue")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(plus_messageEmoji);

        const row = new ActionRowBuilder().addComponents(createIssueButton);

        await interaction.reply({
            content: `${lock_shieldEmoji} Created the issue system succesfully!`,
            ephemeral: true,
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });

        if (
            interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageMessages,
            )
        ) {
            return;
        } else {
            return interaction.followUp({
                content: `${exclamationmark_triangleEmoji} ${underscore(
                    "Recommending",
                )}: If Ita has ${bold(
                    "Manage Messages",
                )} permission, it will be very easy to reach at first message with pinned messages.`,
                ephemeral: true,
            });
        }
    },
};
