import { ActivityType } from "discord.js";

export default {
    name: "ready",
    once: true,
    execute: async client => {
        let activities = [`neodewils`, `${client.user.username}`],
            i = 0;
        setInterval(
            () =>
                client.user.setActivity({
                    name: `${activities[i++ % activities.length]}`,
                    type: ActivityType.Listening,
                }),
            22000,
        );
    },
};
