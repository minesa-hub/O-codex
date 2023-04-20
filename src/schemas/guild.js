import { model, Schema } from 'mongoose';

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
});

export default model('Guild', guildSchema, 'guilds');
