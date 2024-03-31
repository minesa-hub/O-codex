import { EmbedBuilder, Events } from "discord.js";
import { checkLoggingChannel } from "../../shortcuts/database.js";

export default {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (member) => {
        const guild = member.guild;
        const accountAge = new Date() - member.user.createdTimestamp;
        const oneDayInMillis = 1000 * 60 * 60 * 24;
        const sevenDaysInMillis = oneDayInMillis * 7;
        const channelId = await checkLoggingChannel(guild.id);
        const channel = guild.channels.cache.get(channelId);

        if (accountAge < sevenDaysInMillis) {
            try {
                await member.send(
                    `You might be questioning why are you timeouted; since your account is younger than 7 days, we have restricted you temporarily.`
                );

                const embed = new EmbedBuilder()
                    .setTitle("New Account!")
                    .setDescription(
                        `User <@${member.user.id}> has joined the server. Their account is younger than 7 days. They have been temporarily restricted. Aka they are timeouted for one week.`
                    )
                    .setColor(0xfa996b)
                    .setFooter({
                        text: guild.name,
                        iconURL: guild.iconURL(),
                    });
                await member
                    .disableCommunicationUntil(
                        new Date(Date.now() + oneDayInMillis),
                        `Account is younger than 7 days.`
                    )
                    .catch(console.error);
                if (channel) {
                    const logginChannel = await guild.channels.fetch(channelId);

                    await logginChannel.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error("Failed to send message to channel:", error);
            }
        }
    },
};
