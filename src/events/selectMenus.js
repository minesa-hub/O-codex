export default {
    name: "interactionCreate",
    once: false,
    execute: async interaction => {
        if (interaction.isSelectMenu()) {
            // Color Roles Button on the Get Color Roles
            if (
                interaction.customId === "ColorRolesMenu" ||
                interaction.customId === "OtherRolesMenu1" ||
                interaction.customId === "OtherRolesMenu2" ||
                interaction.customId === "OtherRolesMenu3" ||
                interaction.customId === "OtherRolesMenu4"
            ) {
                await interaction.deferUpdate({ ephemeral: true });

                let roleId = interaction.values[0];
                const role = interaction.guild.roles.cache.get(roleId);
                const memberRoles = interaction.member.roles;
                const hasRole = memberRoles.cache.has(roleId);

                if (hasRole) {
                    memberRoles.remove(role);
                    await interaction.followUp({
                        content: `Removed the ${role} role from you.`,
                        ephemeral: true,
                    });
                } else {
                    memberRoles.add(role);
                    await interaction.followUp({
                        content: `Added the ${role} role to you.`,
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
