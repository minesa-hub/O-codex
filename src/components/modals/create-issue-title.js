// Importing all the required modules
import {
    ChannelType,
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import {
    issueClosedEmoji,
    lockButtonEmoji,
    shieldLockEmoji,
    skipEmoji,
} from "../../shortcuts/emojis.js";

// Defining the lock button
let lockButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("issue-lock-conversation")
        .setLabel("Lock Issue")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        .setEmoji(lockButtonEmoji),
);

// Exporting the command
export default {
    // The command data contains customID
    data: {
        customId: "create-issue-modal",
    },
    // The command
    execute: async ({ interaction }) => {
        // getting the issue title
        const issueTitle = interaction.fields.getTextInputValue("issue-title");
        // Creating the embed
        const embed = new EmbedBuilder()
            .setTitle("Now, we are here…")
            .setDescription(
                "Our staff member(s) will take care of this issue sooner. While they are on their way, why don’t you talk about your issue?",
            )
            .setColor(0x1e1e1e)
            .setThumbnail(
                "https://media.discordapp.net/attachments/861208192121569280/1098929101504532550/EAED28F1-A235-4E67-8F44-BABDD5FB14DB.png?width=473&height=473",
            );
        // Creating the menu
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
                    .setEmoji(issueClosedEmoji)
                    .setDefault(false),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("issue-menu-duplicate")
                    .setDescription("Won’t fix, can’t repo, duplicate, stale")
                    .setEmoji(skipEmoji),
            );
        // Creating the row
        const menuRow = new ActionRowBuilder().addComponents(menu);

        // Creating the thread
        let thread = await interaction.channel.threads.create({
            name: `${issueTitle}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened an issue`,
            invitable: false,
        });

        // Awaiting the reply
        await interaction.followUp({
            content: `${shieldLockEmoji} Created <#${thread.id}>. You can now talk about your issue with our staff member(s).`,
            ephemeral: true,
        });

        // Sending the message
        let pinMessage = await thread.send({
            embeds: [embed],
            components: [menuRow, lockButton],
        });

        // Awaiting the pin
        await pinMessage.pin();
        // Awaiting the thread members add the user who opened the issue
        await thread.members.add(interaction.user);
    },
};
// Exporting the lock button
export { lockButton };
