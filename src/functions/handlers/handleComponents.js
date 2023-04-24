// Importing required modules
import fs from "fs";
import chalk from "chalk";

// Exporting the function
export default (client) => {
    // Defining the handleComponents function
    client.handleComponents = async () => {
        // Getting all the folders in the components folder
        const componentFolders = fs.readdirSync("./src/components");

        // Looping through all the folders
        for (const folder of componentFolders) {
            // Getting all the files in the folder
            const componentFiles = fs
                .readdirSync(`./src/components/${folder}`)
                .filter((file) => file.endsWith(".js"));
            // Defining the buttons, selectMenus and modals variables
            const { buttons, selectMenus, modals } = client;

            // Switching through the folder name
            switch (folder) {
                // If the folder name is buttons
                case "buttons":
                    // Looping through all the files
                    for (const file of componentFiles) {
                        // Importing the button
                        const { default: button } = await import(
                            `../../components/${folder}/${file}`
                        );

                        // Setting the button in the buttons collection
                        buttons.set(button.data.customId, button);

                        // Logging the button name in green color
                        console.log(
                            chalk.green(
                                `[Buttons]: Loaded ${button.data.customId} button.`,
                            ),
                        );
                    }
                    break;
                // If the folder name is selectMenus
                case "selectMenus":
                    // Looping through all the files
                    for (const file of componentFiles) {
                        // Importing the selectMenu
                        const { default: selectMenu } = await import(
                            `../../components/${folder}/${file}`
                        );

                        // Setting the selectMenu in the selectMenus collection
                        selectMenus.set(selectMenu.data.customId, selectMenu);

                        // Logging the selectMenu name in green color
                        console.log(
                            chalk.green(
                                `[Select Menus]: Loaded ${selectMenu.data.customId} select menu.`,
                            ),
                        );
                    }
                    break;

                // If the folder name is modals
                case "modals":
                    // Looping through all the files
                    for (const file of componentFiles) {
                        // Importing the modal
                        const { default: modal } = await import(
                            `../../components/${folder}/${file}`
                        );

                        // Setting the modal in the modals collection
                        modals.set(modal.data.customId, modal);

                        // Logging the modal name in green color
                        console.log(
                            chalk.green(
                                `[Modals]: Loaded ${modal.data.customId} modal.`,
                            ),
                        );
                    }

                    // If the folder name is not buttons, selectMenus or modals
                default:
                    // Do nothing :D
                    break;
            }
        }
    };
};
