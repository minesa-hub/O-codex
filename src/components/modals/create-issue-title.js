import {
    ChannelType,
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} from "discord.js";
import {
    checkmark_circleEmoji,
    lockEmoji,
    lock_shieldEmoji,
    circle_slashEmoji,
} from "../../shortcuts/emojis.js";

let lockButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("issue-lock-conversation")
        .setLabel("Lock Thread")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        .setEmoji(lockEmoji),
);

export default {
    data: {
        customId: "create-issue-modal",
    },

    execute: async ({ interaction }) => {
        const issueTitle = interaction.fields.getTextInputValue("issue-title");

        const embed = new EmbedBuilder()
            .setTitle("Now, we are here…")
            .setDescription(
                "Our staff member(s) will take care of this thread sooner. While they are on their way, why don’t you talk about your issue?",
            )
            .setThumbnail(
                "https://media.discordapp.net/attachments/736571695170584576/1208124842159898646/ede80f82-f591-47bd-8e13-536ff2f5c3d1.png?ex=65e224f0&is=65cfaff0&hm=fe6aef4a967e330da7c3cef3a5e4cf3807f561cd8eafbd90bc117fee5efff72f&=&format=webp&quality=lossless&width=1032&height=1032",
            );

        const menu = new StringSelectMenuBuilder()
            .setCustomId("issue-select-menu")
            .setDisabled(false)
            .setMaxValues(1)
            .setPlaceholder("Action to close issue")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as completed")
                    .setValue("issue-menu-close")
                    .setDescription("Done, closed, fixed, resolved")
                    .setEmoji(checkmark_circleEmoji)
                    .setDefault(false),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("issue-menu-duplicate")
                    .setDescription("Won’t fix, can’t repo, duplicate, stale")
                    .setEmoji(circle_slashEmoji),
            );

        const menuRow = new ActionRowBuilder().addComponents(menu);

        let thread = await interaction.channel.threads.create({
            name: `${issueTitle}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened a thread for support`,
            invitable: false,
        });

        await interaction.reply({
            content: `# ${lock_shieldEmoji} Created <#${thread.id}>\nYou can now talk about your issue with our staff member(s).`,
            ephemeral: true,
        });

        let pinMessage = await thread.send({
            embeds: [embed],
            components: [menuRow, lockButton],
        });

        await thread.members.add(interaction.user);
        if (
            interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageMessages,
            )
        )
            await pinMessage.pin();
        else return;
    },
};

export { lockButton };
