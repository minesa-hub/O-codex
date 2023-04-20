import fs from 'fs';
import chalk from 'chalk';

export default (client) => {
    client.handleComponents = async () => {
        const componentFolders = fs.readdirSync('./src/components');

        for (const folder of componentFolders) {
            const componentFiles = fs
                .readdirSync(`./src/components/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { buttons, selectMenus, modals } = client;

            switch (folder) {
                case 'buttons':
                    for (const file of componentFiles) {
                        const { default: button } = await import(
                            `../../components/${folder}/${file}`
                        );
                        buttons.set(button.data.customId, button);

                        console.log(
                            chalk.green(`[Buttons]: Loaded ${button.data.customId} button.`),
                        );
                    }
                    break;
                case 'selectMenus':
                    for (const file of componentFiles) {
                        const { default: selectMenu } = await import(
                            `../../components/${folder}/${file}`
                        );
                        selectMenus.set(selectMenu.data.customId, selectMenu);

                        console.log(
                            chalk.green(
                                `[Select Menus]: Loaded ${selectMenu.data.customId} select menu.`,
                            ),
                        );
                    }
                    break;

                case 'modals':
                    for (const file of componentFiles) {
                        const { default: modal } = await import(
                            `../../components/${folder}/${file}`
                        );
                        modals.set(modal.data.customId, modal);

                        console.log(chalk.green(`[Modals]: Loaded ${modal.data.customId} modal.`));
                    }

                default:
                    break;
            }
        }
    };
};
