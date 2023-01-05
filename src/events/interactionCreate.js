export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        // Defining the client
        let client = interaction.client;

        // Get the command
        const command = client.commands.get(interaction.commandName);

        // If the command is not found, return nothing.
        if (!command) return;

        // If the command is found, execute the command.
        try {
            await command.execute({ interaction, client });
        } catch (error) {
            console.error(error);
        }
    },
};
