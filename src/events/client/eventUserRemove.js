import { Events } from "discord.js";
import chalk from "chalk";
import UserForScheduledEvents from "../../schemas/User.js";

export default {
    name: Events.GuildScheduledEventUserRemove,
    once: false,
    execute: async (guildScheduledEvent, user) => {
        try {
            await UserForScheduledEvents.deleteOne({
                userId: user.id,
                guildScheduledEventId: guildScheduledEvent.id,
            });
            console.log(
                chalk.greenBright(
                    `${user.tag} has left the event ${guildScheduledEvent.name}`,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    },
};
