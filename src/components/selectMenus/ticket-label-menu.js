import { MessageFlags } from "discord.js";

export default {
    data: {
        customId: "ticket-label-menu",
    },
    execute: async ({ interaction }) => {
        if (!interaction.channel || !interaction.channel.isThread()) {
            return interaction.reply({
                content: "This command can only be used in a thread.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const selectedLabels = interaction.values;
        if (!selectedLabels || selectedLabels.length === 0) {
            return interaction.reply({
                content: "No label selected.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const labelValue = selectedLabels[0];
        const labelText = labelValue.replace(/^label-/, "").toUpperCase();

        const currentThreadName = interaction.channel.name;
        const originalTitle = currentThreadName.replace(/^\[[^\]]+\]\s*/, "");
        const newTitle = `[${labelText}] ${originalTitle}`;

        try {
            await interaction.channel.setName(newTitle);
            await interaction.reply({
                content: `Ticket title updated to: ${newTitle}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error("Error updating thread title:", error);
            await interaction.reply({
                content: "Failed to update ticket title.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
