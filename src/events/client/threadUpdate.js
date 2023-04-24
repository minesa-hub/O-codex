// Importing the required modules
import { AuditLogEvent, Events, time } from "discord.js";
import { row3 } from "../../components/selectMenus/issue-select-menu-states.js";
import { lockButton } from "../../components/modals/create-issue-title.js";

// Exporting the event
export default {
    // The event name
    name: Events.ThreadUpdate,
    // The event is once?
    once: false,
    // The event
    execute: async (oldThread, newThread) => {
        // If the thread owner is not the client then return nothing
        if (newThread.ownerId !== newThread.client.user.id) return;
        // If the thread is archived and locked then return nothing
        if (oldThread.archived && newThread.locked) {
            return;
        }

        // Getting the formatted time
        const formattedTime = time(new Date(), "R");
        // Getting the audit logs from the guild where the thread was updated
        const auditLogs = await newThread.guild.fetchAuditLogs({
            type: AuditLogEvent.ThreadUpdate,
        });
        // Getting the first entry from the audit logs
        const auditLog = auditLogs.entries.first();

        // If the audit log is not found then return nothing
        if (!auditLog) return;

        // Getting the executor from the audit log
        const { executor } = auditLog;

        // If the thread is archived and locked
        if (oldThread.archived && !newThread.archived && newThread.locked) {
            // If the executor is the client then return nothing
            if (executor.id === newThread.client.user.id) return;

            // Sending a message in the thread
            await newThread.send({
                content: `<:key:1098978684523778098> **${executor.username}** __reopened__ this but it is staffs only ${formattedTime}`,
            });
            // If the thread is archived and not locked
        } else if (oldThread.archived && !newThread.archived) {
            // If the executor is the client then return nothing
            if (executor.id === newThread.client.user.id) return;

            // Sending a message in the thread
            await newThread.send({
                content: `<:issue_reopen:1097285719577342002> **${executor.username}** __reopened__ this ${formattedTime}`,
            });

            // Getting the pinned messages from the thread
            const pinnedMessages = await newThread.messages.fetchPinned();
            // Getting the first pinned message
            const pinnedMessage = pinnedMessages.first();

            // If the pinned message is found then edit the pinned message
            if (pinnedMessage) {
                await pinnedMessage.edit({
                    components: [row3, lockButton],
                });
            } else {
                // Getting the messages from the thread
                const messages = await newThread.messages.fetch();
                // Getting the first message
                const message = messages.first();

                // If the message is found then edit the message
                if (message) {
                    await message.edit({
                        components: [row3, lockButton],
                    });
                }
            }
        }
        // If the thread is not archived and locked
        if (oldThread.locked && !newThread.locked) {
            // sending a message in the thread
            await newThread.send({
                content: `<:key:1098978684523778098> **${executor.username}** __unlocked__ this conversation ${formattedTime}`,
            });
            // If the thread is not archived and locked
        } else if (!oldThread.locked && newThread.locked) {
            // If the executor is the client then return nothing
            if (executor.id === newThread.client.user.id) return;
            // If the thread is archived and not locked then return nothing
            if (oldThread.archived && !newThread.archived) return;

            // Sending a message in the thread
            await newThread.send({
                content: `<:lock:1098978659890626671> **${executor.username}** __locked__ this conversation ${formattedTime}`,
            });
        }
    },
};
