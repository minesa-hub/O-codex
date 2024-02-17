import { Events, GuildScheduledEventStatus } from "discord.js";
import chalk from "chalk";
import UserForScheduledEvents from "../../schemas/User.js";
import mongoose from "mongoose";

export default {
    name: Events.GuildScheduledEventUserAdd,
    once: false,
    execute: async (guildScheduledEvent, user) => {
        // if user is not fetched, we need to fetch it
        if (!user.partial) {
            console.log(
                chalk.greenBright(
                    `${user.tag} has joined the event ${guildScheduledEvent.name}`,
                ),
            );
        } else {
            try {
                await user.fetch();
                console.log(
                    chalk.greenBright(
                        `${user.tag} has joined the event ${guildScheduledEvent.name}`,
                    ),
                );
            } catch (error) {
                console.error(error);
            }
        }

        // if the user subscribed to the event, we need to add the user to the database
        if (
            guildScheduledEvent.status === GuildScheduledEventStatus.Scheduled
        ) {
            if (user && user.id) {
                const newUser = new UserForScheduledEvents({
                    _id: new mongoose.Types.ObjectId(),
                    userId: user.id, // Add the userId field
                    guildScheduledEventId: guildScheduledEvent.id,
                });
                try {
                    await newUser.save();
                    console.log(
                        chalk.greenBright(
                            `${user.tag} has joined the event ${guildScheduledEvent.name}`,
                        ),
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
};
