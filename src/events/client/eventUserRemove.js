import { Events } from "discord.js";
import chalk from "chalk";
import UserForScheduledEvents from "../../schemas/UserForScheduledEvents.js";

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
                chalk.redBright(
                    `${user.tag} has left the event ${guildScheduledEvent.name}`,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    },
};
