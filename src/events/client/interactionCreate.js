// Importing all the required modules
import { Events, InteractionType } from "discord.js";

// Exporting the event
export default {
    // The event name
    name: Events.InteractionCreate,
    // The event is once?
    once: false,
    // The event execute function
    execute: async (interaction, client) => {
        // Checking if the interaction is a command aka slash command
        if (interaction.isChatInputCommand()) {
            // Getting the commands from the client which was defined in the index.js file "client.commands = new Collection()"
            const { commands } = client;
            // Getting the command name from the interaction
            const { commandName } = interaction;
            // Getting the command from the commands collection
            const command = commands.get(commandName);

            // If the command is not found then return
            if (!command) return;

            try {
                // Executing the command with the interaction and the client as the parameters
                await command.execute({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
            // Checking if the interaction is a button
        } else if (interaction.isButton()) {
            // Getting the buttons from the client which was defined in the index.js file "client.buttons = new Collection()"
            const { buttons } = client;
            // Getting the button customId from the interaction which is the same as the button data customId
            const { customId } = interaction;
            // Getting the button from the buttons collection
            const button = buttons.get(customId);

            // If the button is not found then return
            if (!button) return new Error("Button not found.");

            try {
                // Executing the button with the interaction and the client as the parameters
                await button.execute({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
            // Checking if the interaction is a select menu
        } else if (interaction.isStringSelectMenu()) {
            // Getting the select menus from the client which was defined in the index.js file "client.selectMenus = new Collection()"
            const { selectMenus } = client;
            // Getting the select menu customId from the interaction which is the same as the select menu data customId
            const { customId } = interaction;
            // Getting the select menu from the select menus collection
            const selectMenu = selectMenus.get(customId);

            // If the select menu is not found then return
            if (!selectMenu) return new Error("Select menu not found.");

            try {
                // Executing the select menu with the interaction and the client as the parameters
                await selectMenu.execute({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
            // Checking if the interaction is a modal submit
        } else if (interaction.type == InteractionType.ModalSubmit) {
            // Getting the modals from the client which was defined in the index.js file "client.modals = new Collection()"
            const { modals } = client;
            // Getting the modal customId from the interaction which is the same as the modal data customId
            const { customId } = interaction;
            // Getting the modal from the modals collection
            const modal = modals.get(customId);

            // If the modal is not found then return
            if (!modal) return new Error("Modal not found.");

            try {
                // Executing the modal with the interaction and the client as the parameters
                await modal.execute({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
            // Checking if the interaction is a context menu command aka right click command
        } else if (interaction.isContextMenuCommand()) {
            // Getting the commands from the client which was defined in the index.js file "client.commands = new Collection()"
            const { commands } = client;
            // Getting the command name from the interaction
            const { commandName } = interaction;
            // Getting the command from the commands collection
            const contextCommand = commands.get(commandName);

            // If the command is not found then return
            if (!contextCommand) return;

            try {
                // Executing the command with the interaction and the client as the parameters
                await contextCommand.execute({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
            // If the interaction type is a autocomplete command
        } else if (
            interaction.type == InteractionType.ApplicationCommandAutocomplete
        ) {
            // Getting the commands from the client which was defined in the index.js file "client.commands = new Collection()"
            const { commands } = client;
            // Getting the command name from the interaction
            const { commandName } = interaction;
            // Getting the command from the commands collection
            const autocompleteCommand = commands.get(commandName);

            // If the command is not found then return
            if (!autocompleteCommand) return;

            try {
                // Executing the command with the interaction and the client as the parameters
                await autocompleteCommand.autocomplete({ interaction, client });
            } catch (error) {
                // If there is an error then log it
                console.error(error);
            }
        }
    },
};
