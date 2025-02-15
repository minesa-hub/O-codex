import {
    SlashCommandBuilder,
    CommandInteraction,
    MessageFlags,
} from "discord.js";

interface CommandExecuteParams {
    interaction: CommandInteraction;
    client: any;
}

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Botun gecikme süresini gösterir."),

    execute: async ({ interaction, client }: CommandExecuteParams) => {
        try {
            // Başlangıç zamanını kaydet
            const startTime = Date.now();

            // İlk mesajı gönder
            const sent = await interaction.reply({
                content: "🏓 Ping hesaplanıyor...",
                withResponse: true,
            });

            // Gecikme sürelerini hesapla
            const roundTripLatency = Date.now() - startTime;
            const wsLatency = client.ws.ping;

            // Mesajı güncelle
            await interaction.editReply({
                content: [
                    "🏓 **Pong!**",
                    `> **Bot Gecikmesi:** \`${roundTripLatency}ms\``,
                    `> **WebSocket Gecikmesi:** \`${wsLatency}ms\``,
                ].join("\n"),
            });
        } catch (error) {
            console.error("[Ping Command]", {
                error: error instanceof Error ? error.message : error,
                timestamp: new Date().toISOString(),
            });

            await interaction.reply({
                content: "❌ Ping hesaplanırken bir hata oluştu!",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
