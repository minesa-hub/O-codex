import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";
import { person_crop_squareEmoji } from "../../shortcuts/emojis.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            ChineseCN: "用户头像",
            it: "Avatar Utente",
            tr: "Kullanıcı Avatarı",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        const target = interaction.guild.members.cache.get(
            interaction.targetId,
        );
        const avatar = target.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        const embed = new EmbedBuilder()
            .setDescription(
                `# ${person_crop_squareEmoji} @${target.user.username}\nYou are viewing their profile picture now.`,
            )
            .setImage(avatar)
            .setColor(0x3b81f5);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
