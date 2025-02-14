import { Events, InteractionType, Client } from "discord.js";
import type {
    CommandInteraction,
    ButtonInteraction,
    AnySelectMenuInteraction,
    ModalSubmitInteraction,
    ContextMenuCommandInteraction,
    AutocompleteInteraction,
    Interaction,
} from "discord.js";

interface ExtendedClient extends Client {
    commands: Map<string, any>;
    buttons: Map<string, any>;
    selectMenus: Map<string, any>;
    modals: Map<string, any>;
}

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction, client: ExtendedClient) => {
        // Check if interaction is a chat input command
        if (interaction.isChatInputCommand()) {
            // Reverting back to .isChatInputCommand() method
            const { commands } = client;
            const { commandName } = interaction as CommandInteraction;
            const command = commands.get(commandName);

            if (!command) return;

            try {
                await command.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
        // Check if interaction is a button
        else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction as ButtonInteraction;
            const button = buttons.get(customId);

            if (!button) return new Error("Button not found.");

            try {
                await button.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
        // Check if interaction is a select menu
        else if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction as AnySelectMenuInteraction;
            const selectMenu = selectMenus.get(customId);

            if (!selectMenu) return new Error("Select menu not found.");

            try {
                await selectMenu.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
        // Check if interaction is a modal submit
        else if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction as ModalSubmitInteraction;
            const modal = modals.get(customId);

            if (!modal) return new Error("Modal not found.");

            try {
                await modal.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
        // Check if interaction is a context menu command
        else if (interaction.isContextMenuCommand()) {
            const { commands } = client;
            const { commandName } =
                interaction as ContextMenuCommandInteraction;
            const contextCommand = commands.get(commandName);

            if (!contextCommand) return;

            try {
                await contextCommand.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
        // Check if interaction is an application command autocomplete
        else if (
            interaction.type == InteractionType.ApplicationCommandAutocomplete
        ) {
            const { commands } = client;
            const { commandName } = interaction as AutocompleteInteraction;
            const autocompleteCommand = commands.get(commandName);

            if (!autocompleteCommand) return;

            try {
                await autocompleteCommand.autocomplete({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        }
    },
};
