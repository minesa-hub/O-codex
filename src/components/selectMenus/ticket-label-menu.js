import { MessageFlags } from "discord.js";

export default {
    data: {
        customId: "ticket-label-menu",
    },

    /**
     * When a label is selected, update the thread title.
     * The new title will be: "[LABEL] OriginalTitle"
     */
    async execute({ interaction }) {
        // Ensure the interaction is in a thread (this select menu is sent in a thread)
        if (!interaction.channel || !interaction.channel.isThread()) {
            return interaction.reply({
                content: "This command can only be used in a thread.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Get the selected label values (for example: ["label-bug", ...])
        const selectedLabels = interaction.values;
        if (!selectedLabels || selectedLabels.length === 0) {
            return interaction.reply({
                content: "No label selected.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // We'll use only the first selected label for the thread title.
        const labelValue = selectedLabels[0];
        // Remove the "label-" prefix and convert to uppercase.
        const labelText = labelValue.replace(/^label-/, "").toUpperCase();

        // Get the current thread name.
        const currentThreadName = interaction.channel.name;
        // Remove any existing prefix in the form "[SOMETHING] " from the beginning.
        const originalTitle = currentThreadName.replace(/^\[[^\]]+\]\s*/, "");
        // Build the new title.
        const newTitle = `[${labelText}] ${originalTitle}`;

        try {
            // Update the thread's name.
            await interaction.channel.setName(newTitle);
            // Acknowledge the update.
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
