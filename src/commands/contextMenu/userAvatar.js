import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            ChineseCN: "用户头像",
            it: "Avatar Utente",
            tr: "Kullanıcı Avatarı-",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const target = interaction.guild.members.cache.get(
            interaction.targetId,
        );
        const avatar = target.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        const embed = new EmbedBuilder()
            .setTitle(`${target.user.tag}'s Avatar`)
            .setImage(avatar)
            .setColor(0x1e1e1e);

        await interaction.editReply({
            embeds: [embed],
        });
    },
};
