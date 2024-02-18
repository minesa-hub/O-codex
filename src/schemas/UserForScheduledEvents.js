import mongoose from "mongoose";

const userForScheduledEventsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildScheduledEventId: { type: String, required: true },
});

export default mongoose.model(
    "UserForScheduledEvents",
    userForScheduledEventsSchema,
);
