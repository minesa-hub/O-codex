import { Client } from "discord.js";
import fs from "fs";
import path from "path";

interface ExtendedClient extends Client {
    buttons: Map<string, any>;
    selectMenus: Map<string, any>;
    modals: Map<string, any>;
    handleComponents: () => Promise<void>;
}

export const loadComponents = (client: ExtendedClient) => {
    client.handleComponents = async () => {
        const componentsPath = path.join(__dirname, "../../components");
        const componentFolders = fs.readdirSync(componentsPath);

        for (const folder of componentFolders) {
            const folderPath = path.join(componentsPath, folder);
            const componentFiles = fs
                .readdirSync(folderPath)
                .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

            switch (folder) {
                case "buttons":
                    for (const file of componentFiles) {
                        const { default: button } = await import(
                            path.join(folderPath, file)
                        );

                        if (button?.data?.customId) {
                            client.buttons.set(button.data.customId, button);
                            console.log(
                                `🔘 | [Buttons] Loaded ${button.data.customId} button.`
                            );
                        }
                    }
                    break;

                case "selectMenus":
                    for (const file of componentFiles) {
                        const { default: selectMenu } = await import(
                            path.join(folderPath, file)
                        );

                        if (selectMenu?.data?.customId) {
                            client.selectMenus.set(
                                selectMenu.data.customId,
                                selectMenu
                            );
                            console.log(
                                `📚 | [Select Menus] Loaded ${selectMenu.data.customId} select menu.`
                            );
                        }
                    }
                    break;

                case "modals":
                    for (const file of componentFiles) {
                        const { default: modal } = await import(
                            path.join(folderPath, file)
                        );

                        if (modal?.data?.customId) {
                            client.modals.set(modal.data.customId, modal);
                            console.log(
                                `📃 | [Modals] Loaded ${modal.data.customId} modal.`
                            );
                        }
                    }
                    break;

                default:
                    console.warn(
                        `[Warning]: Unknown component folder: ${folder}`
                    );
                    break;
            }
        }
    };
};
