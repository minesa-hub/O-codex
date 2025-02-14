import { client } from "./exports.ts";
import dotenv from "dotenv";

dotenv.config();

export const botLogin = async () => {
    console.log("Logging in...");

    try {
        await client.login(process.env.CLIENT_TOKEN);
        console.log("Bot logged in successfully.");
    } catch (error) {
        console.error("Failed to log in:", error);
        throw error;
    }
};
