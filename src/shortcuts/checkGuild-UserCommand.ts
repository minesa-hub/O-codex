import { MessageFlags, ApplicationIntegrationType } from "discord.js";
import { defaultPermissionErrorForBot } from "./permissionErrors.ts";
import { basePermissions } from "../interfaces/BotPermissions.ts";

async function checkIfUserInstalledCommand(interaction: any) {
    if (interaction.inGuild()) {
        for (const { permission, errorMessage } of basePermissions) {
            const hasError = await defaultPermissionErrorForBot(
                interaction,
                permission,
                errorMessage
            );
            if (hasError) return;
        }
    }

    if (
        Object.keys(interaction.authorizingIntegrationOwners).every(
            (key) => key === ApplicationIntegrationType.UserInstall.toString()
        )
    ) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } else {
        await interaction.deferReply();
    }
}

export { checkIfUserInstalledCommand };
