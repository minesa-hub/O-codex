import { Events, Interaction, InteractionType, Client } from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction, client: Client) => {
        if (interaction.isChatInputCommand()) {
            const { commands } = client as unknown as {
                commands: Map<string, any>;
            };
            const { commandName } = interaction;
            const command = commands.get(commandName);

            if (!command) return;

            try {
                await command.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const { buttons } = client as unknown as {
                buttons: Map<string, any>;
            };
            const { customId } = interaction;
            const button = buttons.get(customId);

            if (!button) throw new Error("Button not found.");

            try {
                await button.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client as unknown as {
                selectMenus: Map<string, any>;
            };
            const { customId } = interaction;
            const selectMenu = selectMenus.get(customId);

            if (!selectMenu) throw new Error("Select menu not found.");

            try {
                await selectMenu.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            const { modals } = client as unknown as {
                modals: Map<string, any>;
            };
            const { customId } = interaction;
            const modal = modals.get(customId);

            if (!modal) throw new Error("Modal not found.");

            try {
                await modal.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isContextMenuCommand()) {
            const { commands } = client as unknown as {
                commands: Map<string, any>;
            };
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);

            if (!contextCommand) return;

            try {
                await contextCommand.execute({ interaction, client });
            } catch (error) {
                console.error(error);
            }
        } else if (
            interaction.type === InteractionType.ApplicationCommandAutocomplete
        ) {
            const { commands } = client as unknown as {
                commands: Map<string, any>;
            };
            const { commandName } = interaction;
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
