import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

const avatarCommand = {
    data: new ContextMenuCommandBuilder().setName("User Avatar").setType(ApplicationCommandType.User),
    async execute(interaction) {
        const target = interaction.guild.members.cache.get(interaction.targetId);

        await interaction.reply({
            content: `>>> ${target.user.avatarURL({
                dynamic: true,
                extension: "jpg",
                size: 4096,
            })}`,
            ephemeral: true,
        });
    },
};

export default avatarCommand;
