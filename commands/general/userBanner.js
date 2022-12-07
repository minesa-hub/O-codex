import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

const UserBannerCommand = {
    data: new ContextMenuCommandBuilder()
        .setName('User Banner')
        .setNameLocalizations({
            tr: 'Kullanıcı Bannerı',
            it: 'Banner Utente',
            ChineseCN: '用户横幅',
        })
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        // Getting the user from the context menu
        let user = client.users.fetch(interaction.targetId, { force: true });

        // Creating the reply
        user.then(async function (res) {
            // Save the banner URL in a variable
            var imgURL = res.bannerURL({ size: 4096, dynamic: true });

            // If the user has no banner, return message, else return the banner
            if (imgURL == null) {
                await interaction.reply({
                    content: ">>> This user doesn't have a banner.",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `>>> ${imgURL}`,
                    ephemeral: true,
                });
            }
        });
    },
};

export default UserBannerCommand;
