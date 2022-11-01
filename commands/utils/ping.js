import { SlashCommandBuilder } from "discord.js";

const pingCommand = {
    data: new SlashCommandBuilder().setName("ping").setDescription("— Returns websocket ping."),
    async execute(interaction, client) {
        const plug = client.emojis.cache.get("1020408001502392432");

        await interaction.reply({ content: `>>> **WebSocket Ping**\n${plug}${client.ws.ping}ms!`, ephemeral: true });
    },
    /*
    await new Promise((r) => setTimeout(r, 2500));
	interaction.deleteReply();
    */
};

export default pingCommand;
