import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from 'discord.js';

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
        const targetAvatar = target.user.avatarURL({
            dynamic: true,
            extension: 'jpg',
            size: 4096,
        });

        // Creating Embed
        const embed = new EmbedBuilder()
            .setTitle(`**${target.user.tag}**'s avatar:`)
            .setImage(targetAvatar)
            .setColor(target.roles.highest.color || 'NotQuiteBlack');
        // Creating the reply
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};

export default AvatarCommand;
