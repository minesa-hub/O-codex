import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

const AvatarCommand = {
    data: new ContextMenuCommandBuilder()
        .setName('User Avatar')
        .setNameLocalizations({
            tr: 'Kullanıcı Avatarı',
            it: 'Avatar Utente',
            ChineseCN: '用户头像',
        })
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        // Getting the user from the context menu
        const target = interaction.guild.members.cache.get(interaction.targetId);

        // Creating the reply
        await interaction.reply({
            content: `>>> ${target.user.avatarURL({
                dynamic: true,
                extension: 'jpg',
                size: 4096,
            })}`,
            ephemeral: true,
        });
    },
};

export default AvatarCommand;
