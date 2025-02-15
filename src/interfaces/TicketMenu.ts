import { emojis } from "../shortcuts/emojis.ts";

interface TicketMenuOption {
    label: string;
    value: string;
    description: string;
    emoji: string;
    default?: boolean;
}

const ticketMenuOptions: TicketMenuOption[] = [
    {
        label: "Close as completed",
        value: "ticket-menu-close",
        description: "Done, closed, fixed, resolved",
        emoji: emojis.ticketDone,
        default: false,
    },
    {
        label: "Close as not planned",
        value: "ticket-menu-duplicate",
        description: "Won't fix, can't repo, duplicate, stale",
        emoji: emojis.ticketStale,
    },
];

export { ticketMenuOptions, TicketMenuOption };
