import { AuditLogEvent, Events, time } from "discord.js";
import { row3 } from "../../components/selectMenus/ticket-select-menu-states.js";
import { lockButton } from "../../components/modals/create-ticket-title.js";
import {
    emoji_ticket_lock,
    emoji_ticket_lockOpen,
    emoji_ticket_reopen,
} from "../../shortcuts/emojis.js";

export default {
    name: Events.ThreadUpdate,
    once: false,
    execute: async (oldThread, newThread) => {
        if (newThread.ownerId !== newThread.client.user.id) return;
        if (oldThread.archived && newThread.locked) return;

        const formattedTime = time(new Date(), "R");
        const auditLogs = await newThread.guild.fetchAuditLogs({
            type: AuditLogEvent.ThreadUpdate,
        });
        const auditLog = auditLogs.entries.first();

        if (!auditLog) return;

        const { executor } = auditLog;

        if (oldThread.archived && !newThread.archived && newThread.locked) {
            if (executor.id === newThread.client.user.id) return;

            await newThread.send({
                content: `${emoji_ticket_lockOpen} **${executor.username}** have __unlocked__ the ticket, but it is **staffs only** ${formattedTime}`,
            });
        } else if (oldThread.archived && !newThread.archived) {
            if (executor.id === newThread.client.user.id) return;

            await newThread.send({
                content: `${emoji_ticket_reopen} **${executor.username}** __re-opened__ this ticket ${formattedTime}`,
            });

            const pinnedMessages = await newThread.messages.fetchPinned();
            const pinnedMessage = pinnedMessages.first();

            if (pinnedMessage) {
                await pinnedMessage.edit({
                    components: [row3, lockButton],
                });
            } else {
                return;
                // const messages = await newThread.messages.fetch();
                // const message = messages.first();
                //
                // if (message) {
                //     await message.edit({
                //         components: [row3, lockButton],
                //     });
                // }
            }
        }

        if (oldThread.locked && !newThread.locked) {
            await newThread.send({
                content: `${emoji_ticket_lockOpen} **${executor.username}** __unlocked__ this ticket ${formattedTime}`,
            });
        } else if (!oldThread.locked && newThread.locked) {
            if (executor.id === newThread.client.user.id) return;
            if (oldThread.archived && !newThread.archived) return;

            await newThread.send({
                content: `${emoji_ticket_lock} **${executor.username}** __locked__ this ticket ${formattedTime}`,
            });
        }
    },
};
