import { Schema, model } from "mongoose";

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: { type: String, required: true, unique: true },
    guildScheduledEventId: { type: String, required: true, unique: true },
});

const UserForScheduledEvents = model("User", userSchema, "users");

export default UserForScheduledEvents;
