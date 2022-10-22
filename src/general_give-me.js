import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("give-me")
        .setDescription("— Take the key and lock yourself in the top of all roles."),
    run: async (client, interaction) => {
        // Declaring the role
        const role = "805451556081500220";
        // Declaring the guild
        const guild = client.guilds.cache.get("697039582922801182");

        // Get all members with the role
        let members = await guild.members.fetch();
        members = members.filter(m => m.roles.cache.has(role));

        // Take role from all members
        for (const member of members.values()) {
            await member.roles.remove(role);
        }

        // Give role to the command executor
        await interaction.member.roles.add(role);

        // Send message
        return interaction.reply({ content: "You have taken the key!", ephemeral: true });
    },
};
