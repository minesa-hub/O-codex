import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('Member Avatar')
        .setNameLocalizations({
            tr: 'Üye Avatarı',
            it: 'Avatar Membro',
            ChineseCN: '成员头像',
        })
        .setType(ApplicationCommandType.User),
    async execute({ interaction }) {
        // Getting the member from the context menu
        const target = interaction.guild.members.cache.get(interaction.targetId);
        const targetAvatar = target.displayAvatarURL({
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
