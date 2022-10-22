import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("— Returns websocket ping."),
    run: async (client, interaction) => {
        const plug = client.emojis.cache.get("1020408001502392432");

        await interaction.reply({
            content: `>>> **WebSocket Ping**\n${plug}${client.ws.ping}ms!`,
            ephemeral: true,
        });
    },
};
