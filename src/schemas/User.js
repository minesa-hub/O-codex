import { model, Schema } from 'mongoose';

let userSchema = new Schema({
    GuildID: String,
    UserID: String,
});

export default model('userSchema', userSchema);
