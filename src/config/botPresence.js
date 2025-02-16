import { ActivityType, PresenceUpdateStatus } from "discord.js";

/**
 * Bot is presence.
 */
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
