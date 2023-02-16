import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
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
        // Deferring the reply
        await interaction.deferReply({ ephemeral: true });

        // Getting the user from the context menu
        const target = interaction.guild.members.cache.get(interaction.targetId);
        const targetAvatar = target.user.avatarURL({
            dynamic: true,
            size: 4096,
        });

        // Creating an embed
        const embed = new EmbedBuilder()
            .setTitle(`${target.user.username}'s Avatar`)
            .setImage(targetAvatar)


        // Creating a new button
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`ShowMemberAvatar_${target.id}`)
                .setLabel('See Their Member Avatar!')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:git_eye:992920314172424242>'),
        );

        // Creating the reply
        await interaction.followUp({
            embeds: [embed],
            components: [button],
        });
    },
};
