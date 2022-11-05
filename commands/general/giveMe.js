import { SlashCommandBuilder } from "discord.js";

const giveMeCommand = {
    data: new SlashCommandBuilder()
        .setName("give-me")
        .setDescription("— Take the key and lock yourself in the top of all roles.")
        .setNameLocalizations({ tr: "bana-ver", it: "dami-mi", ChineseCN: "给我" })
        .setDescriptionLocalizations({
            tr: "— Anahtarı al ve tüm rollerin en üstünde kendini kilitle.",
            it: "— Prendi la chiave e bloccati in cima a tutti i ruoli.",
            ChineseCN: "— 拿起钥匙，把自己锁在所有角色的顶部。",
        }),
    async execute(interaction, client) {
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

        // Send interaction reply
        return interaction.reply({
            content: "You have taken the key!",
            ephemeral: true,
        });
    },
};

export default giveMeCommand;
