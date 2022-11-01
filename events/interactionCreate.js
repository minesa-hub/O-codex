export const name = "interactionCreate";
export async function execute(interaction, client) {
    let client = interaction.client;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.guildOnly && interaction.channel.type === "DM") {
        return interaction.reply({
            content: "I can't execute that command inside DMs!",
            ephemeral: true,
        });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}
