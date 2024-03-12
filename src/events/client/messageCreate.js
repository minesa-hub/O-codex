import { ChannelType, Events, PermissionFlagsBits } from "discord.js";
import chalk from "chalk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_API_KEY, CLIENT_ID } from "../../config.js";

export default {
    name: Events.MessageCreate,
    once: false,
    execute: async (message, client) => {
        // const botPermissions = message.channel.permissionsFor(client.user);
        // if (
        //     !botPermissions ||
        //     !botPermissions.has(PermissionFlagsBits.CreatePublicThreads)
        // ) {
        //     return;
        // }
        // const MODEL = "gemini-pro";
        // const API_KEY = AI_API_KEY;
        // const AI = new GoogleGenerativeAI(API_KEY);
        // const model = AI.getGenerativeModel({
        //     model: MODEL,
        //     generationConfig: {
        //         topK: 1,
        //         topP: 1,
        //         temperature: 1,
        //         maxOutputTokens: 60,
        //     },
        // });
        // try {
        //     if (message.author.bot) return;
        //     const { response } = await model.generateContent(
        //         message.cleanContent,
        //     );
        //     if (
        //         message.channel.type === ChannelType.PublicThread &&
        //         message.channel.ownerId === client.user.id
        //     ) {
        //         // Simply reply to any message in the thread channel
        //         await message.channel.send({
        //             content: response.text(),
        //         });
        //     }
        //     if (message.content.includes(`<@${CLIENT_ID}>`)) {
        //         let threadTitle = message.content;
        //         // Extract the mention from the message content
        //         const mentionRegExp = /<@!?(\d+)>/;
        //         const mentionMatch = message.content.match(mentionRegExp);
        //         if (mentionMatch) {
        //             const mention = mentionMatch[0];
        //             // Remove the mention from the thread title
        //             threadTitle = threadTitle.replace(mention, "");
        //         }
        //         // Trim the thread title to 32 characters
        //         threadTitle = threadTitle.slice(0, 32).trim();
        //         const thread = await message.startThread({
        //             name: threadTitle.trim(),
        //             autoArchiveDuration: 60,
        //             type: ChannelType.PublicThread,
        //         });
        //         await thread.send({
        //             content: response.text(),
        //         });
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
    },
};
