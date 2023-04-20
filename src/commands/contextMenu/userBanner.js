import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Banner")
        .setNameLocalizations({
            ChineseCN: "用户横幅",
            it: "Banner Utente",
            tr: "Kullanıcı Afişi",
        })
        .setType(ApplicationCommandType.User),
    execute: async ({ interaction, client }) => {
        await interaction.deferReply({ ephemeral: true });

        const user = client.users.fetch(interaction.targetId, { force: true });

        user.then(async (resolved) => {
            const imageURI = resolved.bannerURL({ dynamic: true, size: 4096 });
            const embed = new EmbedBuilder()
                .setTitle(`${resolved.tag}'s Banner`)
                .setImage(imageURI)
                .setColor(0x1e1e1e);

            if (imageURI === null) {
                await interaction.editReply({
                    content: "User has no banner set.",
                    ephemeral: true,
                });
            } else {
                await interaction.editReply({ embeds: [embed] });
            }
        });
    },
};
