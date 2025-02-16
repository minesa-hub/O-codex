import { ActivityType, PresenceUpdateStatus } from "discord.js";

export const botPresence = {
    status: PresenceUpdateStatus.Idle,
    activities: [
        {
            name: "Pro-tickets",
            type: ActivityType.Playing,
            state: "Serving Pro-tickets for your community",
        },
    ],
};
