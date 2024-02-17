import { Events, GuildScheduledEventStatus } from "discord.js";
import chalk from "chalk";
import UserForScheduledEvents from "../../schemas/User.js";

export default {
    name: Events.GuildScheduledEventUpdate,
    once: false,
    execute: async (oldGuildScheduledEvent, newGuildScheduledEvent) => {
        // Checking if the event made by the bot
        if (
            newGuildScheduledEvent.guild.client.user.id !==
            process.env.CLIENT_ID
        ) {
            return;
        }

        // if the event is now active, we need to add all the users to the database
        if (
            oldGuildScheduledEvent.status ===
                GuildScheduledEventStatus.Scheduled &&
            newGuildScheduledEvent.status === GuildScheduledEventStatus.Active
        ) {
            const users = newGuildScheduledEvent.guild.members.cache;
            for (const user of users) {
                const newUser = new UserForScheduledEvents({
                    userId: user.id,
                    guildScheduledEventId: newGuildScheduledEvent.id,
                });
                try {
                    await newUser.save();
                    console.log(
                        chalk.greenBright(
                            `${user.tag} has joined the event ${newGuildScheduledEvent.name}`,
                        ),
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        }

        // if the event is over and the status is completed, we need to remove all the users from the database
        if (
            oldGuildScheduledEvent.status ===
                GuildScheduledEventStatus.Active &&
            newGuildScheduledEvent.status ===
                GuildScheduledEventStatus.Completed
        ) {
            const users = newGuildScheduledEvent.guild.members.cache;
            for (const user of users) {
                try {
                    await UserForScheduledEvents.findOneAndDelete({
                        userId: user.id,
                        guildScheduledEventId: newGuildScheduledEvent.id,
                    });
                    console.log(
                        chalk.greenBright(
                            `${user.tag} has left the event ${newGuildScheduledEvent.name}`,
                        ),
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
};
