import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

const userBannerCommand = {
    data: new ContextMenuCommandBuilder().setName("User Banner").setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        let user = client.users.fetch(interaction.targetId, { force: true });
        user.then(async function (res) {
            var imgURL = res.bannerURL({ size: 4096, dynamic: true });
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

export default userBannerCommand;
