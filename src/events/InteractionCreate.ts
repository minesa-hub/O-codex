import {
    Events,
    InteractionType,
    Client,
    ApplicationCommandType,
} from "discord.js";
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
        if (interaction.type === InteractionType.ApplicationCommand) {
            const { commands } = client;

            // Context Menu Commands
            if (
                interaction.commandType === ApplicationCommandType.User ||
                interaction.commandType === ApplicationCommandType.Message
            ) {
                const command = commands.get(interaction.commandName);
                if (!command) {
                    console.log(
                        `Command not found: ${interaction.commandName}`
                    );
                    return;
                }

                try {
                    await command.execute({
                        interaction:
                            interaction as ContextMenuCommandInteraction,
                        client,
                    });
                } catch (error) {
                    console.error(
                        `Error executing command ${interaction.commandName}:`,
                        error
                    );
                }
            }
            // Slash Commands
            else if (
                interaction.commandType === ApplicationCommandType.ChatInput
            ) {
                const command = commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute({
                        interaction: interaction as CommandInteraction,
                        client,
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
        // Buttons
        else if (
            interaction.type === InteractionType.MessageComponent &&
            (interaction as ButtonInteraction).componentType === 2
        ) {
            // 2 is BUTTON
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
        // Select Menus
        else if (
            interaction.type === InteractionType.MessageComponent &&
            (interaction as AnySelectMenuInteraction).componentType === 3
        ) {
            // 3 is SELECT_MENU
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
