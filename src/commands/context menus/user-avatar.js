import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from 'discord.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('User Avatar')
        .setNameLocalizations({
            tr: 'Kullanıcı Avatarı',
            it: 'Avatar Utente',
            ChineseCN: '用户头像',
        })
        .setType(ApplicationCommandType.User),
    async execute({ interaction }) {
        // Getting the user from the context menu
        const target = interaction.guild.members.cache.get(interaction.targetId);
        const targetAvatar = target.user.avatarURL({
            format: target.user.avatar.startsWith('a_') ? 'gif' : 'png',
            dynamic: true,
            size: 4096,
        });

        // Creating the reply
        await interaction.reply({
            content: `${targetAvatar}`,
            ephemeral: true,
        });
    },
};
