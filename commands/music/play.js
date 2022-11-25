import { SlashCommandBuilder } from "discord.js";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption(option =>
            option.setName("song").setDescription("The song you want to play").setRequired(true),
        ),
    async execute(interaction, client) {
        const [options, channel, guild, member] = [
            interaction.options,
            interaction.channel,
            interaction.guild,
            interaction.member,
        ];

        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
            return Error(interaction, "You need to be in a voice channel to play music!");

        if (
            guild.members.me.voice.channelId &&
            VoiceChannel.id !== guild.members.me.voice.channel.id
        )
            return Error(interaction, "You need to be in the same voice channel as me!");

        try {
            client.distube.play(interaction.member.voice.channel, string, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction,
            });

            await interaction.reply({
                content: `Playing \`${options.getString("song")}\` in ${VoiceChannel.name}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return Error(interaction, "There was an error trying to execute that command!");
        }

        function Error(interaction, message) {
            interaction.reply({ content: message, ephemeral: true });
        }
    },
};

export default play;
