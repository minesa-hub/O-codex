// Import the mongoose package and destructuring the model and Schema properties
import { model, Schema } from "mongoose";

// defining the guild schema
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
});

// exporting the model
export default model("Guild", guildSchema, "guilds");
